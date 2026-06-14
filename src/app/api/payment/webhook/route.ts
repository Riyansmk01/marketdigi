import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { vipReseller } from '@/lib/vipResellerClient'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log('Incoming QRIS Webhook:', payload)

    const { status, data } = payload

    if (status === 'success' && data) {
      const { order_id, status: paymentStatus, amount_paid, signature } = data

      if (paymentStatus === 'PAID') {
        // 1. Find the order in our database using invoice number
        const { data: orderResult, error: orderErr } = await supabase
          .from('orders')
          .select('id, status')
          .eq('invoice_no', order_id)
        const orderData = Array.isArray(orderResult) ? orderResult[0] : null

        if (orderErr || !orderData) {
          console.error(`Webhook Error: Order invoice ${order_id} not found in database.`)
          return NextResponse.json({ status: 'ok', message: 'Order not found' })
        }

        // 2. Find the payment transaction for double security validation
        const { data: txResult, error: txErr } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('order_id', orderData.id)
        const tx = Array.isArray(txResult) ? txResult[0] : null

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

        // ==========================================
        // TRIGGER VIP RESELLER INTEGRATION
        // ==========================================
        try {
          const { data: itemsResult } = await supabase
            .from('order_items')
            .select('*, products(slug, category_id, fulfillment_type)')
            .eq('order_id', orderData.id)
          
          const items = Array.isArray(itemsResult) ? itemsResult : []

          for (const item of items) {
            const product = item.products
            if (!product) continue

            // Jika fulfillment_type adalah 'Akun Digital' atau Top-Up
            // Asumsi MVP: Slug product menyimpan service_code VIP Reseller, misal 'VIP-ML14'
            const serviceCode = product.slug.toUpperCase()
            const payload = item.custom_payload || {}
            const customFields = payload.customFields || {}
            
            // Ambil data tujuan dari form cart (customFields)
            const targetData = customFields.userId || customFields.email || customFields.phone || 'sample'
            const targetZone = customFields.zoneId || ''

            console.log(`[VIP RESELLER] Ordering ${serviceCode} for target: ${targetData}`)

            // Pilih fungsi berdasarkan kategori
            // Secara default kita tembak Game Feature untuk MVP ini
            const vipRes = await vipReseller.orderGameFeature(serviceCode, targetData, targetZone)
            
            if (vipRes && vipRes.result) {
              const trxid = vipRes.data.trxid
              console.log(`[VIP RESELLER] Success! TRX ID: ${trxid}`)
              
              // Simpan trxid ke tabel orders agar bisa dicek oleh Webhook VIP
              await supabase
                .from('orders')
                .update({ provider_trx_id: trxid })
                .eq('id', orderData.id)
            } else {
              console.error(`[VIP RESELLER] Failed to order:`, vipRes)
            }
          }
        } catch (vipErr) {
          console.error('[VIP RESELLER] Integration Error:', vipErr)
        }
        // ==========================================
      } else if (paymentStatus === 'EXPIRED') {
        // Handle EXPIRED status
        const { data: orderResult } = await supabase
          .from('orders')
          .select('id, status')
          .eq('invoice_no', order_id)
        const orderData = Array.isArray(orderResult) ? orderResult[0] : null

        if (orderData && orderData.status !== 'Berhasil') {
          // Verify signature as well for security
          const { data: txResult } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('order_id', orderData.id)
          const tx = Array.isArray(txResult) ? txResult[0] : null
          
          if (tx && tx.signature === signature && tx.status !== 'paid') {
            console.log(`Payment EXPIRED for Order ID: ${order_id}. Updating status.`)
            
            await supabase
              .from('payment_transactions')
              .update({ status: 'expired' })
              .eq('id', tx.id)

            await supabase
              .from('orders')
              .update({ status: 'Kedaluwarsa' })
              .eq('id', orderData.id)
          }
        }
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
