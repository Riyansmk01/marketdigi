'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

interface ProductListing {
  id: string
  name: string
  price: number
  stock: number
  sales: number
  status: 'Aktif' | 'Nonaktif'
}

interface IncomingOrder {
  id: string
  buyer: string
  product: string
  price: number
  qty: number
  status: 'Menunggu Pengiriman' | 'Terkirim'
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const [storeName, setStoreName] = useState('My Digital Store')
  const [storeSlug, setStoreSlug] = useState('mydigital')
  
  // Dashboard stats
  const [revenue, setRevenue] = useState(0)
  const [totalSales, setTotalSales] = useState(0)
  const [rating, setRating] = useState(5.0)
  const [reviewCount, setReviewCount] = useState(0)
  const [tier, setTier] = useState(0)
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null) // Track store ID for product insert
  
  // Listings state
  const [listings, setListings] = useState<any[]>([])
  const [loadingListings, setLoadingListings] = useState(true)

  // Incoming orders needing manual action
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>([])

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [newProductPrice, setNewProductPrice] = useState('')
  const [newProductStock, setNewProductStock] = useState('50')
  const [newProductFulfillment, setNewProductFulfillment] = useState('Akun Digital')
  const [newProductCategory, setNewProductCategory] = useState('Akun Streaming')

  async function loadListings(storeId?: string | null) {
    try {
      const sid = storeId || currentStoreId
      if (!sid) {
        setListings([])
        setLoadingListings(false)
        return
      }
      // Only load products belonging to this seller's store
      const { data, error } = await supabase.from('products').select('*').eq('store_id', sid)
      if (data) {
        setListings(data)
      }
    } catch (err) {
      console.error('Failed to load seller listings:', err)
    } finally {
      setLoadingListings(false)
    }
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Fetch user role (no .single() to avoid 406)
        const { data: usersResult } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
        const userData = Array.isArray(usersResult) ? usersResult[0] : null

        if (userData && userData.role === 'buyer') {
          toast.error('Akses ditolak: Anda terdaftar sebagai Pembeli. Beralihlah menjadi Penjual untuk menggunakan Seller Center.')
          router.push('/')
          return
        }

        // Fetch seller details (tier)
        const { data: spResult } = await supabase
          .from('seller_profiles')
          .select('id, tier')
          .eq('user_id', user.id)
        let sellerData = Array.isArray(spResult) ? spResult[0] : null

        if (!sellerData && userData && userData.role === 'seller') {
          // Auto-create missing seller profile
          const randomPhone = '0853' + Math.floor(10000000 + Math.random() * 90000000)
          const { data: newProfileResult } = await supabase.from('seller_profiles').insert({
            user_id: user.id,
            whatsapp_number: randomPhone,
            whatsapp_verified: true,
            tier: 0
          }).select('id, tier')
          sellerData = Array.isArray(newProfileResult) ? newProfileResult[0] : null
        }

        if (sellerData) {
          setTier(sellerData.tier || 0)

            // Fetch store details (no .single() to avoid 406)
            const { data: storeResult } = await supabase
              .from('stores')
              .select('id, name, slug')
              .eq('seller_id', sellerData.id)
            let storeData = Array.isArray(storeResult) ? storeResult[0] : null

            if (!storeData && userData && userData.role === 'seller') {
               // Auto-create missing store
               const emailPrefix = user.email?.split('@')[0] || 'store'
               const storeNameDefault = 'Toko ' + emailPrefix
               const storeSlugDefault = emailPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '') + '-' + Math.floor(100 + Math.random() * 900)
               const { data: newStoreResult } = await supabase.from('stores').insert({
                 seller_id: sellerData.id,
                 name: storeNameDefault,
                 slug: storeSlugDefault
               }).select('id, name, slug')
               storeData = Array.isArray(newStoreResult) ? newStoreResult[0] : null
            }

            if (storeData) {
              setStoreName(storeData.name)
              setStoreSlug(storeData.slug)
              setCurrentStoreId(storeData.id) // Save store ID for product insert
              localStorage.setItem('storeName', storeData.name)
              localStorage.setItem('storeSlug', storeData.slug)
              localStorage.setItem('currentStoreId', storeData.id)
              // Load listings for this store immediately
              loadListings(storeData.id)

              // Query paid orders for this store
              const { data: orders } = await supabase
                .from('orders')
                .select('total')
                .eq('store_id', storeData.id)
                .eq('status', 'Berhasil')

              if (orders) {
                const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0)
                setRevenue(totalRevenue)
                setTotalSales(orders.length)
              }

              // Query store products and calculate reviews average rating & count
              const { data: storeProducts } = await supabase
                .from('products')
                .select('id')
                .eq('store_id', storeData.id)

              if (storeProducts && storeProducts.length > 0) {
                const productIds = storeProducts.map((p: any) => p.id)
                const { data: dbReviews } = await supabase
                  .from('product_reviews')
                  .select('rating')
                  .in('product_id', productIds)

                if (dbReviews && dbReviews.length > 0) {
                  const avgRating = dbReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / dbReviews.length
                  setRating(Number(avgRating.toFixed(1)))
                  setReviewCount(dbReviews.length)
                } else {
                  setRating(5.0)
                  setReviewCount(0)
                }
              } else {
                setRating(5.0)
                setReviewCount(0)
              }

              // Query incoming orders for this store (including status, buyer email and items)
              const { data: dbOrders } = await supabase
                .from('orders')
                .select('id, status, total, buyer_id, users:buyer_id(email), order_items(*, products(*))')
                .eq('store_id', storeData.id)

              if (dbOrders) {
                const mappedOrders: IncomingOrder[] = dbOrders.map((ord: any) => {
                  const firstItem = ord.order_items?.[0]
                  return {
                    id: ord.id,
                    buyer: ord.users?.email || 'pembeli@marketdigi.me',
                    product: firstItem?.products?.name || 'Produk Digital',
                    price: Number(firstItem?.price || ord.total),
                    qty: Number(firstItem?.qty || 1),
                    status: ord.status === 'Proses' ? 'Menunggu Pengiriman' : 'Terkirim'
                  }
                })
                setIncomingOrders(mappedOrders)
              }
            }
          }
      } catch (err) {
        console.error('Error loading dashboard stats:', err)
      }
    }
    async function init() {
      await loadDashboardData()
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  function getCategoryFromFulfillmentOrName(name: string, fulfillment: string) {
    const nameLower = name.toLowerCase()
    if (nameLower.includes('netflix') || nameLower.includes('spotify') || nameLower.includes('youtube') || nameLower.includes('streaming')) {
      return 'Akun Streaming'
    }
    if (nameLower.includes('windows') || nameLower.includes('office') || nameLower.includes('adobe') || nameLower.includes('lisensi')) {
      return 'Software & OS'
    }
    if (nameLower.includes('canva') || nameLower.includes('figma') || nameLower.includes('template')) {
      return 'Template Desain'
    }
    if (nameLower.includes('game') || nameLower.includes('diamond') || nameLower.includes('top up') || nameLower.includes('pubg') || nameLower.includes('mlbb') || nameLower.includes('valorant') || nameLower.includes('gems')) {
      return 'Top Up Game'
    }
    if (nameLower.includes('hosting') || nameLower.includes('vps') || nameLower.includes('domain') || nameLower.includes('cpanel') || nameLower.includes('server')) {
      return 'Web & Hosting'
    }
    if (nameLower.includes('jasa') || nameLower.includes('freelance') || nameLower.includes('design') || nameLower.includes('development')) {
      return 'Jasa Freelance'
    }
    if (fulfillment === 'OTP Service' || nameLower.includes('gpt') || nameLower.includes('ai') || nameLower.includes('openai') || nameLower.includes('midjourney')) {
      return 'Layanan AI'
    }
    return 'Voucher Digital'
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProductName || !newProductPrice) return

    const priceNum = Number(newProductPrice)
    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36)
    const categoryName = newProductCategory || getCategoryFromFulfillmentOrName(newProductName, newProductFulfillment)

    try {
      // 1. Get store_id from state or localStorage
      let storeId = currentStoreId || localStorage.getItem('currentStoreId')
      
      if (!storeId) {
        // Re-fetch store_id from DB
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: spResult } = await supabase.from('seller_profiles').select('id').eq('user_id', user.id)
          let sp = Array.isArray(spResult) ? spResult[0] : null
          
          if (!sp) {
            // Auto-create missing seller profile
            const { data: newProfileResult } = await supabase.from('seller_profiles').insert({
              user_id: user.id,
              whatsapp_number: '0853' + Math.floor(10000000 + Math.random() * 90000000),
              whatsapp_verified: true,
              tier: 0
            }).select('id')
            sp = Array.isArray(newProfileResult) ? newProfileResult[0] : null
          }

          if (sp) {
            const { data: storeResult } = await supabase.from('stores').select('id').eq('seller_id', sp.id)
            let st = Array.isArray(storeResult) ? storeResult[0] : null
            
            if (!st) {
               // Auto-create missing store
               const emailPrefix = user.email?.split('@')[0] || 'store'
               const { data: newStoreResult } = await supabase.from('stores').insert({
                 seller_id: sp.id,
                 name: 'Toko ' + emailPrefix,
                 slug: emailPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '') + '-' + Math.floor(100 + Math.random() * 900)
               }).select('id')
               st = Array.isArray(newStoreResult) ? newStoreResult[0] : null
            }

            if (st) {
              storeId = st.id
              setCurrentStoreId(storeId)
              localStorage.setItem('currentStoreId', storeId as string)
            }
          }
        }
      }

      if (!storeId) {
        toast.error('Toko belum ditemukan. Pastikan Anda sudah mendaftar sebagai seller.')
        return
      }

      // 2. Find or create category_id
      let categoryId: string | null = null
      const { data: catResult } = await supabase.from('categories').select('id').eq('name', categoryName)
      const existingCat = Array.isArray(catResult) ? catResult[0] : null

      if (existingCat) {
        categoryId = existingCat.id
      } else {
        // Create category if not found
        const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const { data: newCatResult } = await supabase.from('categories').insert({ name: categoryName, slug: catSlug }).select('id')
        const newCat = Array.isArray(newCatResult) ? newCatResult[0] : null
        if (newCat) categoryId = newCat.id
      }

      // 3. Build proper DB payload (use correct column names)
      const dbPayload: any = {
        store_id: storeId,
        name: newProductName,                           // DB column: 'name'
        slug: slug,
        description: `Produk digital: ${newProductName}. Proses instan dan aman.`,
        price: priceNum,
        stock_qty: Number(newProductStock) || 50,
        stock_status: 'Ready',
        fulfillment_type: newProductFulfillment,        // DB column: 'fulfillment_type'
        is_published: true
      }
      if (categoryId) dbPayload.category_id = categoryId

      // 4. Insert product
      const { data, error } = await supabase.from('products').insert(dbPayload)
      if (error) {
        toast.error('Gagal menambahkan produk: ' + error.message)
      } else {
        toast.success(`🎉 Produk "${newProductName}" berhasil ditambahkan ke etalase toko Anda!`)
        loadListings(storeId)
      }
    } catch (err: any) {
      console.error(err)
      toast.error('Terjadi kesalahan: ' + (err.message || 'Silakan coba lagi.'))
    }

    setShowAddProductModal(false)
    setNewProductName('')
    setNewProductPrice('')
    setNewProductStock('50')
    setNewProductCategory('Akun Streaming')
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini dari etalase?')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) {
        toast.error('Gagal menghapus produk: ' + error.message)
      } else {
        toast.success('🗑️ Produk berhasil dihapus dari etalase!')
        setListings(prev => prev.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat menghapus produk.')
    }
  }

  const handleFulfillOrder = (orderId: string) => {
    // Change status
    setIncomingOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: 'Terkirim' }
      }
      return ord
    }))
    
    // Add to revenue
    const order = incomingOrders.find(o => o.id === orderId)
    if (order) {
      setRevenue(prev => prev + (order.price * order.qty))
      setTotalSales(prev => prev + order.qty)
    }

    toast.success('🔑 Kode Lisensi berhasil dikirimkan ke email pembeli! Transaksi selesai.')
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-color)', textTransform: 'uppercase' }}>Seller Center Dashboard</span>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.25rem' }}>{storeName}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Domain Toko: <a href={`/store/${storeSlug}`} style={{ color: 'var(--accent-color)', fontWeight: 600 }}>marketdigi.me/store/{storeSlug}</a></p>
        </div>
        
        <Button onClick={() => setShowAddProductModal(true)} variant="primary" className="btn-3d">
          ➕ Tambah Produk Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel card-3d" style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Pendapatan</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--success)', marginTop: '0.5rem' }}>Rp {revenue.toLocaleString('id-ID')}</h3>
        </div>
        
        <div className="glass-panel card-3d" style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Penjualan</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '0.5rem' }}>{totalSales} Unit</h3>
        </div>

        <div className="glass-panel card-3d" style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Rating Toko</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.5rem' }}>
            ⭐ {rating} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({reviewCount} Ulasan)</span>
          </h3>
        </div>

        <div className="glass-panel card-3d" style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Tier Toko</span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: tier > 0 ? 'var(--success)' : 'var(--warning)', marginTop: '0.5rem' }}>
            Level {tier} {tier === 0 ? '(Bronze)' : '(Silver)'}
          </h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'flex-start' }}>
        {/* Left Table: Product Catalog Management */}
        <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Manajemen Etalase Produk</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>Nama Produk</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>Harga</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>Fulfillment</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>Kategori</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loadingListings ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem 0.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Memuat daftar produk etalase...
                    </td>
                  </tr>
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem 0.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Belum ada produk terdaftar di toko Anda.
                    </td>
                  </tr>
                ) : (
                  listings.map(prod => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{prod.title}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>Rp {prod.price.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{prod.fulfillmentType || 'Akun Digital'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{prod.categoryName || 'General'}</td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                        <Button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          variant="secondary" 
                          size="sm" 
                          style={{ padding: '0.4rem 0.8rem', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section: Incoming Orders notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>🔔 Pesanan Masuk (Fulfillment)</h3>
            
            {incomingOrders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>Tidak ada pesanan masuk yang menunggu pengiriman.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {incomingOrders.map(order => (
                  <div key={order.id} style={{ padding: '1.25rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{order.buyer}</h4>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: order.status === 'Terkirim' ? 'var(--success)' : 'var(--warning)'
                        }}>
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Produk: <strong>{order.product}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Jumlah: <strong>{order.qty} pcs</strong> • Total: <strong>Rp {(order.price * order.qty).toLocaleString('id-ID')}</strong>
                      </div>
                    </div>

                    {order.status === 'Menunggu Pengiriman' && (
                      <Button onClick={() => handleFulfillOrder(order.id)} variant="primary" size="sm" className="btn-3d" style={{ width: '100%', fontSize: '0.85rem' }}>
                        🔑 Kirim Kode Lisensi
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '500px', background: 'var(--bg-secondary)', maxWidth: '90%' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Tambah Produk Baru</h3>
            
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input 
                label="Nama Produk Digital" 
                type="text" 
                placeholder="Contoh: Lisensi Office 2021 Original" 
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                required 
              />

              <Input 
                label="Harga Jual (Rp)" 
                type="number" 
                placeholder="Contoh: 120000" 
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                required 
              />

              <Input 
                label="Jumlah Stok" 
                type="number" 
                placeholder="Contoh: 100" 
                value={newProductStock}
                onChange={(e) => setNewProductStock(e.target.value)}
                required 
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kategori Produk</label>
                <select 
                  className="input-field" 
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  <option value="Akun Streaming">Akun Streaming</option>
                  <option value="Software & OS">Software & OS</option>
                  <option value="Template Desain">Template Desain</option>
                  <option value="Top Up Game">Top Up Game</option>
                  <option value="Voucher Digital">Voucher Digital</option>
                  <option value="Jasa Freelance">Jasa Freelance</option>
                  <option value="Layanan AI">Layanan AI</option>
                  <option value="Web & Hosting">Web & Hosting</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tipe Fulfillment</label>
                <select 
                  className="input-field" 
                  value={newProductFulfillment}
                  onChange={(e) => setNewProductFulfillment(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  <option value="Akun Digital">Akun Digital (Serah Kredensial)</option>
                  <option value="Link Akses">Link Akses (Download Lisensi)</option>
                  <option value="OTP Service">OTP Service (Layanan Verifikasi)</option>
                  <option value="Pre-Order">Pre-Order (Proses Manual)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="button" onClick={() => setShowAddProductModal(false)} variant="secondary">Batal</Button>
                <Button type="submit" variant="primary" className="btn-3d">Simpan Produk</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
