'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface Review {
  id: string
  itemTitle: string
  variant: string
  rating: number
  comment: string
  createdAt: string
}

interface Order {
  id: string
  invoiceNo: string
  items: Array<{
    id: string
    title: string
    price: number
    qty: number
    variant: string
    icon: string
  }>
  status: string
}

export default function ReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'my-reviews' | 'pending-reviews'>('my-reviews')

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    // Read submitted reviews
    const localReviews = localStorage.getItem('reviews')
    if (localReviews) {
      setReviews(JSON.parse(localReviews))
    } else {
      setReviews([])
    }

    // Read completed orders that might need review
    const localOrders = localStorage.getItem('orders')
    if (localOrders) {
      const parsedOrders: Order[] = JSON.parse(localOrders)
      // Filter orders that are Berhasil or Garansi Aktif
      const eligible = parsedOrders.filter(o => o.status === 'Berhasil' || o.status === 'Garansi Aktif')
      setPendingOrders(eligible)
    }
  }, [])

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Ulasan Produk</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Berikan feedback ulasan Anda untuk meningkatkan reputasi seller terpercaya.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('my-reviews')}
          style={{
            padding: '1rem 0',
            border: 'none',
            borderBottom: activeTab === 'my-reviews' ? '3px solid var(--accent-color)' : '3px solid transparent',
            background: 'transparent',
            fontWeight: '800',
            color: activeTab === 'my-reviews' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ✍️ Ulasan Saya ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('pending-reviews')}
          style={{
            padding: '1rem 0',
            border: 'none',
            borderBottom: activeTab === 'pending-reviews' ? '3px solid var(--accent-color)' : '3px solid transparent',
            background: 'transparent',
            fontWeight: '800',
            color: activeTab === 'pending-reviews' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ⏳ Menunggu Ulasan ({pendingOrders.length})
        </button>
      </div>

      {activeTab === 'my-reviews' ? (
        reviews.length === 0 ? (
          <div className="glass-panel card-3d" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>💬</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Belum Ada Ulasan</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Semua ulasan produk digital yang Anda kirimkan akan muncul di sini.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.map(rev => (
              <div key={rev.id} className="glass-panel card-3d" style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{rev.itemTitle}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Varian: {rev.variant}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(rev.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>

                {/* Rating stars */}
                <div style={{ display: 'flex', gap: '0.25rem', fontSize: '1.25rem', color: '#f59e0b', marginBottom: '0.75rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                  ))}
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        pendingOrders.length === 0 ? (
          <div className="glass-panel card-3d" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Semua Produk Sudah Diulas</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Tidak ada transaksi sukses yang menunggu ulasan Anda.</p>
            <Link href="/riwayat-pesanan">
              <Button variant="primary">Lihat Transaksi</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pendingOrders.map(order => (
              <div key={order.id} className="glass-panel card-3d" style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>{order.items[0].icon}</span>
                  <div>
                    <h3 style={{ fontWeight: '800', fontSize: '1.1rem' }}>{order.items[0].title}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Varian: {order.items[0].variant}</span>
                  </div>
                </div>
                
                <Link href={`/riwayat-pesanan?id=${order.id}`}>
                  <Button variant="primary" className="btn-3d">Tulis Ulasan</Button>
                </Link>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
