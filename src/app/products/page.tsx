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
        // Fetch published products and join stores + categories table for seller & category details
        const { data, error } = await supabase.from('products').select('*, stores(name, slug), categories(name)').eq('is_published', true)
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
              // Normalize name field: DB uses 'name', mock uses 'title'
              title: p.name || p.title || 'Produk Digital',
              // categories join will populate p.categories.name when present
              categoryName: p.categoryName || p.categories?.name || '',
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
    // Use title (normalized above) for search, also check categoryName
    const productTitle = p.title || ''
    const productCategory = p.categoryName || ''
    const categoryMatch = !categoryParam || productCategory.toLowerCase() === categoryParam.toLowerCase()
    const searchMatch = !searchParam || productTitle.toLowerCase().includes(searchParam.toLowerCase())
    const price = Number(p.price) || 0
    const minMatch = !priceFilter.min || price >= priceFilter.min
    const maxMatch = priceFilter.max === Infinity || !priceFilter.max || price <= priceFilter.max
    return categoryMatch && searchMatch && minMatch && maxMatch
  })

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Harga Terendah') {
      return Number(a.price) - Number(b.price)
    }
    if (sortBy === 'Harga Tertinggi') {
      return Number(b.price) - Number(a.price)
    }
    if (sortBy === 'Terbaru') {
      // Use created_at timestamp if available, fallback to id comparison
      const dateA = (a as any).created_at ? new Date((a as any).created_at).getTime() : 0
      const dateB = (b as any).created_at ? new Date((b as any).created_at).getTime() : 0
      return dateB - dateA
    }
    // Terpopuler (by reviewCount directly computed from DB reviews)
    const rA = (a as any).reviewCount || 0
    const rB = (b as any).reviewCount || 0
    return rB - rA
  })

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '80vh' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            {categoryParam 
              ? `Menampilkan produk dalam kategori ${categoryParam}.` 
              : 'Temukan ribuan produk digital, tools, dan layanan terbaik.'}
            {searchParam && ` Menampilkan hasil pencarian untuk "${searchParam}".`}
          </p>
          {categoryParam && (
            <button 
              onClick={() => router.push('/products')}
              style={{ 
                fontSize: '0.8rem', 
                fontWeight: '600', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '999px', 
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              Hapus Filter ✕
            </button>
          )}
        </div>
        <select 
          style={{ 
            width: '200px', 
            padding: '0.5rem', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--glass-border)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-[260px] flex-shrink-0">
          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: '90px' }}>
            <h3 style={{ marginBottom: '1.25rem', fontWeight: 700, fontSize: '1.1rem' }}>Filter Kategori</h3>
            <div className="flex flex-row md:flex-col gap-3 mb-8 overflow-x-auto pb-2">
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
                      className="flex-shrink-0"
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '999px',
                        fontWeight: isActive ? '600' : '500',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: isActive ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
                        background: isActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        color: isActive ? 'var(--accent-color)' : 'var(--text-primary)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{categoryIcons[cat] || '🏷️'}</span>
                      <span style={{ flex: 1 }}>{cat}</span>
                    </button>
                  );
                })
              })()}
            </div>

            <h3 style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>Harga</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input 
                type="number" 
                placeholder="Min" 
                style={{ padding: '0.5rem', width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-secondary)' }}>-</span>
              <input 
                type="number" 
                placeholder="Max" 
                style={{ padding: '0.5rem', width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => {
                setPriceFilter({
                  min: minPrice ? Number(minPrice) : 0,
                  max: maxPrice ? Number(maxPrice) : Infinity
                })
              }}
              variant="secondary" 
              style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', fontSize: '0.9rem' }}
            >
              Terapkan Filter
            </Button>
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              Memuat katalog produk digital...
            </div>
          ) : sortedProducts.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--glass-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.5 }}>🛍️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Belum Ada Produk</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {categoryParam || searchParam || minPrice || maxPrice
                  ? 'Tidak ada produk digital yang cocok dengan filter atau kata kunci Anda.'
                  : 'Saat ini belum ada produk digital yang terdaftar di marketplace.'}
              </p>
              {(categoryParam || searchParam || minPrice || maxPrice) && (
                <Button 
                  onClick={() => router.push('/products')} 
                  variant="secondary"
                  size="sm"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3" style={{ gap: '1.25rem' }}>
              {sortedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
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
