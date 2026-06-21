import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const order_id = searchParams.get('order_id')

    if (!order_id) {
      return NextResponse.json(
        { status: false, message: 'order_id is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.KLIKQRIS_API_KEY || ''
    const merchantId = process.env.KLIKQRIS_MERCHANT_ID || ''

    // --- 1. Check local database first (fastest path) ---
    try {
      const { data: orderData, error: orderErr } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('invoice_no', order_id)
        .maybeSingle()

      if (orderErr) {
        console.warn('[payment/status] DB order lookup error:', orderErr.message)
      }

      if (orderData) {
        const { data: tx, error: txErr } = await supabaseAdmin
          .from('payment_transactions')
          .select('*')
          .eq('order_id', orderData.id)
          .maybeSingle()

        if (txErr) {
          console.warn('[payment/status] DB tx lookup error:', txErr.message)
        }

        if (tx?.status === 'paid') {
          console.log(`[payment/status] Order ${order_id} found PAID in database.`)
          return NextResponse.json({
            status: true,
            data: {
              order_id,
              status: 'PAID',
              total_amount: Number(tx.amount_paid ?? tx.amount_request),
            },
          })
        }
      }
    } catch (dbErr) {
      console.warn('[payment/status] DB check failed, falling back to KlikQRIS API:', dbErr)
    }

    // --- 2. Fallback: query KlikQRIS directly ---
    const url = `https://klikqris.com/api/qris/status/${order_id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'id_merchant': merchantId,
      },
      // Ensure we get a fresh response every time (no CDN caching)
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      return NextResponse.json(
        { status: false, message: data.message || 'Gagal mengecek status QRIS' },
        { status: response.status || 502 }
      )
    }

    // --- 3. Self-healing: Sync DB if KlikQRIS says PAID but our DB is stale ---
    const gatewayStatus: string = data.data?.status ?? ''
    if (gatewayStatus === 'SUCCESS' || gatewayStatus === 'PAID') {
      try {
        const { data: orderData2 } = await supabaseAdmin
          .from('orders')
          .select('id, status')
          .eq('invoice_no', order_id)
          .maybeSingle()

        if (orderData2) {
          const { data: tx2 } = await supabaseAdmin
            .from('payment_transactions')
            .select('*')
            .eq('order_id', orderData2.id)
            .maybeSingle()

          if (tx2 && tx2.status !== 'paid') {
            const amountPaid = Number(data.data.total_amount)

            await supabaseAdmin
              .from('payment_transactions')
              .update({ status: 'paid', amount_paid: amountPaid })
              .eq('id', tx2.id)

            await supabaseAdmin
              .from('orders')
              .update({ status: 'Berhasil' })
              .eq('id', orderData2.id)

            console.log(`[payment/status] Self-healing: Synced PAID status for order ${order_id}`)
          }
        }
      } catch (syncErr) {
        console.error('[payment/status] Self-healing sync error:', syncErr)
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[payment/status] Unhandled error:', error)
    return NextResponse.json(
      { status: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
