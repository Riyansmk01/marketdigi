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
      const { data: orderData } = await supabase
        .from('orders')
        .select('id, status')
        .eq('invoice_no', order_id)
        .single()

      if (orderData) {
        const { data: tx } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('order_id', orderData.id)
          .single()

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
    const url = `https://klikqris.com/api/qrisv2/status/177929799620/${order_id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': 'QDHKVXNSOHPdJbKWACwFieYWXsHH8Vmhdr2SKQXP',
        'id_merchant': '177929799620'
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
        const { data: orderData } = await supabase
          .from('orders')
          .select('id, status')
          .eq('invoice_no', order_id)
          .single()

        if (orderData) {
          const { data: tx } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('order_id', orderData.id)
            .single()

          if (tx && tx.status !== 'paid') {
            const amountPaid = Number(data.data.total_amount)
            await supabase
              .from('payment_transactions')
              .update({ status: 'paid', amount_paid: amountPaid })
              .eq('id', tx.id)

            await supabase
              .from('orders')
              .update({ status: 'Berhasil' })
              .eq('id', orderData.id)
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
