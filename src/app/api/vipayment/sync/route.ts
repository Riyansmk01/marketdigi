import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { vipReseller } from '@/lib/vipResellerClient'

export async function POST(request: Request) {
  try {
    // 1. Otorisasi - pastikan yang memanggil adalah Admin
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ status: false, message: 'Unauthorized: Missing token' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (!user || authErr) {
      return NextResponse.json({ status: false, message: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id)
    const role = Array.isArray(userData) ? userData[0]?.role : null
    if (role !== 'admin') {
      return NextResponse.json({ status: false, message: 'Forbidden: Admin only' }, { status: 403 })
    }

    // 2. Ambil parameter sinkronisasi
    const body = await request.json()
    const markupPercentage = Number(body.markupPercentage) || 10 // Default 10% keuntungan
    const type = body.type || 'game' // game atau prepaid

    // 3. Ambil Admin Store ID
    const { data: spResult } = await supabase.from('seller_profiles').select('id').eq('user_id', user.id)
    const sp = Array.isArray(spResult) ? spResult[0] : null
    if (!sp) return NextResponse.json({ status: false, message: 'Admin seller profile not found' }, { status: 400 })

    const { data: storeResult } = await supabase.from('stores').select('id').eq('seller_id', sp.id)
    const store = Array.isArray(storeResult) ? storeResult[0] : null
    if (!store) return NextResponse.json({ status: false, message: 'Admin store not found' }, { status: 400 })
    const storeId = store.id

    // 4. Ambil Category ID
    const categoryName = type === 'game' ? 'Top Up Game' : 'Voucher Digital'
    const { data: catResult } = await supabase.from('categories').select('id').eq('name', categoryName)
    let categoryId = Array.isArray(catResult) ? catResult[0]?.id : null

    // Create category if it doesn't exist
    if (!categoryId) {
      const { data: newCat } = await supabase.from('categories').insert({ name: categoryName, slug: categoryName.toLowerCase().replace(/ /g, '-') }).select('id')
      categoryId = Array.isArray(newCat) ? newCat[0]?.id : null
    }

    // 5. Fetch Services dari VIP Reseller
    let vipData;
    if (type === 'prepaid') {
      vipData = await vipReseller.getPrepaidServices()
    } else {
      vipData = await vipReseller.getGameFeatureServices()
    }

    if (!vipData || !vipData.result || !vipData.data) {
      return NextResponse.json({ status: false, message: 'Gagal mengambil data dari VIP Reseller' }, { status: 500 })
    }

    const services = vipData.data
    let inserted = 0
    let updated = 0

    // 6. Masukkan ke tabel products
    // Kita lakukan looping (bisa batch jika database mendukung, tapi Supabase upsert per row lebih aman untuk MVP)
    for (const srv of services) {
      // srv format: { code: 'ML-14', name: '14 Diamonds', price: 3000, status: 'available', brand: 'Mobile Legends' }
      if (srv.status !== 'available') continue

      const basePrice = Number(srv.price)
      const sellPrice = basePrice + (basePrice * (markupPercentage / 100))
      
      const productName = `${srv.brand} - ${srv.name}`
      // Kita simpan VIP code ke slug agar webhook tahu ini produk VIP
      const slug = srv.code 

      // Cek apakah produk ini sudah ada (berdasarkan slug dan store_id)
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', slug)
        .eq('store_id', storeId)
      
      const existing = Array.isArray(existingProduct) ? existingProduct[0] : null

      if (existing) {
        // Update harga jika sudah ada
        await supabase.from('products').update({
          price: sellPrice,
          name: productName,
          description: `Top Up otomatis ${productName} via VIP Reseller. Proses cepat dan aman.`
        }).eq('id', existing.id)
        updated++
      } else {
        // Insert baru
        await supabase.from('products').insert({
          store_id: storeId,
          category_id: categoryId,
          name: productName,
          slug: slug,
          description: `Top Up otomatis ${productName} via VIP Reseller. Proses cepat dan aman.`,
          price: sellPrice,
          stock_qty: 9999, // Unlimited digital
          fulfillment_type: 'Akun Digital' // Set agar order items mencatat custom_fields
        })
        inserted++
      }
    }

    return NextResponse.json({ 
      status: true, 
      message: `Sync Berhasil. Inserted: ${inserted}, Updated: ${updated}`,
      total: inserted + updated
    })

  } catch (error: any) {
    console.error('Error syncing VIP services:', error)
    return NextResponse.json({ status: false, message: error.message }, { status: 500 })
  }
}
