'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load cart items on mount
  useEffect(() => {
    const localCart = localStorage.getItem('cart')
    if (localCart) {
      setCartItems(JSON.parse(localCart))
    }
  }, [])

  const updateQty = (id: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta)
          return { ...item, qty: newQty }
        }
        return item
      })
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const removeItem = (id: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  const serviceFee = subtotal > 0 ? 2500 : 0
  const total = subtotal + serviceFee

  const handleCheckout = async () => {
    if (cartItems.length === 0) return
    
    setIsProcessing(true)
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          serviceFee,
          total,
          paymentMethod: paymentMethod.toUpperCase()
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
        setIsProcessing(false)
        return
      }

      // Save the returned order to localStorage so Riwayat Pesanan and Checkout pages can read it immediately
      // (This maintains compatibility with the existing checkout UI without refactoring everything)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const newOrder = result.data
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]))
      
      // Clear cart
      setCartItems([])
      localStorage.removeItem('cart')
      
      // Redirect to Checkout page
      router.push(`/checkout/${newOrder.id}`)
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat memproses pesanan')
      setIsProcessing(false)
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div className="glass-panel card-3d" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛍️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Keranjang Belanjamu Kosong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Kamu belum menambahkan produk digital apapun ke dalam keranjang.</p>
          <Link href="/">
            <Button variant="primary" size="lg" className="btn-3d">Mulai Belanja</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map(item => (
              <div key={item.id} className="glass-panel card-3d" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'center', position: 'relative' }}>
                <div style={{ fontSize: '3rem', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                  {item.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    Varian: <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>{item.variant}</span>
                  </div>
                  {item.customFields.email && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Email Penerima: <strong>{item.customFields.email}</strong>
                    </div>
                  )}
                  {item.customFields.profile && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Nama Profil: <strong>{item.customFields.profile}</strong>
                    </div>
                  )}
                  {item.note && (
                    <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem', display: 'inline-block' }}>
                      Catatan: "{item.note}"
                    </div>
                  )}
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-color)', marginTop: '0.5rem' }}>
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                  <button 
                    onClick={() => setItemToDelete(item.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem' }}
                    title="Hapus Produk"
                  >
                    🗑️
                  </button>
                  
                  <div className="qty-selector glass-panel" style={{ display: 'flex', padding: '0.15rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', boxShadow: 'var(--shadow-inset)' }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ padding: '0.25rem 0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                    <span style={{ minWidth: '30px', textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ padding: '0.25rem 0.75rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Ringkasan Pembayaran</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Harga ({cartItems.reduce((acc, item) => acc + item.qty, 0)} Barang)</span>
                <span style={{ fontWeight: 600 }}>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Biaya Layanan (Trade Guard)</span>
                <span style={{ fontWeight: 600 }}>Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Metode Pembayaran</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  onClick={() => setPaymentMethod('qris')} 
                  style={{ 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: paymentMethod === 'qris' ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
                    background: paymentMethod === 'qris' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📱 QRIS Instan
                </button>
                <button 
                  onClick={() => setPaymentMethod('virtual_account')} 
                  style={{ 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: paymentMethod === 'virtual_account' ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
                    background: paymentMethod === 'virtual_account' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🏦 Transfer VA
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderTop: '2px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Tagihan</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-color)' }}>Rp {total.toLocaleString('id-ID')}</span>
            </div>

            <Button onClick={handleCheckout} disabled={isProcessing} variant="primary" size="lg" style={{ width: '100%', fontSize: '1.15rem' }} className="btn-3d">
              {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
            </Button>
            
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>🛡️</span> Dilindungi oleh <strong>Trade Guard</strong> 24 Jam
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Produk */}
      {itemToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '400px', background: 'var(--bg-secondary)', maxWidth: '90%', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-3d)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Hapus produk dari keranjang?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>Produk ini akan dihapus dari daftar belanja Anda.</p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button type="button" onClick={() => setItemToDelete(null)} variant="secondary">Batal</Button>
              <Button type="button" onClick={() => {
                const item = cartItems.find(x => x.id === itemToDelete)
                removeItem(itemToDelete)
                setItemToDelete(null)
                if (item) {
                  toast.success(`"${item.title}" dihapus dari keranjang.`)
                }
              }} variant="primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} className="btn-3d">Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
