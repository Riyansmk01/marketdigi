import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const order_id = searchParams.get('order_id')

    if (!order_id) {
      return NextResponse.json({ status: false, message: 'order_id is required' }, { status: 400 })
    }

    // 1. Check local database first for PAID status
    try {
      const { data: orderResult } = await supabase
        .from('orders')
        .select('id, status')
        .eq('invoice_no', order_id)
      const orderData = Array.isArray(orderResult) ? orderResult[0] : null

      if (orderData) {
        const { data: txResult } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('order_id', orderData.id)
        const tx = Array.isArray(txResult) ? txResult[0] : null

        if (tx && tx.status === 'paid') {
          console.log(`Status API: Order ${order_id} found PAID in database. Returning success.`)
          return NextResponse.json({
            status: true,
            data: {
              order_id: order_id,
              status: 'PAID',
              total_amount: Number(tx.amount_paid || tx.amount_request)
            }
          })
        }
      }
    } catch (dbErr) {
      console.warn('Database check failed, falling back directly to KlikQRIS API:', dbErr)
    }

    // 2. Fallback: Query klikqris.com directly
    const apiKey = process.env.KLIKQRIS_API_KEY || ''
    const merchantId = process.env.KLIKQRIS_MERCHANT_ID || ''
    const url = `https://klikqris.com/api/qrisv2/status/${merchantId}/${order_id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'id_merchant': merchantId
      }
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      return NextResponse.json({
        status: false,
        message: data.message || 'Gagal mengecek status QRIS'
      }, { status: response.status })
    }

    // 3. Self-Healing: If KlikQRIS reports PAID/SUCCESS but our DB doesn't know yet, update DB
    const gatewayStatus = data.data?.status
    if (gatewayStatus === 'SUCCESS' || gatewayStatus === 'PAID') {
      try {
        const { data: orderResult2 } = await supabase
          .from('orders')
          .select('id, status')
          .eq('invoice_no', order_id)
        const orderData2 = Array.isArray(orderResult2) ? orderResult2[0] : null

        if (orderData2) {
          const { data: txResult2 } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('order_id', orderData2.id)
          const tx2 = Array.isArray(txResult2) ? txResult2[0] : null

          if (tx2 && tx2.status !== 'paid') {
            const amountPaid = Number(data.data.total_amount)
            await supabase
              .from('payment_transactions')
              .update({ status: 'paid', amount_paid: amountPaid })
              .eq('id', tx2.id)

            await supabase
              .from('orders')
              .update({ status: 'Berhasil' })
              .eq('id', orderData2.id)
            console.log(`Self-Healing: Synchronized PAID status for order ${order_id} via Status Check fallback.`)
          }
        }
      } catch (syncErr) {
        console.error('Self-healing synchronization failed:', syncErr)
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error checking status:', error)
    return NextResponse.json({ status: false, message: error.message || 'Internal server error' }, { status: 500 })
  }
}
