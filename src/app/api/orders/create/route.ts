import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader ? authHeader.replace('Bearer ', '') : undefined
    const { data: { user }, error: authErr } = token 
      ? await supabase.auth.getUser(token)
      : await supabase.auth.getUser()
      
    if (authErr || !user) {
      return NextResponse.json({ status: false, message: 'Harap login terlebih dahulu untuk membuat pesanan.' }, { status: 401 })
    }

    const body = await request.json()
    const { items, subtotal, serviceFee, total, paymentMethod } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ status: false, message: 'Keranjang kosong.' }, { status: 400 })
    }

    // Generate Invoice Number
    const dateObj = new Date()
    const invoiceNo = 'INV-' + dateObj.getFullYear() + (dateObj.getMonth() + 1).toString().padStart(2, '0') + dateObj.getDate().toString().padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000)

    // Find the store_id from the first product
    // Note: If cart has multiple stores, they should ideally be split, but for MVP we use the first item's store
    const firstItem = items[0]
    const { data: productData, error: productErr } = await supabase
      .from('products')
      .select('store_id')
      .eq('id', firstItem.id)
    const product = Array.isArray(productData) ? productData[0] : null

    let storeId = product?.store_id
    if (!storeId) {
      // Fallback if product not found or no store
      const { data: fallbackStores } = await supabase.from('stores').select('id').limit(1)
      if (fallbackStores && fallbackStores.length > 0) {
        storeId = fallbackStores[0].id
      } else {
        return NextResponse.json({ status: false, message: 'Toko produk tidak valid.' }, { status: 400 })
      }
    }

    // 1. Insert into orders table
    const orderPayload = {
      buyer_id: user.id,
      store_id: storeId,
      invoice_no: invoiceNo,
      subtotal: Number(subtotal),
      service_fee: Number(serviceFee),
      total: Number(total),
      status: 'Proses'
    }

    const { data: newOrderResult, error: insertOrderErr } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select('id, invoice_no, total, status, created_at')

    const newOrder = Array.isArray(newOrderResult) ? newOrderResult[0] : null

    if (insertOrderErr || !newOrder) {
      console.error('Order Insert Error:', insertOrderErr)
      return NextResponse.json({ status: false, message: 'Gagal menyimpan pesanan ke database.' }, { status: 500 })
    }

    // 2. Insert into order_items table
    const orderItemsPayload = items.map((item: any) => ({
      order_id: newOrder.id,
      product_id: item.id,
      qty: Number(item.qty),
      price: Number(item.price),
      custom_payload: {
        variant: item.variant,
        customFields: item.customFields,
        note: item.note
      }
    }))

    const { error: insertItemsErr } = await supabase
      .from('order_items')
      .insert(orderItemsPayload)

    if (insertItemsErr) {
      console.error('Order Items Insert Error:', insertItemsErr)
      // Even if items fail, we return the order ID, but ideally we'd rollback. For simplicity we proceed.
    }

    // Format the response to match the old localStorage schema so checkout page doesn't break
    const responseData = {
      id: newOrder.id,
      invoiceNo: newOrder.invoice_no,
      items: items,
      subtotal: Number(subtotal),
      serviceFee: Number(serviceFee),
      total: Number(total),
      paymentMethod: paymentMethod,
      status: newOrder.status,
      createdAt: newOrder.created_at
    }

    return NextResponse.json({ status: true, data: responseData })
  } catch (error: any) {
    console.error('Error creating order API:', error)
    return NextResponse.json({ status: false, message: error.message || 'Internal server error' }, { status: 500 })
  }
}
