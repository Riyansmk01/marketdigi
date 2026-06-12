'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProductCard } from '@/components/product/ProductCard'
import { Product } from '@/types'
import { supabase } from '@/lib/supabaseClient'

// Extended product interface to support category filtering
interface CategorizedProduct extends Product {
  categoryName: string
}

function ProductsCatalog() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get('category') || ''
  const searchParam = searchParams.get('search') || ''

  const [products, setProducts] = useState<CategorizedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const sortParam = searchParams.get('sort') || ''
  let defaultSort = 'Terpopuler'
  if (sortParam === 'newest' || sortParam === 'Terbaru') defaultSort = 'Terbaru'
  else if (sortParam === 'price_asc' || sortParam === 'Harga Terendah') defaultSort = 'Harga Terendah'
  else if (sortParam === 'price_desc' || sortParam === 'Harga Tertinggi') defaultSort = 'Harga Tertinggi'

  const [sortBy, setSortBy] = useState(defaultSort)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity })

  useEffect(() => {
    const s = searchParams.get('sort')
    if (s) {
      if (s === 'best_seller' || s === 'Terpopuler') setSortBy('Terpopuler')
      else if (s === 'newest' || s === 'Terbaru') setSortBy('Terbaru')
      else if (s === 'price_asc' || s === 'Harga Terendah') setSortBy('Harga Terendah')
      else if (s === 'price_desc' || s === 'Harga Tertinggi') setSortBy('Harga Tertinggi')
    }
  }, [searchParams])

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*')
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

          const mapped = (data as CategorizedProduct[]).map((p: any) => {
            const stats = reviewsMap[p.id] || { sum: 0, count: 0 }
            return {
              ...p,
              ratingAvg: stats.count > 0 ? stats.sum / stats.count : 0,
              reviewCount: stats.count
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

  // List of unique categories for the sidebar
  const categoriesList = ['Akun Streaming', 'Software & OS', 'Template Desain', 'Top Up Game', 'Voucher Digital', 'Jasa Freelance', 'Layanan AI', 'Web & Hosting']

  const handleCategoryClick = (catName: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryParam === catName) {
      params.delete('category')
    } else {
      params.set('category', catName)
    }
    router.push(`/products?${params.toString()}`)
  }

  // Filter products based on active category, search key, and prices
  const filteredProducts = products.filter(p => {
    const categoryMatch = !categoryParam || p.categoryName?.toLowerCase() === categoryParam.toLowerCase()
    const searchMatch = !searchParam || p.title?.toLowerCase().includes(searchParam.toLowerCase())
    const price = p.price || 0
    const minMatch = !priceFilter.min || price >= priceFilter.min
    const maxMatch = !priceFilter.max || price <= priceFilter.max
    return categoryMatch && searchMatch && minMatch && maxMatch
  })

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Harga Terendah') {
      return a.price - b.price
    }
    if (sortBy === 'Harga Tertinggi') {
      return b.price - a.price
    }
    if (sortBy === 'Terbaru') {
      return b.id.localeCompare(a.id)
    }
    // Terpopuler (by reviews count / rating)
    const rA = a.seller?.reviewCount || 0
    const rB = b.seller?.reviewCount || 0
    return rB - rA
  })

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span>Eksplorasi Produk</span>
            {categoryParam && (
              <button 
                onClick={() => router.push('/products')}
                className="btn btn-primary"
                style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold', 
                  padding: '0.4rem 0.85rem', 
                  borderRadius: '999px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  cursor: 'pointer',
                  textTransform: 'none',
                  letterSpacing: 'normal'
                }}
              >
                🏷️ {categoryParam} <strong style={{ marginLeft: '0.2rem', color: '#fca5a5' }}>✕</strong>
              </button>
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {categoryParam 
              ? `Menampilkan produk digital terbaik dalam kategori ${categoryParam}.` 
              : 'Temukan ribuan produk digital, tools, dan layanan terbaik.'}
            {searchParam && ` Menampilkan hasil pencarian untuk "${searchParam}".`}
          </p>
        </div>
        <select 
          className="input-field" 
          style={{ width: '200px' }}
          value={sortBy}
          onChange={(e) => {
            const val = e.target.value
            setSortBy(val)
            const params = new URLSearchParams(searchParams.toString())
            let sortCode = 'best_seller'
            if (val === 'Terbaru') sortCode = 'newest'
            else if (val === 'Harga Terendah') sortCode = 'price_asc'
            else if (val === 'Harga Tertinggi') sortCode = 'price_desc'
            params.set('sort', sortCode)
            router.push(`/products?${params.toString()}`)
          }}
        >
          <option value="Terpopuler">Terpopuler</option>
          <option value="Terbaru">Terbaru</option>
          <option value="Harga Tertinggi">Harga Tertinggi</option>
          <option value="Harga Terendah">Harga Terendah</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar Filter 3D */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Filter Kategori</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
              {(() => {
                const categoryIcons: Record<string, string> = {
                  'Akun Streaming': '📺',
                  'Software & OS': '💻',
                  'Template Desain': '🎨',
                  'Top Up Game': '🎮',
                  'Voucher Digital': '🎟️',
                  'Jasa Freelance': '💼',
                  'Layanan AI': '🤖',
                  'Web & Hosting': '🌐'
                }
                return categoriesList.map(cat => {
                  const isActive = categoryParam === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={isActive ? 'btn btn-primary btn-3d' : 'btn btn-secondary btn-3d'}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: isActive ? '800' : '500',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid var(--glass-border)',
                        background: isActive ? 'linear-gradient(135deg, var(--accent-color), #818cf8)' : 'var(--bg-secondary)',
                        color: isActive ? 'white' : 'var(--text-primary)',
                        boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'var(--shadow-sm)',
                        transition: 'all 0.2s ease',
                        textTransform: 'none',
                        letterSpacing: 'normal'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{categoryIcons[cat] || '🏷️'}</span>
                      <span style={{ flex: 1 }}>{cat}</span>
                      {isActive && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>✕</span>}
                    </button>
                  );
                })
              })()}
            </div>

            <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Harga</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="number" 
                placeholder="Min" 
                className="input-field" 
                style={{ padding: '0.5rem', width: '100%' }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="input-field" 
                style={{ padding: '0.5rem', width: '100%' }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button 
              onClick={() => {
                setPriceFilter({
                  min: minPrice ? Number(minPrice) : 0,
                  max: maxPrice ? Number(maxPrice) : Infinity
                })
              }}
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Terapkan Filter
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Memuat katalog produk digital...
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-3d)' }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' }}>🛍️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Belum Ada Produk</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 2rem auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {categoryParam || searchParam 
                  ? 'Tidak ada produk digital yang cocok dengan filter atau kata kunci Anda. Coba reset filter atau gunakan kata kunci lain.'
                  : 'Saat ini belum ada produk digital yang terdaftar di marketplace. Buka toko dan jadilah penjual pertama di platform kami!'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/register?role=seller">
                  <Button variant="primary" className="btn-3d">Buka Toko Sekarang</Button>
                </Link>
                {(categoryParam || searchParam || minPrice || maxPrice) && (
                  <button 
                    onClick={() => router.push('/products')} 
                    className="btn btn-secondary btn-3d"
                    style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3" style={{ gap: '1.5rem' }}>
              {sortedProducts.map(p => (
                <ProductCard key={p.id} product={p} className="card-3d" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.5rem' }}>Memuat katalog produk...</div>}>
      <ProductsCatalog />
    </Suspense>
  )
}
