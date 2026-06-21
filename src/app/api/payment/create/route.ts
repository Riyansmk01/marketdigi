import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, keterangan, order_id } = body

    if (!amount || !order_id) {
      return NextResponse.json(
        { status: false, message: 'Amount and order_id are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.KLIKQRIS_API_KEY || ''
    const merchantId = process.env.KLIKQRIS_MERCHANT_ID || ''

    if (!apiKey || !merchantId) {
      console.error('[payment/create] Missing KLIKQRIS_API_KEY or KLIKQRIS_MERCHANT_ID env vars')
      return NextResponse.json(
        { status: false, message: 'Server misconfiguration: payment credentials missing' },
        { status: 500 }
      )
    }

    const payload = {
      order_id: order_id,
      id_merchant: merchantId,
      amount: Number(amount),
      keterangan: keterangan || 'Pembayaran Produk Digital Marketdigi',
    }

    const response = await fetch('https://klikqris.com/api/qris/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'id_merchant': merchantId,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      console.error('[payment/create] KlikQRIS error:', data)
      return NextResponse.json(
        { status: false, message: data.message || 'Gagal membuat transaksi QRIS' },
        { status: response.status || 502 }
      )
    }

    // --- Double Security: Save signature + expired_at using admin client (bypasses RLS) ---
    try {
      const { data: orderResult, error: orderErr } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('invoice_no', order_id)
        .maybeSingle()

      if (orderErr) {
        console.warn('[payment/create] DB lookup error (non-fatal):', orderErr.message)
      }

      if (orderResult && data.data?.signature) {
        // Upsert to avoid duplicate key errors on retry
        const { error: txErr } = await supabaseAdmin
          .from('payment_transactions')
          .upsert(
            {
              order_id: orderResult.id,
              payment_method: 'QRIS',
              status: 'pending',
              amount_request: Number(amount),
              signature: data.data.signature,
              expired_at: data.data.expired_at,
            },
            { onConflict: 'signature' }
          )

        if (txErr) {
          console.warn('[payment/create] Could not save payment signature (non-fatal):', txErr.message)
        } else {
          console.log(`[payment/create] Saved transaction signature for invoice: ${order_id}`)
        }
      }
    } catch (dbErr) {
      // Non-fatal: don't fail the user request if DB logging fails
      console.error('[payment/create] DB logging error (non-fatal):', dbErr)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[payment/create] Unhandled error:', error)
    return NextResponse.json(
      { status: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
