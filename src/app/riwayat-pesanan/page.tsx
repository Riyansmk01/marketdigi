'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

interface OrderItem {
  id: string
  title: string
  price: number
  qty: number
  variant: string
  note: string
  customFields?: { [key: string]: string }
  icon: string
}

interface Order {
  id: string
  invoiceNo: string
  items: OrderItem[]
  subtotal: number
  serviceFee: number
  total: number
  paymentMethod: string
  status: string // 'Proses' | 'Berhasil' | 'Tidak Berhasil' | 'Garansi Aktif' | 'Dikomplain'
  createdAt: string
}

function OrderHistoryForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [successToast, setSuccessToast] = useState(false)

  // Seed sample orders if empty
  useEffect(() => {
    const localData = localStorage.getItem('orders')
    if (localData) {
      setOrders(JSON.parse(localData))
    } else {
      setOrders([])
    }

    if (searchParams.get('success') === 'true') {
      setSuccessToast(true)
      setTimeout(() => setSuccessToast(false), 5000)
    }
  }, [searchParams])

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: newStatus }
      }
      return ord
    })
    setOrders(updated)
    localStorage.setItem('orders', JSON.stringify(updated))
  }

  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null)

  const handleCompleteOrder = async (order: Order) => {
    setCompletingOrderId(order.id)
    try {
      // Check payment status from server before allowing completion
      const res = await fetch(`/api/payment/status?order_id=${order.invoiceNo}`)
      const data = await res.json()

      const isPaid =
        data?.status === true &&
        (data?.data?.status === 'PAID' || data?.data?.status === 'SUCCESS')

      if (!isPaid) {
        toast.error('❌ Pembayaran belum terkonfirmasi. Harap selesaikan pembayaran QRIS terlebih dahulu.')
        return
      }

      // Payment confirmed — mark order as Berhasil
      handleStatusChange(order.id, 'Berhasil')
      toast.success('✅ Transaksi berhasil diselesaikan!')
    } catch (err) {
      toast.error('Gagal memverifikasi status pembayaran. Coba lagi.')
    } finally {
      setCompletingOrderId(null)
    }
  }

  const openReviewModal = (item: OrderItem) => {
    setSelectedOrderItem(item)
    setReviewComment('')
    setReviewRating(5)
    setShowReviewModal(true)
  }

  const [submittingReview, setSubmittingReview] = useState(false)

  const submitReview = async () => {
    if (!selectedOrderItem) return
    setSubmittingReview(true)
    
    try {
      // Save review to localStorage for local display
      const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]')
      const newReview = {
        id: 'rev_' + Math.random().toString(36).substr(2, 9),
        itemTitle: selectedOrderItem.title,
        variant: selectedOrderItem.variant,
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('reviews', JSON.stringify([newReview, ...existingReviews]))

      // Also save to Supabase so it shows on product pages
      const { data: { user } } = await supabase.auth.getUser()
      if (user && selectedOrderItem.id) {
        const { error: reviewErr } = await supabase
          .from('product_reviews')
          .insert({
            product_id: selectedOrderItem.id,
            user_id: user.id,
            rating: reviewRating,
            comment: reviewComment,
            is_flagged: false,
          })
        if (reviewErr) {
          console.warn('[submitReview] Supabase insert warning (non-fatal):', reviewErr.message)
        } else {
          console.log('[submitReview] Review saved to Supabase for product:', selectedOrderItem.id)
        }
      }

      setShowReviewModal(false)
      toast.success('✅ Ulasan Anda berhasil dikirim dan akan muncul di halaman produk!')
    } catch (err) {
      console.error('[submitReview] Error:', err)
      toast.error('Gagal mengirim ulasan. Coba lagi.')
    } finally {
      setSubmittingReview(false)
    }
  }

  const filters = ['Semua', 'Proses', 'Berhasil', 'Tidak Berhasil', 'Garansi Aktif', 'Dikomplain']

  const filteredOrders = orders.filter(ord => {
    if (activeFilter === 'Semua') return true
    return ord.status.toLowerCase() === activeFilter.toLowerCase()
  })

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      {successToast && (
        <div className="glass-panel" style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--success)', color: 'white', padding: '1rem 2rem', zIndex: 100, borderRadius: 'var(--radius-md)', fontWeight: 'bold', boxShadow: 'var(--shadow-lg)' }}>
          🎉 Pembayaran Berhasil! Pesanan sedang diproses instan.
        </div>
      )}

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Riwayat Pesanan</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Pantau status pengiriman instan dan kelola lisensi digital Anda.</p>
      </div>

      {/* Filter Tabs - scrollable on mobile */}
      <div className="overflow-x-auto pb-2" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'nowrap', paddingBottom: '0.75rem', minWidth: 'max-content' }}>
          {filters.map(filt => (
            <button
              key={filt}
              onClick={() => setActiveFilter(filt)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: activeFilter === filt ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
                background: activeFilter === filt ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: activeFilter === filt ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
            >
              {filt}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="glass-panel card-3d" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📦</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Tidak Ada Pesanan</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Tidak ditemukan pesanan dengan status "{activeFilter}".</p>
          <Link href="/">
            <Button variant="primary" size="lg">Jelajahi Produk</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {filteredOrders.map(order => (
            <div key={order.id} className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
              {/* Header Pesanan */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No. Invoice</span>
                    <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{order.invoiceNo}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tanggal Transaksi</span>
                    <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Metode Bayar</span>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--accent-color)' }}>{order.paymentMethod}</div>
                  </div>
                </div>

                <div>
                  <span style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    background: order.status === 'Berhasil' ? 'rgba(16, 185, 129, 0.15)' :
                                order.status === 'Proses' ? 'rgba(245, 158, 11, 0.15)' :
                                order.status === 'Garansi Aktif' ? 'rgba(99, 102, 241, 0.15)' :
                                order.status === 'Dikomplain' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    color: order.status === 'Berhasil' ? 'var(--success)' :
                           order.status === 'Proses' ? 'var(--warning)' :
                           order.status === 'Garansi Aktif' ? 'var(--accent-color)' :
                           order.status === 'Dikomplain' ? 'var(--danger)' : 'var(--text-secondary)',
                    border: '1px solid'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Detail Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '2.5rem', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>{item.title}</h4>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.1rem' }}>
                        Varian: <strong>{item.variant}</strong> • Jumlah: <strong>{item.qty} pcs</strong>
                      </div>
                      
                      {/* Simulated Fulfillment Content (if order is Berhasil/Garansi) */}
                      {(order.status === 'Berhasil' || order.status === 'Garansi Aktif') && (
                        <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'var(--bg-primary)', borderLeft: '3px solid var(--success)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--success)', fontWeight: 'bold' }}>🔑 Informasi Lisensi / Pengiriman Instan:</span>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', marginTop: '0.25rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                            {item.title.includes('Windows') ? 'KEY-W11P-XXXXX-YYYYY-ZZZZZ-AAAAA' : 'EMAIL: marketdigi_customer@email.com \nPASS: MD_Secure_2026 \nPROFILE: Slot ' + (item.customFields?.profile || '1')}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Rp {(item.price * item.qty).toLocaleString('id-ID')}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rp {item.price.toLocaleString('id-ID')} / pcs</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ fontWeight: '800', fontSize: '1.15rem' }}>
                  Total Pembayaran: <span style={{ color: 'var(--accent-color)', fontSize: '1.3rem' }}>Rp {order.total.toLocaleString('id-ID')}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Button onClick={() => router.push('/pesan?toko=DigiStore')} variant="secondary" size="sm" className="btn-3d">Hubungi Penjual</Button>
                  
                  {order.status === 'Proses' && (
                    <Button
                      onClick={() => handleCompleteOrder(order)}
                      variant="primary"
                      size="sm"
                      className="btn-3d"
                      disabled={completingOrderId === order.id}
                    >
                      {completingOrderId === order.id ? '⏳ Memverifikasi...' : 'Selesaikan Transaksi'}
                    </Button>
                  )}

                  {order.status === 'Berhasil' && (
                    <>
                      <Button onClick={() => handleStatusChange(order.id, 'Garansi Aktif')} variant="secondary" size="sm">Aktifkan Garansi</Button>
                      <Button onClick={() => openReviewModal(order.items[0])} variant="primary" size="sm" className="btn-3d">Beri Ulasan</Button>
                    </>
                  )}

                  {order.status === 'Garansi Aktif' && (
                    <>
                      <Button onClick={() => handleStatusChange(order.id, 'Dikomplain')} variant="secondary" size="sm" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Ajukan Komplain</Button>
                      <Button onClick={() => openReviewModal(order.items[0])} variant="primary" size="sm" className="btn-3d">Beri Ulasan</Button>
                    </>
                  )}

                  {order.status === 'Dikomplain' && (
                    <Button onClick={() => router.push('/contact?invoice=' + order.invoiceNo)} variant="primary" size="sm" style={{ background: 'var(--danger)' }}>Hubungi Mediasi</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedOrderItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '500px', background: 'var(--bg-secondary)', maxWidth: '90%' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Tulis Ulasan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Berikan penilaian Anda untuk: <strong>{selectedOrderItem.title}</strong></p>
            
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Peringkat Bintang</label>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', fontSize: '2rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    onClick={() => setReviewRating(star)}
                    style={{ cursor: 'pointer', color: star <= reviewRating ? '#f59e0b' : 'var(--text-secondary)' }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Komentar</label>
              <textarea 
                rows={4} 
                className="input-field" 
                placeholder="Tulis kepuasan Anda tentang produk ini..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowReviewModal(false)} variant="secondary" disabled={submittingReview}>Batal</Button>
              <Button onClick={submitReview} variant="primary" className="btn-3d" disabled={submittingReview}>
                {submittingReview ? '⏳ Mengirim...' : 'Kirim Ulasan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.5rem' }}>Memuat Halaman...</div>}>
      <OrderHistoryForm />
    </Suspense>
  )
}
