'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

interface Order {
  id: string
  invoiceNo: string
  items: Array<{
    title: string
    price: number
    qty: number
    variant: string
    icon: string
  }>
  total: number
  status: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('buyer')
  const [storeName, setStoreName] = useState('')
  const [storeSlug, setStoreSlug] = useState('')
  const [walletBalance, setWalletBalance] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('50000')
  const [tier, setTier] = useState(0)
  const [bankVerified, setBankVerified] = useState(false)

  useEffect(() => {
    // Read auth states
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      setEmail(userEmail)
    }

    // Load dynamic profile info and balance from Supabase
    async function loadDBProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch role and balance (no .single() to avoid 406)
          const { data: usersResult } = await supabase.from('users').select('role, balance').eq('id', user.id)
          const userData = Array.isArray(usersResult) ? usersResult[0] : null
          if (userData) {
            setRole(userData.role || 'buyer')
            localStorage.setItem('userRole', userData.role || 'buyer')
            setWalletBalance(Number(userData.balance || 0))
            localStorage.setItem('walletBalance', String(userData.balance || 0))
          }

          // Fetch seller profile details (tier & bank) - only if seller/admin
          const currentRole = userData?.role || localStorage.getItem('userRole') || 'buyer'
          if (currentRole === 'seller' || currentRole === 'admin') {
            const { data: spResult } = await supabase
              .from('seller_profiles')
              .select('id, tier, bank_verified')
              .eq('user_id', user.id)
            const sellerData = Array.isArray(spResult) ? spResult[0] : null

            if (sellerData) {
              setTier(sellerData.tier || 0)
              setBankVerified(sellerData.bank_verified || false)

              // Fetch store properties
              const { data: storeResult } = await supabase
                .from('stores')
                .select('name, slug')
                .eq('seller_id', sellerData.id)
              const storeData = Array.isArray(storeResult) ? storeResult[0] : null

              if (storeData) {
                setStoreName(storeData.name)
                setStoreSlug(storeData.slug)
                localStorage.setItem('storeName', storeData.name)
                localStorage.setItem('storeSlug', storeData.slug)
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching database profile:', err)
      }
    }
    loadDBProfile()

    // Read recent orders
    const localOrders = localStorage.getItem('orders')
    if (localOrders) {
      setOrders(JSON.parse(localOrders).slice(0, 3)) // Take top 3 recent
    }
  }, [router])

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(topUpAmount)
    if (amount <= 0 || isNaN(amount)) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const newBalance = walletBalance + amount
        const { error } = await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', user.id)

        if (error) throw error

        setWalletBalance(newBalance)
        localStorage.setItem('walletBalance', String(newBalance))
        setShowTopUpModal(false)
        toast.success(`💰 Top Up sebesar Rp ${amount.toLocaleString('id-ID')} Berhasil! Saldo dompet digital Anda kini terisi.`)
      }
    } catch (err: any) {
      toast.error('Gagal memperbarui saldo di database: ' + err.message)
    }
  }

  const handleLogout = () => {
    toast('Keluar dari akun?', {
      description: 'Kamu perlu login ulang untuk mengakses pesanan.',
      action: {
        label: 'Keluar',
        onClick: async () => {
          try {
            await supabase.auth.signOut()
          } catch (err) {
            console.error('Error signing out from Supabase:', err)
          }
          localStorage.removeItem('userEmail')
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('userRole')
          localStorage.removeItem('storeName')
          localStorage.removeItem('storeSlug')
          localStorage.removeItem('storePhone')
          localStorage.removeItem('walletBalance')
          toast.success('Anda telah keluar dari sistem.')
          router.push('/login')
        }
      },
      cancel: {
        label: 'Batal',
        onClick: () => {}
      }
    })
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div className="flex flex-col md:flex-row gap-8 items-start w-full">
        
        {/* Left Card: Account Summary */}
        <div className="glass-panel card-3d w-full md:w-[40%]" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #818cf8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2.5rem', margin: '0 auto 1.5rem auto', boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.4), 0 8px 16px rgba(99,102,241,0.2)' }}>
            {email.substring(0, 2).toUpperCase()}
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.25rem' }}>Pengguna Marketdigi</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', wordBreak: 'break-all' }}>{email}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(99,102,241,0.1)', color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              👑 {role === 'seller' ? 'Seller + Buyer' : 'Buyer Premium'}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
              Tier: <span style={{ color: tier > 0 ? 'var(--success)' : 'var(--warning)' }}>Level {tier} {tier === 0 ? '(Bronze)' : '(Silver)'}</span>
            </div>
          </div>

          {/* Dompet Digital / Saldo */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Saldo Dompet Digital</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>Rp {walletBalance.toLocaleString('id-ID')}</span>
              <button onClick={() => setShowTopUpModal(true)} style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', background: 'var(--accent-color)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>+ Top Up</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {role === 'seller' && (
              <Link href="/dashboard">
                <Button variant="primary" style={{ width: '100%' }} className="btn-3d">💼 Masuk Seller Center</Button>
              </Link>
            )}
            <Link href="/settings">
              <Button variant="secondary" style={{ width: '100%' }}>⚙️ Pengaturan Akun</Button>
            </Link>
            <Button onClick={handleLogout} variant="secondary" style={{ width: '100%', borderColor: 'var(--danger)', color: 'var(--danger)' }}>🚪 Keluar Akun</Button>
          </div>
        </div>

        {/* Right Section: Purchase History & Active Items */}
        <div className="w-full md:w-[60%] flex flex-col gap-8">
          
          {/* Active Licenses Section */}
          <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🔑 Lisensi Aktif</h3>
            
            {orders.some(o => o.status === 'Berhasil' || o.status === 'Garansi Aktif') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.filter(o => o.status === 'Berhasil' || o.status === 'Garansi Aktif').map(ord => (
                  <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)' }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{ord.items[0].title}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Varian: {ord.items[0].variant}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px dashed var(--glass-border)', display: 'inline-block' }}>
                        KEY-LISENSI-ACTIVE-VAL-2026
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--success)' }}>Garansi Aktif</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>Belum ada lisensi produk digital yang aktif saat ini.</p>
            )}
          </div>

          {/* Recent Orders Section */}
          <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>📦 Transaksi Terakhir</h3>
              <Link href="/riwayat-pesanan" style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.9rem' }}>Lihat Semua ➔</Link>
            </div>

            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>Belum ada transaksi pembelian digital.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map(order => (
                  <div key={order.id} style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '2rem' }}>{order.items[0].icon}</span>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{order.items[0].title}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Rp {order.total.toLocaleString('id-ID')}</div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: order.status === 'Berhasil' || order.status === 'Garansi Aktif' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', width: '400px', background: 'var(--bg-secondary)', maxWidth: '90%' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Top Up Saldo</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Isi saldo dompet digital Anda dengan metode transfer instan.</p>
            
            <form onSubmit={handleTopUp}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Jumlah Top Up (Rp)</label>
                <select 
                  className="input-field" 
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none', fontWeight: 'bold' }}
                >
                  <option value="10000">10.000</option>
                  <option value="25000">25.000</option>
                  <option value="50000">50.000</option>
                  <option value="100000">100.000</option>
                  <option value="250000">250.000</option>
                  <option value="500000">500.000</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button type="button" onClick={() => setShowTopUpModal(false)} variant="secondary">Batal</Button>
                <Button type="submit" variant="primary" className="btn-3d">Konfirmasi Bayar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
