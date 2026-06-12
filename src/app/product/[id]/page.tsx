'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

function getProductTheme(title: string) {
  const lowercaseTitle = title.toLowerCase()
  if (lowercaseTitle.includes('netflix')) {
    return {
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #881337 100%)',
      iconText: 'Netflix'
    }
  }
  if (lowercaseTitle.includes('windows')) {
    return {
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #1e3a8a 100%)',
      iconText: 'Windows'
    }
  }
  if (lowercaseTitle.includes('canva')) {
    return {
      gradient: 'linear-gradient(135deg, #a855f7 0%, #581c87 100%)',
      iconText: 'Canva'
    }
  }
  if (lowercaseTitle.includes('spotify')) {
    return {
      gradient: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
      iconText: 'Spotify'
    }
  }
  return {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #312e81 100%)',
    iconText: 'Digital'
  }
}

function getProductDescription(title: string) {
  const lowercaseTitle = title.toLowerCase()
  if (lowercaseTitle.includes('netflix')) {
    return {
      desc: 'Dapatkan akun Netflix Premium kualitas Ultra HD 4K resmi. Akses penuh ke ribuan film dan serial TV terbaik tanpa batas.',
      bullets: [
        '✅ Kualitas Ultra HD (4K) & HDR terbaik.',
        '✅ Dapat digunakan di Smart TV, HP, Laptop, dan Tablet.',
        '✅ Garansi penuh selama masa aktif berlangganan.',
        '✅ Akun legal dan aman tanpa khawatir on hold.',
        '📩 Kredensial akun dikirimkan via chat/email setelah transaksi.'
      ]
    }
  }
  if (lowercaseTitle.includes('windows')) {
    return {
      desc: 'Lisensi original Windows 11 Professional Retail. Aktivasi bersifat permanen dan terhubung dengan akun Microsoft Anda. Bukan lisensi volume atau crack, ini 100% legal dan bergaransi uang kembali jika gagal aktivasi.',
      bullets: [
        '✅ Lisensi mengikat pada hardware (Motherboard) / Akun Microsoft.',
        '✅ Dapat digunakan untuk instal ulang di PC yang sama tanpa beli lagi.',
        '✅ Bebas update keamanan rutin dari server Microsoft.',
        '✅ Mendukung semua bahasa & region global.',
        '📩 Hanya mengirimkan Product Key via email/chat (tanpa fisik CD).'
      ]
    }
  }
  if (lowercaseTitle.includes('canva')) {
    return {
      desc: 'Akses Canva Pro Premium penuh selama periode berlangganan. Desain ribuan template gratis, hapus background dalam satu klik, dan nikmati fitur premium tak terbatas.',
      bullets: [
        '✅ Akses penuh ke jutaan elemen grafis dan foto premium.',
        '✅ Fitur Magic Resize dan Brand Kit lengkap.',
        '✅ Unduh dengan background transparan & kualitas super HD.',
        '✅ Undang ke tim resmi atau akun privat.',
        '📩 Undangan akses dikirim via email/link setelah checkout.'
      ]
    }
  }
  if (lowercaseTitle.includes('spotify')) {
    return {
      desc: 'Nikmati Spotify Premium Family resmi. Dengerin musik bebas iklan dengan kualitas audio ultra tinggi dan download lagu untuk didengarkan offline.',
      bullets: [
        '✅ Bebas iklan pengganggu & skip lagu tak terbatas.',
        '✅ Kualitas audio 320kbps (sangat jernih).',
        '✅ Download offline langsung di aplikasi resmi.',
        '✅ Gabung grup family premium aman dan legal.',
        '📩 Undangan link premium dikirim otomatis via chat.'
      ]
    }
  }
  return {
    desc: 'Layanan produk digital premium legal dan aman. Diproses cepat dengan instruksi lengkap untuk aktivasi langsung.',
    bullets: [
      '✅ 100% Original & Legal bergaransi.',
      '✅ Pengiriman instan / super cepat.',
      '✅ Layanan dukungan bantuan pelanggan 24/7.',
      '✅ Aman dari suspend atau blokir.'
    ]
  }
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const [selectedVariant, setSelectedVariant] = useState('')
  
  // Reviews & Verification States
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc')
  const [reviews, setReviews] = useState<any[]>([])
  const [hasPurchased, setHasPurchased] = useState(false)
  const [userRole, setUserRole] = useState('buyer')
  const [sellerStats, setSellerStats] = useState({ ratingAvg: 5.0, reviewCount: 0 })
  const [isProcessingBuy, setIsProcessingBuy] = useState(false)

  // Review Form States
  const [ratingVal, setRatingVal] = useState(5)
  const [commentText, setCommentText] = useState('')
  const [mediaFile, setMediaFile] = useState<any>(null)
  const [mediaBase64, setMediaBase64] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  async function loadProductAndReviews() {
    try {
      const { data: productResult, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
      const data = Array.isArray(productResult) ? productResult[0] : null
      if (data) {
        setProduct(data)
        // Use product.name (DB field) with fallback to title for mock data
        const productName = data.name || data.title || ''
        setSelectedVariant(productName.toLowerCase().includes('windows') ? 'Pro' : 'Standard')
        
        // Fetch seller details (tier/stats)
        if (data.store_id) {
          const { data: storeProducts } = await supabase
            .from('products')
            .select('id')
            .eq('store_id', data.store_id)

          if (storeProducts && storeProducts.length > 0) {
            const prodIds = storeProducts.map((p: any) => p.id)
            const { data: sellerReviews } = await supabase
              .from('product_reviews')
              .select('rating')
              .in('product_id', prodIds)
              .eq('is_flagged', false)

            if (sellerReviews && sellerReviews.length > 0) {
              const avgRating = sellerReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / sellerReviews.length
              setSellerStats({
                ratingAvg: Number(avgRating.toFixed(1)),
                reviewCount: sellerReviews.length
              })
            } else {
              setSellerStats({
                ratingAvg: 5.0,
                reviewCount: 0
              })
            }
          }
        }
      }

      // Fetch reviews from database
      const { data: reviewsData } = await supabase
        .from('product_reviews')
        .select('*, users(email)')
        .eq('product_id', id)

      if (reviewsData) {
        setReviews(reviewsData)
      }

      // Check purchase and role
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: usersResult } = await supabase.from('users').select('role').eq('id', user.id)
        const dbUser = Array.isArray(usersResult) ? usersResult[0] : null
        if (dbUser) {
          setUserRole(dbUser.role)
        }

        // Check if there is a successful order with this product
        const { data: userOrders } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('buyer_id', user.id)
          .eq('status', 'Berhasil')

        if (userOrders) {
          const bought = userOrders.some((order: any) =>
            order.order_items?.some((item: any) => item.product_id === id)
          )
          setHasPurchased(bought)
        }
      }
    } catch (err) {
      console.error('Failed to load product details and reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProductAndReviews()
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMediaFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReview(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Anda harus login terlebih dahulu!')
        return
      }

      const { data: reviewResult, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: id,
          user_id: user.id,
          rating: ratingVal,
          comment: commentText,
          media_url: mediaBase64 || null,
          is_flagged: false
        })
        .select('*, users(email)')

      if (error) throw error

      setCommentText('')
      setMediaBase64('')
      setMediaFile(null)
      toast.success('🎉 Terima kasih! Ulasan Anda berhasil ditambahkan.')
      loadProductAndReviews()
    } catch (err: any) {
      toast.error('Gagal mengirim ulasan: ' + err.message)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleTakedownReview = async (reviewId: string) => {
    if (!confirm('Apakah Anda yakin ingin men-takedown ulasan/media ini?')) return
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update({ is_flagged: true })
        .eq('id', reviewId)

      if (error) throw error

      toast.success('Konten berhasil ditakedown.')
      loadProductAndReviews()
    } catch (err: any) {
      toast.error('Gagal men-takedown ulasan: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Memuat detail produk...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Produk Tidak Ditemukan</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Maaf, produk dengan ID "{id}" tidak ditemukan atau telah dihapus.</p>
        <Link href="/" className="btn btn-primary">Kembali ke Beranda</Link>
      </div>
    )
  }

  const theme = getProductTheme(product.name || product.title || '')
  const info = getProductDescription(product.name || product.title || '')

  const productNameDisplay = product.name || product.title || 'Produk Digital'
  const isWindows = productNameDisplay.toLowerCase().includes('windows')
  const productPrice = isWindows && selectedVariant === 'Home' ? product.price - 30000 : Number(product.price || 0)
  const totalPrice = productPrice * qty

  const handleBuyNow = async () => {
    setIsProcessingBuy(true)
    try {
      const items = [{
        id: product.id,
        title: productNameDisplay + (selectedVariant ? ` (${selectedVariant})` : ''),
        price: productPrice,
        qty: qty,
        variant: selectedVariant,
        note: note,
        icon: theme.iconText === 'Windows' ? '💻' : theme.iconText === 'Netflix' ? '📺' : theme.iconText === 'Spotify' ? '🎵' : theme.iconText === 'Canva' ? '🎨' : '📦'
      }]

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items,
          subtotal: totalPrice,
          serviceFee: 2500,
          total: totalPrice + 2500,
          paymentMethod: 'QRIS'
        })
      })

      const result = await response.json()
      
      if (!response.ok || !result.status) {
        if (response.status === 401) {
          toast.error('Silakan login terlebih dahulu untuk checkout.')
          router.push('/login')
        } else {
          toast.error(result.message || 'Gagal membuat pesanan')
        }
        setIsProcessingBuy(false)
        return
      }

      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const newOrder = result.data
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]))
      
      router.push(`/checkout/${newOrder.id}`)
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat memproses pesanan')
      setIsProcessingBuy(false)
    }
  }

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const cartItem = {
      id: 'p_cart_' + product.id + '_' + selectedVariant,
      productId: product.id,
      title: productNameDisplay + (selectedVariant ? ` (${selectedVariant})` : ''),
      price: productPrice,
      qty: qty,
      variant: selectedVariant,
      note: note,
      customFields: {},
      icon: theme.iconText === 'Windows' ? '💻' : theme.iconText === 'Netflix' ? '📺' : theme.iconText === 'Spotify' ? '🎵' : theme.iconText === 'Canva' ? '🎨' : '📦'
    }

    const existingIndex = existingCart.findIndex((item: any) => item.productId === cartItem.productId && item.variant === cartItem.variant)
    if (existingIndex > -1) {
      existingCart[existingIndex].qty += qty
    } else {
      existingCart.push(cartItem)
    }
    localStorage.setItem('cart', JSON.stringify(existingCart))

    toast.success(`🎉 ${productNameDisplay} (${qty}x) berhasil ditambahkan ke keranjang belanja!`, {
      action: {
        label: 'Lihat Keranjang',
        onClick: () => router.push('/cart')
      }
    })
  }

  const handleAddToWishlist = () => {
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    const wishItem = {
      id: 'p_wish_' + product.id,
      title: productNameDisplay,
      price: product.price,
      displayPrice: product.displayPrice || `Rp ${Number(product.price).toLocaleString('id-ID')}`,
      badge: product.badge || 'Ready',
      fulfillmentType: product.fulfillmentType || product.fulfillment_type,
      slug: product.slug,
      icon: theme.iconText === 'Windows' ? '💻' : theme.iconText === 'Netflix' ? '📺' : theme.iconText === 'Spotify' ? '🎵' : theme.iconText === 'Canva' ? '🎨' : '📦'
    }
    
    if (!existingWishlist.some((item: any) => item.title === wishItem.title)) {
      localStorage.setItem('wishlist', JSON.stringify([wishItem, ...existingWishlist]))
    }
    toast.success(`❤️ ${productNameDisplay} ditambahkan ke Wishlist Anda!`)
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ padding: '0 0 1.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <Link href="/" style={{ textDecoration: 'underline' }}>Beranda</Link> / <Link href="/products" style={{ textDecoration: 'underline' }}>Kategori</Link> / <strong>Detail Produk</strong>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
        {/* Kolom Kiri: Gambar & Info */}
        <div className="w-full lg:w-[65%]">
          <div className="product-gallery glass-panel card-3d" style={{ padding: '4rem', textAlign: 'center', background: theme.gradient, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', borderRadius: 'var(--radius-xl)' }}>
            <span style={{ fontSize: '5rem', color: 'white', fontWeight: 900, textShadow: '0 4px 12px rgba(0,0,0,0.3)', letterSpacing: '1px' }}>
              {theme.iconText}
            </span>
          </div>
          
          <div className="product-info" style={{ marginTop: '3rem' }}>
            {/* Tabs */}
            <div style={{ borderBottom: '2px solid var(--glass-border)', display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              <div 
                onClick={() => setActiveTab('desc')}
                style={{ padding: '1rem 0', borderBottom: activeTab === 'desc' ? '3px solid var(--accent-color)' : 'none', fontWeight: '800', color: activeTab === 'desc' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Deskripsi
              </div>
              <div 
                onClick={() => setActiveTab('reviews')}
                style={{ padding: '1rem 0', borderBottom: activeTab === 'reviews' ? '3px solid var(--accent-color)' : 'none', fontWeight: '800', color: activeTab === 'reviews' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer' }}
              >
                Ulasan ({reviews.length})
              </div>
            </div>
            
            {activeTab === 'desc' && (
              <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                <p style={{ marginBottom: '1rem' }}>{info.desc}</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none' }}>
                  {info.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Form Tulis Ulasan (Hanya jika hasPurchased true) */}
                {hasPurchased && (
                  <form onSubmit={handleSubmitReview} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ fontWeight: '800', marginBottom: '1rem' }}>✍️ Berikan Ulasan Anda</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', marginBottom: '1rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star} 
                          onClick={() => setRatingVal(star)}
                          style={{ cursor: 'pointer', color: star <= ratingVal ? '#f59e0b' : 'var(--text-secondary)' }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Bagikan pengalaman belanja Anda di sini..." 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none', marginBottom: '1rem', resize: 'none' }}
                      required
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Lampirkan Foto/Video (Maks 5MB)</label>
                        <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ fontSize: '0.85rem' }} />
                      </div>
                      <Button type="submit" variant="primary" disabled={isSubmittingReview} className="btn-3d">
                        {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Daftar Ulasan */}
                {reviews.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Belum ada ulasan untuk produk ini.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {reviews.map(rev => (
                      <div key={rev.id} style={{ padding: '1.25rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <strong style={{ fontSize: '0.95rem' }}>{rev.users?.email ? rev.users.email.replace(/(.{3})(.*)(@.*)/, '$1***$3') : 'Pembeli'}</strong>
                            <div style={{ color: '#f59e0b', fontSize: '0.9rem', marginTop: '0.1rem' }}>
                              {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {new Date(rev.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        
                        <div style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                          {rev.is_flagged ? (
                            <span style={{ color: 'var(--danger)', fontStyle: 'italic', fontWeight: 600 }}>
                              ⚠️ [Konten ini diturunkan oleh Admin karena melanggar Ketentuan Layanan]
                            </span>
                          ) : (
                            <>
                              <p>{rev.comment}</p>
                              {rev.media_url && (
                                <div style={{ marginTop: '0.75rem' }}>
                                  {rev.media_url.startsWith('data:video') ? (
                                    <video src={rev.media_url} controls style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '4px' }} />
                                  ) : (
                                    <img src={rev.media_url} alt="Review attachment" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '4px', objectFit: 'cover' }} />
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Admin/Seller Takedown Button */}
                        {(userRole === 'admin' || userRole === 'seller') && !rev.is_flagged && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button 
                              onClick={() => handleTakedownReview(rev.id)} 
                              style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                              🗑️ Takedown Konten
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Kolom Kanan: Checkout Box */}
        <div className="w-full lg:w-[35%]" style={{ position: 'sticky', top: '100px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <Badge variant="success" className="card-3d" style={{ marginBottom: '1rem' }}>
              {product.stock_qty !== undefined ? (product.stock_qty > 0 ? 'Stok Tersedia' : 'Stok Habis') : 'Stok Tersedia'}
            </Badge>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2 }}>{productNameDisplay}</h1>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-color)', margin: '1rem 0', textShadow: '0 2px 4px rgba(99, 102, 241, 0.3)' }}>
              Rp {productPrice.toLocaleString('id-ID')}
            </div>
            
            <div className="seller-info glass-panel card-3d" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1rem', marginTop: '1.5rem', background: 'var(--bg-secondary)' }}>
              <div className="avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #818cf8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 6px rgba(0,0,0,0.1)' }}>
                {(product.seller?.name || 'ST').substring(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{product.seller?.name || 'SoftTech Official'} <span style={{ fontSize: '0.9rem' }}>✔️</span></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>⭐ {sellerStats.ratingAvg > 0 ? sellerStats.ratingAvg : '0.0'} ({sellerStats.reviewCount} Ulasan) • Aktif Baru Saja</div>
              </div>
              <Button onClick={() => router.push(`/pesan?toko=${encodeURIComponent(product.seller?.name || 'SoftTech')}`)} variant="secondary" size="sm" className="btn-3d">Chat</Button>
            </div>
          </div>

          <div className="glass-panel checkout-box card-3d" style={{ padding: '2rem', background: 'var(--bg-primary)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>Atur Pesanan</h3>
            
            {/* Conditional Variants */}
            <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: '700' }}>Pilih Varian</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              {isWindows ? (
                <>
                  <Button 
                    onClick={() => setSelectedVariant('Pro')}
                    variant={selectedVariant === 'Pro' ? 'primary' : 'secondary'} 
                    style={{ flex: 1 }}
                  >
                    Pro Edition
                  </Button>
                  <Button 
                    onClick={() => setSelectedVariant('Home')}
                    variant={selectedVariant === 'Home' ? 'primary' : 'secondary'} 
                    style={{ flex: 1 }}
                  >
                    Home Edition
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setSelectedVariant('Standard')}
                    variant={selectedVariant === 'Standard' ? 'primary' : 'secondary'} 
                    style={{ flex: 1 }}
                  >
                    Aktivasi Instan
                  </Button>
                  <Button 
                    onClick={() => setSelectedVariant('Premium')}
                    variant={selectedVariant === 'Premium' ? 'primary' : 'secondary'} 
                    style={{ flex: 1 }}
                  >
                    Garansi Penuh
                  </Button>
                </>
              )}
            </div>
            
            <label style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: '700' }}>Kuantitas</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div className="qty-selector glass-panel" style={{ display: 'flex', padding: '0.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', boxShadow: 'var(--shadow-inset)' }}>
                <button onClick={() => setQty(prev => Math.max(1, prev - 1))} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer' }}>-</button>
                <span style={{ width: '50px', textAlign: 'center', alignSelf: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{qty}</span>
                <button onClick={() => setQty(prev => prev + 1)} className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', background: 'transparent', cursor: 'pointer' }}>+</button>
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Sisa stok: {product.stock_qty !== undefined ? product.stock_qty : '99+'}
              </span>
            </div>
            
            <Input 
              label="Catatan untuk penjual (Opsional)" 
              placeholder="Misal: Tolong kirim ke email saya..." 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ marginBottom: '2rem' }} 
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderTop: '2px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Harga</span>
              <span style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button onClick={handleBuyNow} disabled={isProcessingBuy} variant="primary" size="lg" style={{ flex: 1, padding: '1.25rem', fontSize: '1.1rem' }} className="btn-3d">
                {isProcessingBuy ? 'Memproses...' : '💳 Beli Sekarang'}
              </Button>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={handleAddToCart} variant="secondary" style={{ flex: 1 }}>+ Keranjang</Button>
                <Button onClick={handleAddToWishlist} variant="secondary" style={{ padding: '1rem' }}>❤️</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
