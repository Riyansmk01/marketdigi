'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabaseClient'

interface FlashSaleItem {
  id: string
  title: string
  originalPrice: number
  promoPrice: number
  soldPercent: number
  stockLeft: number
  icon: string
  fulfillmentType: string
}

export default function FlashSalePage() {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(7200) // 2 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  const [items, setItems] = useState<FlashSaleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFlashSale() {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (data) {
          const promos = data.filter((p: any) => p.badge === 'Promo')
          const mapped = promos.map((p: any) => {
            const numId = parseInt(p.id) || Math.floor(Math.random() * 10) + 1
            const originalPrice = Math.round((p.price * 1.5) / 1000) * 1000
            const soldPercent = (numId * 17) % 40 + 50
            const stockLeft = (numId * 3) % 25 + 5
            
            let icon = '📦'
            const titleLower = p.title.toLowerCase()
            if (titleLower.includes('netflix') || titleLower.includes('youtube')) icon = '📺'
            else if (titleLower.includes('spotify') || titleLower.includes('music')) icon = '🎵'
            else if (titleLower.includes('windows') || titleLower.includes('software') || titleLower.includes('adobe')) icon = '💻'
            else if (titleLower.includes('canva') || titleLower.includes('figma') || titleLower.includes('design')) icon = '🎨'

            return {
              id: p.id,
              title: p.title,
              originalPrice,
              promoPrice: p.price,
              soldPercent,
              stockLeft,
              icon,
              fulfillmentType: p.fulfillmentType
            }
          })
          setItems(mapped)
        }
      } catch (err) {
        console.error('Failed to load flash sale products:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFlashSale()
  }, [])

  const handleBuyNow = (item: FlashSaleItem) => {
    // Add to orders immediately simulating checkouts
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const newOrder = {
      id: 'ord_' + Math.random().toString(36).substr(2, 9),
      invoiceNo: 'INV-' + new Date().getFullYear() + (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getDate().toString().padStart(2, '0') + '-' + Math.floor(1000 + Math.random() * 9000),
      items: [
        {
          id: item.id,
          title: item.title,
          price: item.promoPrice,
          qty: 1,
          variant: 'Promo Flash Sale',
          note: 'Flash Sale Order',
          icon: item.icon
        }
      ],
      subtotal: item.promoPrice,
      serviceFee: 2500,
      total: item.promoPrice + 2500,
      paymentMethod: 'QRIS',
      status: 'Proses',
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]))
    router.push('/riwayat-pesanan?success=true')
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      {/* Header section with Timer */}
      <div className="glass-panel" style={{ padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', background: 'linear-gradient(135deg, #4f46e5, #4338ca)', color: 'white', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '999px', display: 'inline-block', marginBottom: '1rem' }}>⚡ Promo Terbatas</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>Flash Sale Terbesar Hari Ini!</h1>
          <p style={{ opacity: 0.85, marginTop: '0.5rem', fontSize: '1.05rem' }}>Dapatkan lisensi, software, dan akun streaming diskon gila-gilaan.</p>
        </div>

        {/* Countdown box */}
        <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '1.5rem 2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Berakhir Dalam</span>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', fontFamily: 'monospace', letterSpacing: '2px' }}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
        {loading ? (
          <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }} className="glass-panel">
            Memuat produk promo flash sale...
          </div>
        ) : items.length === 0 ? (
          <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }} className="glass-panel">
            ⚡ Saat ini belum ada promo Flash Sale aktif. Silakan kembali lagi nanti!
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="glass-panel card-3d" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.25rem 0.6rem', background: 'var(--danger)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px' }}>
                DISKON {Math.round((1 - item.promoPrice / item.originalPrice) * 100)}%
              </span>

              <div style={{ fontSize: '3.5rem', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '1.5rem 0', margin: '1rem 0' }}>
                {item.icon}
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-color)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {item.fulfillmentType}
              </span>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '1rem', flex: 1 }}>
                {item.title}
              </h3>

              {/* Price section */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.85rem', marginRight: '0.5rem' }}>
                  Rp {item.originalPrice.toLocaleString('id-ID')}
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--danger)' }}>
                  Rp {item.promoPrice.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  <span>{item.soldPercent}% Terjual</span>
                  <span>Sisa {item.stockLeft} Stok</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.soldPercent}%`, background: 'linear-gradient(90deg, var(--danger), #f59e0b)' }} />
                </div>
              </div>

              <Button onClick={() => handleBuyNow(item)} variant="primary" style={{ width: '100%' }} className="btn-3d">
                ⚡ Beli Sekarang
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
