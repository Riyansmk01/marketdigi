'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { Popup } from '@/components/ui/Popup'
import { Product } from '@/types'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        // Fetch published products and join stores table for seller details
        const { data, error } = await supabase.from('products').select('*, stores(name, slug)').eq('is_published', true)
        if (data) {
          // Fetch active reviews to calculate rating details dynamically
          const { data: reviewsData } = await supabase
            .from('product_reviews')
            .select('product_id, rating')
            .eq('is_flagged', false)

          const reviewsMap: Record<string, { sum: number; count: number }> = {}
          if (reviewsData) {
            reviewsData.forEach((r: any) => {
              if (!reviewsMap[r.product_id]) {
                reviewsMap[r.product_id] = { sum: 0, count: 0 }
              }
              reviewsMap[r.product_id].sum += r.rating
              reviewsMap[r.product_id].count += 1
            })
          }

          const mapped = data.map((p: any) => {
            const stats = reviewsMap[p.id] || { sum: 0, count: 0 }
            return {
              ...p,
              // Normalize: DB uses 'name', mock uses 'title'
              title: p.name || p.title || 'Produk Digital',
              price: Number(p.price || 0),
              displayPrice: `Rp ${Number(p.price || 0).toLocaleString('id-ID')}`,
              ratingAvg: stats.count > 0 ? stats.sum / stats.count : 0,
              reviewCount: stats.count,
              seller: {
                name: p.stores?.name || 'Toko',
                slug: p.stores?.slug || ''
              }
            }
          })
          setProducts(mapped)
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <div>
      <Popup />

      {/* Categories */}
      <section className="section container" style={{ paddingTop: '2rem' }}>
        <div className="section-header">
          <h2 className="section-title">Kategori Populer</h2>
        </div>
        <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
          {[
            { name: 'Akun Streaming', type: 'video', src: '/streamshop.mp4' },
            { name: 'Software & OS', type: 'video', src: '/SOAS.mp4' },
            { name: 'Top Up Game', type: 'video', src: '/topupgame.mp4' },
            { name: 'Voucher Digital', type: 'video', src: '/voucher.mp4' },
            { name: 'Jasa Freelance', type: 'video', src: '/jasa.mp4' },
            { name: 'Template Desain', type: 'image', src: '/template-desain.png' },
            { name: 'Layanan AI', type: 'image', src: '/layanan-ai.png' },
            { name: 'Web & Hosting', type: 'image', src: '/web-hosting.png' }
          ].map((cat, i) => (
            <Link href={`/products?category=${cat.name}`} key={i} className="glass-panel card-3d" style={{ padding: '2rem', textAlign: 'center', fontWeight: '600', display: 'block', background: (cat.type === 'video' || cat.type === 'image') ? '#ffffff' : 'var(--bg-secondary)' }}>
              {cat.type === 'video' && (
                <div style={{ height: '80px', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <video src={cat.src} autoPlay loop muted playsInline style={{ height: '150%', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'contrast(1.1)' }} />
                </div>
              )}
              {cat.type === 'image' && (
                <div style={{ height: '80px', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={cat.src} alt={cat.name} style={{ height: '150%', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'contrast(1.1)' }} />
                </div>
              )}
              {cat.type === 'text' && (
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent-color)', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{cat.src}</div>
              )}
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Strip */}
      <div className="trust-strip" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.5rem' }}>🛡️</span> <div><strong>Aman</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Transaksi aman & terlindungi</span></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.5rem' }}>✅</span> <div><strong>Terpercaya</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Penjual & produk terverifikasi</span></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.5rem' }}>🚀</span> <div><strong>Cepat</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Proses instan & efisien</span></div></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ fontSize: '1.5rem' }}>🛍️</span> <div><strong>Banyak Pilihan</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ribuan produk tersedia</span></div></div>
        </div>
      </div>

      {/* Best Sellers */}
      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">Produk Terlaris</h2>
          <Link href="/products?sort=best_seller" style={{ color: 'var(--accent-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Lihat Semua <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
          {loading ? (
            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              Memuat katalog produk terlaris...
            </div>
          ) : products.length === 0 ? (
            <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              Belum ada produk aktif yang terdaftar.
            </div>
          ) : (
            products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}
        </div>
      </section>

      {/* Seller Recruitment Banner */}
      <section className="section container" style={{ padding: '0 0 2rem 0' }}>
        <Link href="/register?role=seller" style={{ display: 'block', maxWidth: '600px', margin: '0 auto', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-3d)', transition: 'transform 0.3s' }} className="seller-banner-link card-3d">
          <img src="/marketdigibanner2.png" alt="Jualan Digital Jadi Lebih Mudah" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </Link>
      </section>

      {/* Footer Banner */}
      <section className="section container" style={{ padding: '0 0 6rem 0' }}>
        <div className="glass-panel" style={{ padding: '4rem 3rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--glass-bg), rgba(99, 102, 241, 0.05))' }}>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Transaksi Aman Terpercaya</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Setiap transaksi dilindungi sistem escrow. Uang diteruskan ke penjual hanya setelah Anda mengonfirmasi pesanan sesuai.</p>
        </div>
      </section>
    </div>
  )
}
