import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, keterangan, order_id } = body

    if (!amount || !order_id) {
      return NextResponse.json({ status: false, message: 'Amount and order_id are required' }, { status: 400 })
    }

    const payload = {
      order_id: order_id,
      id_merchant: '177929799620',
      amount: Number(amount),
      keterangan: keterangan || 'Pembayaran Produk Digital Marketdigi'
    }

    const response = await fetch('https://klikqris.com/api/qrisv2/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'QDHKVXNSOHPdJbKWACwFieYWXsHH8Vmhdr2SKQXP',
        'id_merchant': '177929799620'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      return NextResponse.json({
        status: false,
        message: data.message || 'Gagal membuat transaksi QRIS'
      }, { status: response.status })
    }

    // Double Security: Save transaction details (signature & expired_at) to database
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select('id')
        .eq('invoice_no', order_id)
        .single()

      if (orderData && data.data && data.data.signature) {
        // Insert signature for double-security validation on webhook
        await supabase
          .from('payment_transactions')
          .insert({
            order_id: orderData.id,
            payment_method: 'QRIS',
            status: 'pending',
            amount_request: Number(amount),
            signature: data.data.signature,
            expired_at: data.data.expired_at
          })
        console.log(`Saved transaction signature for invoice: ${order_id}`)
      }
    } catch (dbErr) {
      // Log DB error but don't fail the user checkout creation
      console.error('Error logging payment signature in database:', dbErr)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ status: false, message: error.message || 'Internal server error' }, { status: 500 })
  }
}
