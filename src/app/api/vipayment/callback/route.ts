import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('X-Client-Signature')
    const apiId = process.env.VIP_RESELLER_API_ID || ''
    const apiKey = process.env.VIP_RESELLER_API_KEY || ''
    const expectedSignature = crypto.createHash('md5').update(apiId + apiKey).digest('hex')

    if (!signature || signature !== expectedSignature) {
      console.error('VIP Webhook: Invalid signature', { received: signature, expected: expectedSignature })
      return NextResponse.json({ status: false, message: 'Invalid signature' }, { status: 401 })
    }

    const payload = await request.json()
    console.log('VIP Reseller Webhook payload:', payload)

    // Format is either directly the fields, or nested in "data"
    const data = payload.data ? payload.data : payload
    const trxid = data.trxid
    const status = data.status // waiting / processing / success / error
    const note = data.note

    if (!trxid) {
      return NextResponse.json({ status: false, message: 'Missing trxid' }, { status: 400 })
    }

    // Find the order that matches this VIP transaction ID
    // Note: requires `provider_trx_id` column to be added to `orders` table
    const { data: orderResult, error: orderErr } = await supabase
      .from('orders')
      .select('id, status')
      .eq('provider_trx_id', trxid)
    
    const orderData = Array.isArray(orderResult) ? orderResult[0] : null

    if (orderErr || !orderData) {
      console.error(`VIP Webhook: Order with trxid ${trxid} not found.`, orderErr)
      // Return 200 to acknowledge receipt and prevent retries, even if not found locally
      return NextResponse.json({ status: true, message: 'Order not found' })
    }

    let newStatus = orderData.status
    if (status === 'success') {
      newStatus = 'Berhasil'
    } else if (status === 'error') {
      newStatus = 'Tidak Berhasil'
    } else {
      // processing / waiting -> keep as Proses
      newStatus = 'Proses'
    }

    if (newStatus !== orderData.status) {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderData.id)

      console.log(`VIP Webhook: Order ${orderData.id} updated to ${newStatus}`)
      
      // If error, log it somewhere or add to note? For now just update status.
      if (status === 'error' && note) {
        console.error(`VIP Webhook Error Note for ${orderData.id}: ${note}`)
      }
    }

    return NextResponse.json({ status: true, message: 'Webhook processed' })
  } catch (error: any) {
    console.error('VIP Webhook handling error:', error)
    return NextResponse.json({ status: false, message: error.message }, { status: 500 })
  }
}
