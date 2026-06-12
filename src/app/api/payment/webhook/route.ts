import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log('Incoming QRIS Webhook:', payload)

    const { status, data } = payload

    if (status === 'success' && data) {
      const { order_id, status: paymentStatus, amount_paid, signature } = data

      if (paymentStatus === 'PAID') {
        // 1. Find the order in our database using invoice number
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('id, status')
          .eq('invoice_no', order_id)
          .single()

        if (orderErr || !orderData) {
          console.error(`Webhook Error: Order invoice ${order_id} not found in database.`)
          return NextResponse.json({ status: 'ok', message: 'Order not found' })
        }

        // 2. Find the payment transaction for double security validation
        const { data: tx, error: txErr } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('order_id', orderData.id)
          .single()

        if (txErr || !tx) {
          console.error(`Webhook Error: Payment transaction for order ${order_id} not found.`)
          return NextResponse.json({ status: 'ok', message: 'Transaction not found' })
        }

        // 3. Double Security: Compare signatures to prevent fake webhook requests
        if (tx.signature !== signature) {
          console.error(`SECURITY ALERT: Webhook signature mismatch for order ${order_id}! Expected: ${tx.signature}, Received: ${signature}`)
          return NextResponse.json({ status: 'error', message: 'Signature mismatch' }, { status: 400 })
        }

        // 4. Prevent duplicate delivery: Check if transaction has already been processed
        if (tx.status === 'paid' || orderData.status === 'Berhasil') {
          console.log(`Webhook Ignored: Order ${order_id} has already been fulfilled. Preventing duplicate delivery.`)
          return NextResponse.json({ status: 'ok', message: 'Already processed' })
        }

        // 5. Update transaction status & fulfill order
        console.log(`Payment confirmed PAID. Transitioning Order ID: ${order_id} to SUCCESS.`)
        
        // Update transaction status
        await supabase
          .from('payment_transactions')
          .update({ status: 'paid', amount_paid: Number(amount_paid) })
          .eq('id', tx.id)

        // Update order status to 'Berhasil'
        await supabase
          .from('orders')
          .update({ status: 'Berhasil' })
          .eq('id', orderData.id)
      }
    }

    // Always respond with 200 OK to klikqris callback server to confirm receipt
    return NextResponse.json({ status: 'success', received: true })
  } catch (error: any) {
    console.error('Error handling webhook callback:', error)
    // Return 200 OK to prevent webhook retry loops if it is an unhandled format
    return NextResponse.json({ status: 'error', message: error.message }, { status: 200 })
  }
}
