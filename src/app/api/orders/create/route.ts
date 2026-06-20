import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: Request) {
  try {
    // --- Auth: verify user token from Authorization header ---
    const authHeader = request.headers.get('authorization')
    const token = authHeader ? authHeader.replace('Bearer ', '') : undefined

    const { data: { user }, error: authErr } = token
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser()

    if (authErr || !user) {
      return NextResponse.json(
        { status: false, message: 'Harap login terlebih dahulu untuk membuat pesanan.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, subtotal, serviceFee, total, paymentMethod } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ status: false, message: 'Keranjang kosong.' }, { status: 400 })
    }

    // --- Generate Invoice Number ---
    const dateObj = new Date()
    const invoiceNo =
      'INV-' +
      dateObj.getFullYear() +
      (dateObj.getMonth() + 1).toString().padStart(2, '0') +
      dateObj.getDate().toString().padStart(2, '0') +
      '-' +
      Math.floor(1000 + Math.random() * 9000)

    // --- Find store_id from first product ---
    const firstItem = items[0]
    const { data: productData } = await supabaseAdmin
      .from('products')
      .select('store_id')
      .eq('id', firstItem.id)
      .maybeSingle()

    let storeId = productData?.store_id
    if (!storeId) {
      const { data: fallbackStores } = await supabaseAdmin
        .from('stores')
        .select('id')
        .limit(1)
      if (fallbackStores && fallbackStores.length > 0) {
        storeId = fallbackStores[0].id
      } else {
        return NextResponse.json(
          { status: false, message: 'Toko produk tidak valid.' },
          { status: 400 }
        )
      }
    }

    // --- 1. Insert order ---
    const { data: newOrder, error: insertOrderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        buyer_id: user.id,
        store_id: storeId,
        invoice_no: invoiceNo,
        subtotal: Number(subtotal),
        service_fee: Number(serviceFee),
        total: Number(total),
        status: 'Proses',
      })
      .select('id, invoice_no, total, status, created_at')
      .maybeSingle()

    if (insertOrderErr || !newOrder) {
      console.error('[orders/create] Order insert error:', insertOrderErr)
      return NextResponse.json(
        { status: false, message: 'Gagal menyimpan pesanan ke database.' },
        { status: 500 }
      )
    }

    // --- 2. Insert order items ---
    const orderItemsPayload = items.map((item: any) => ({
      order_id: newOrder.id,
      product_id: item.id,
      qty: Number(item.qty),
      price: Number(item.price),
      custom_payload: {
        variant: item.variant,
        customFields: item.customFields,
        note: item.note,
      },
    }))

    const { error: insertItemsErr } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsPayload)

    if (insertItemsErr) {
      console.error('[orders/create] Order items insert error (non-fatal):', insertItemsErr)
    }

    // --- Format response to match checkout page schema ---
    return NextResponse.json({
      status: true,
      data: {
        id: newOrder.id,
        invoiceNo: newOrder.invoice_no,
        items,
        subtotal: Number(subtotal),
        serviceFee: Number(serviceFee),
        total: Number(total),
        paymentMethod,
        status: newOrder.status,
        createdAt: newOrder.created_at,
      },
    })
  } catch (error: any) {
    console.error('[orders/create] Unhandled error:', error)
    return NextResponse.json(
      { status: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
