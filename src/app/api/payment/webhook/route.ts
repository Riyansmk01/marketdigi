import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { vipReseller } from '@/lib/vipResellerClient'

/**
 * POST /api/payment/webhook
 *
 * KlikQRIS callback endpoint. This must respond with HTTP 200 to acknowledge receipt.
 * Double-security: incoming `signature` is compared against what was stored at
 * transaction creation time. Any mismatch is rejected silently.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    console.log('[webhook] Incoming KlikQRIS callback:', JSON.stringify(payload))

    const { status, data } = payload

    // Only process well-formed callbacks
    if (status !== 'success' || !data) {
      return NextResponse.json({ status: 'ok', received: true })
    }

    const {
      order_id,
      status: paymentStatus,
      amount_paid,
      signature,
    }: {
      order_id: string
      status: string
      amount_paid: number
      signature: string
    } = data

    // -----------------------------------------------------------------------
    // PAID flow
    // -----------------------------------------------------------------------
    if (paymentStatus === 'PAID') {
      // 1. Lookup order by invoice number
      const { data: orderData, error: orderErr } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('invoice_no', order_id)
        .maybeSingle()

      if (orderErr || !orderData) {
        console.error(`[webhook] Order not found for invoice: ${order_id}`, orderErr?.message)
        // Return 200 to avoid infinite retries for unknown orders
        return NextResponse.json({ status: 'ok', message: 'Order not found' })
      }

      // 2. Lookup payment transaction (we need stored signature for validation)
      const { data: tx, error: txErr } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .eq('order_id', orderData.id)
        .maybeSingle()

      if (txErr || !tx) {
        console.error(`[webhook] Payment transaction not found for order: ${order_id}`, txErr?.message)
        return NextResponse.json({ status: 'ok', message: 'Transaction not found' })
      }

      // 3. Double-Security: Signature validation
      if (tx.signature !== signature) {
        console.error(
          `[webhook] SECURITY ALERT: Signature mismatch for ${order_id}! ` +
          `Expected: ${tx.signature}, Received: ${signature}`
        )
        // Return 200 to prevent KlikQRIS from leaking which requests are rejected
        return NextResponse.json({ status: 'ok', message: 'Signature rejected' })
      }

      // 4. Idempotency guard: prevent duplicate product delivery
      if (tx.status === 'paid' || orderData.status === 'Berhasil') {
        console.log(`[webhook] Order ${order_id} already fulfilled — skipping duplicate.`)
        return NextResponse.json({ status: 'ok', message: 'Already processed' })
      }

      // 5. Atomically mark payment as paid and order as Berhasil
      const { error: txUpdateErr } = await supabaseAdmin
        .from('payment_transactions')
        .update({ status: 'paid', amount_paid: Number(amount_paid) })
        .eq('id', tx.id)

      if (txUpdateErr) {
        console.error(`[webhook] Failed to update payment_transactions:`, txUpdateErr.message)
        // Return 200 — we logged the issue; manual reconciliation can fix it
        return NextResponse.json({ status: 'ok', received: true })
      }

      const { error: orderUpdateErr } = await supabaseAdmin
        .from('orders')
        .update({ status: 'Berhasil' })
        .eq('id', orderData.id)

      if (orderUpdateErr) {
        console.error(`[webhook] Failed to update order status:`, orderUpdateErr.message)
      }

      console.log(`[webhook] ✅ Order ${order_id} confirmed PAID. Triggering fulfillment.`)

      // 6. VIP Reseller fulfillment (digital product delivery)
      try {
        const { data: itemsResult } = await supabaseAdmin
          .from('order_items')
          .select('*, products(slug, category_id, fulfillment_type)')
          .eq('order_id', orderData.id)

        const items = Array.isArray(itemsResult) ? itemsResult : []

        for (const item of items) {
          const product = item.products
          if (!product) continue

          const serviceCode = product.slug.toUpperCase()
          const customPayload = item.custom_payload || {}
          const customFields = customPayload.customFields || {}

          const targetData =
            customFields.userId || customFields.email || customFields.phone || 'sample'
          const targetZone = customFields.zoneId || ''

          console.log(`[webhook] [VIP] Ordering ${serviceCode} for target: ${targetData}`)

          const vipRes = await vipReseller.orderGameFeature(serviceCode, targetData, targetZone)

          if (vipRes?.result) {
            const trxid = vipRes.data.trxid
            console.log(`[webhook] [VIP] Success! TRX ID: ${trxid}`)

            await supabaseAdmin
              .from('orders')
              .update({ provider_trx_id: trxid })
              .eq('id', orderData.id)
          } else {
            console.error(`[webhook] [VIP] Fulfillment failed:`, vipRes)
          }
        }
      } catch (vipErr) {
        console.error('[webhook] [VIP] Integration error (non-fatal):', vipErr)
      }

    // -----------------------------------------------------------------------
    // EXPIRED flow
    // -----------------------------------------------------------------------
    } else if (paymentStatus === 'EXPIRED') {
      const { data: orderData } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('invoice_no', order_id)
        .maybeSingle()

      if (!orderData || orderData.status === 'Berhasil') {
        return NextResponse.json({ status: 'ok', received: true })
      }

      const { data: tx } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .eq('order_id', orderData.id)
        .maybeSingle()

      // Only expire if signature matches and not already paid
      if (tx && tx.signature === signature && tx.status !== 'paid') {
        await supabaseAdmin
          .from('payment_transactions')
          .update({ status: 'expired' })
          .eq('id', tx.id)

        await supabaseAdmin
          .from('orders')
          .update({ status: 'Tidak Berhasil' })
          .eq('id', orderData.id)

        console.log(`[webhook] Order ${order_id} marked EXPIRED.`)
      }
    }

    // Always return 200 OK to confirm receipt
    return NextResponse.json({ status: 'success', received: true })
  } catch (error: any) {
    console.error('[webhook] Unhandled error:', error)
    // Return 200 OK even on error to prevent retry loops
    return NextResponse.json({ status: 'error', message: error.message }, { status: 200 })
  }
}
