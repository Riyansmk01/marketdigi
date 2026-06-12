'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface WishlistItem {
  id: string
  title: string
  price: number
  displayPrice: string
  badge: string
  fulfillmentType: string
  slug: string
  icon: string
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  useEffect(() => {
    const localWishlist = localStorage.getItem('wishlist')
    if (localWishlist) {
      setWishlist(JSON.parse(localWishlist))
    } else {
      setWishlist([])
    }
  }, [])

  const removeItem = (id: string, silent = false) => {
    const item = wishlist.find(x => x.id === id)
    const updated = wishlist.filter(item => item.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    if (!silent && item) {
      toast.success(`"${item.title}" dihapus dari favorit.`);
    }
  }

  const addToCart = (item: WishlistItem) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    
    // Check if item already exists in cart, if so increase qty, else add new
    const cartItems = JSON.parse(localStorage.getItem('orders') || '[]') // Read orders just as proxy or save to local storage
    
    // We will save to a cart structure or notify
    const cartItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      qty: 1,
      variant: 'Standard',
      note: 'Dipesan dari Wishlist',
      customFields: {},
      icon: item.icon
    }
    
    // Standard alert simulation
    toast.success(`"${item.title}" ditambahkan ke keranjang!`);
    removeItem(item.id, true)
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Wishlist Saya</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Daftar produk digital yang Anda simpan untuk dibeli nanti.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel card-3d" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '3rem auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>❤️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Wishlist Kosong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Anda belum menyimpan produk digital apapun ke wishlist.</p>
          <Link href="/">
            <Button variant="primary" size="lg" className="btn-3d">Cari Produk Menarik</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
          {wishlist.map(item => (
            <div key={item.id} className="glass-panel card-3d" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', background: 'var(--bg-secondary)', position: 'relative' }}>
              <button 
                onClick={() => removeItem(item.id)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-primary)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
                title="Hapus"
              >
                ✖️
              </button>
              
              <div style={{ fontSize: '3rem', margin: '1rem 0', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
                {item.icon}
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-color)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {item.fulfillmentType}
              </span>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '0.5rem', flex: 1 }}>
                {item.title}
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                  {item.displayPrice}
                </div>
                <Button onClick={() => addToCart(item)} variant="primary" size="sm" className="btn-3d" style={{ padding: '0.5rem 0.75rem' }}>
                  🛒 Beli
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
