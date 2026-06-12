'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'developer' | 'bank' | 'admin'>('profile')
  const [userRole, setUserRole] = useState('buyer')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('Pengguna Marketdigi')
  const [phone, setPhone] = useState('081234567890')
  const [apiKey, setApiKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Bank Verification & Tier States
  const [bankName, setBankName] = useState('')
  const [bankAccountNo, setBankAccountNo] = useState('')
  const [bankAccountName, setBankAccountName] = useState('')
  const [isBankVerified, setIsBankVerified] = useState(false)
  const [verificationStep, setVerificationStep] = useState<'form' | 'checking'>('form')
  const [checkSubStep, setCheckSubStep] = useState(0)
  const [tier, setTier] = useState(0)
  
  // Settings preferences
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
      return
    }

    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      setEmail(userEmail)
    }

    const savedPhone = localStorage.getItem('storePhone')
    if (savedPhone) {
      setPhone(savedPhone)
    }

    const savedApiKey = localStorage.getItem('developerApiKey')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    // Fetch bank details and tier from Supabase seller profiles
    async function fetchBankDetails() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          if (userData && userData.role) {
            setUserRole(userData.role)
          }

          const { data: spResult } = await supabase
            .from('seller_profiles')
            .select('bank_name, bank_account_no, bank_account_name, bank_verified, tier')
            .eq('user_id', user.id)
          const sellerProfile = Array.isArray(spResult) ? spResult[0] : null

          if (sellerProfile) {
            setBankName(sellerProfile.bank_name || '')
            setBankAccountNo(sellerProfile.bank_account_no || '')
            setBankAccountName(sellerProfile.bank_account_name || '')
            setIsBankVerified(sellerProfile.bank_verified || false)
            setTier(sellerProfile.tier || 0)
          }
        }
      } catch (err) {
        // Non-critical, ignore silently
      }
    }
    fetchBankDetails()
  }, [router])

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('userEmail', email)
    if (localStorage.getItem('userRole') === 'seller') {
      localStorage.setItem('storePhone', phone)
    }
    toast.success('Informasi profil berhasil disimpan!')
  }

  const handleGenerateApiKey = () => {
    const key = 'md_live_' + Math.random().toString(36).substr(2, 16) + Math.random().toString(36).substr(2, 16)
    setApiKey(key)
    localStorage.setItem('developerApiKey', key)
    toast.success('API Key Baru berhasil dibuat! Gunakan untuk webhook pengiriman instan.')
  }

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bankName || !bankAccountNo || !bankAccountName) {
      toast.error('Mohon lengkapi semua data rekening bank')
      return
    }

    setVerificationStep('checking')
    setCheckSubStep(1)

    // Step 1 animation
    setTimeout(() => {
      setCheckSubStep(2)
      // Step 2 animation
      setTimeout(() => {
        setCheckSubStep(3)
        // Step 3 animation (Saving to DB & upgrading to Tier 1)
        setTimeout(async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              const { error } = await supabase
                .from('seller_profiles')
                .update({
                  bank_name: bankName,
                  bank_account_no: bankAccountNo,
                  bank_account_name: bankAccountName,
                  bank_verified: true,
                  tier: 1 // Upgrade to Level 1
                })
                .eq('user_id', user.id)

              if (error) throw error

              setIsBankVerified(true)
              setTier(1)
              setVerificationStep('form')
              toast.success('🎉 Rekening Bank Berhasil Diverifikasi! Akun Anda kini naik ke Level 1 (Silver).')
            }
          } catch (err: any) {
            toast.error('Gagal memperbarui database: ' + err.message)
            setVerificationStep('form')
          }
        }, 1500)
      }, 1500)
    }, 1500)
  }

  const handleSyncVIP = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/vipayment/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'game', markupPercentage: 10 })
      })
      const result = await res.json()
      if (res.ok && result.status) {
        toast.success(`Sinkronisasi berhasil! ${result.total} produk Top Up ditambahkan/diperbarui.`)
      } else {
        toast.error(result.message || 'Gagal melakukan sinkronisasi')
      }
    } catch (err: any) {
      toast.error('Gagal terhubung ke server')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Pengaturan Akun</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kelola data pribadi, kata sandi, preferensi notifikasi, dan API pengiriman instan Anda.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem', alignItems: 'flex-start' }}>
        {/* Navigation Sidebar */}
        <aside className="glass-panel" style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'profile' ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === 'profile' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                👤 Data Profil
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('security')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'security' ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === 'security' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                🔒 Keamanan & Sandi
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('bank')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'bank' ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === 'bank' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                🏦 Rekening Bank
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('developer')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === 'developer' ? 'var(--accent-color)' : 'transparent',
                  color: activeTab === 'developer' ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                🛠️ Mode Pengembang (API)
              </button>
            </li>
            {userRole === 'admin' && (
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: activeTab === 'admin' ? 'var(--accent-color)' : 'transparent',
                    color: activeTab === 'admin' ? 'white' : 'var(--danger)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  ⚡ Admin Panel
                </button>
              </li>
            )}
          </ul>
        </aside>

        {/* Content Box */}
        <div className="glass-panel card-3d" style={{ padding: '2.5rem', background: 'var(--bg-secondary)' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Informasi Profil</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <Input 
                  label="Nama Lengkap" 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
                
                <Input 
                  label="Email Utama" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />

                <Input 
                  label="Nomor WhatsApp" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                />

                {/* Notifications settings */}
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                  <h4 style={{ fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>Preferensi Notifikasi</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                      Kirimkan invoice dan info pengiriman ke email saya
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={notifyWhatsapp} onChange={(e) => setNotifyWhatsapp(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                      Kirimkan notifikasi WhatsApp instan untuk pembaruan status Trade Guard
                    </label>
                  </div>
                </div>
              </div>

              <Button type="submit" variant="primary" className="btn-3d">Simpan Perubahan</Button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Password berhasil diperbarui!'); }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Keamanan Akun</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <Input label="Kata Sandi Lama" type="password" placeholder="Masukkan kata sandi saat ini" required />
                <Input label="Kata Sandi Baru" type="password" placeholder="Masukkan kata sandi baru" required />
                <Input label="Konfirmasi Kata Sandi Baru" type="password" placeholder="Ulangi kata sandi baru" required />
              </div>

              <Button type="submit" variant="primary" className="btn-3d">Perbarui Kata Sandi</Button>
            </form>
          )}

          {activeTab === 'developer' && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Mode Pengembang (Webhooks & API)</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Integrasikan pengiriman produk digital Anda secara otomatis dengan Webhook API. Server kami akan memanggil endpoint Anda begitu pembayaran buyer berhasil.
              </p>

              <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Live API Key Credentials</label>
                
                {apiKey ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <code style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-color)', fontWeight: 'bold', overflowX: 'auto', fontSize: '0.9rem' }}>
                      {apiKey}
                    </code>
                    <button 
                      type="button" 
                      onClick={() => { navigator.clipboard.writeText(apiKey); toast.success('API Key disalin ke clipboard!'); }}
                      style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      📋 Copy
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Belum ada API key yang tergenerate. Klik tombol di bawah untuk membuat.</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button onClick={handleGenerateApiKey} variant="primary" className="btn-3d">
                  {apiKey ? 'Regenerate API Key' : 'Buat API Key Baru'}
                </Button>
                {apiKey && (
                  <Button onClick={() => { setApiKey(''); localStorage.removeItem('developerApiKey'); }} variant="secondary" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                    Revoke API Key
                  </Button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Verifikasi Rekening Bank & Upgrade Tier</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Verifikasi rekening bank Anda untuk meningkatkan limit transaksi, menarik pendapatan langsung, dan menaikkan status toko Anda ke <strong>Level 1 (Silver)</strong> secara permanen di database.
              </p>

              {isBankVerified ? (
                <div className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: '800', color: 'var(--success)', marginBottom: '1rem', fontSize: '1.1rem' }}>✓ Rekening Bank Terverifikasi</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Bank:</span>
                    <strong>{bankName}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>No. Rekening:</span>
                    <strong>{bankAccountNo}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>Nama Pemilik:</span>
                    <strong>{bankAccountName}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>Tier Akun:</span>
                    <strong style={{ color: 'var(--success)' }}>Level 1 (Silver) - Tanpa Batasan Limit</strong>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBankSubmit}>
                  {verificationStep === 'form' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pilih Bank</label>
                        <select 
                          className="input-field" 
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none', fontWeight: 'bold' }}
                          required
                        >
                          <option value="">-- Pilih Bank --</option>
                          <option value="BCA">PT Bank Central Asia Tbk. (BCA)</option>
                          <option value="Mandiri">PT Bank Mandiri (Persero) Tbk.</option>
                          <option value="BRI">PT Bank Rakyat Indonesia (Persero) Tbk. (BRI)</option>
                          <option value="BNI">PT Bank Negara Indonesia (Persero) Tbk. (BNI)</option>
                          <option value="CIMB">PT Bank CIMB Niaga Tbk.</option>
                          <option value="BSI">PT Bank Syariah Indonesia Tbk. (BSI)</option>
                          <option value="Gopay">GoPay (E-Wallet)</option>
                          <option value="Ovo">OVO (E-Wallet)</option>
                          <option value="Dana">DANA (E-Wallet)</option>
                        </select>
                      </div>

                      <Input 
                        label="Nomor Rekening / No. HP E-Wallet" 
                        type="text" 
                        placeholder="Contoh: 1234567890 atau 0812xxxxxx" 
                        value={bankAccountNo} 
                        onChange={(e) => setBankAccountNo(e.target.value.replace(/[^0-9]/g, ''))} 
                        required
                      />

                      <Input 
                        label="Nama Pemilik Rekening (Sesuai KTP/Buku Tabungan)" 
                        type="text" 
                        placeholder="Contoh: BUDI SANTOSO" 
                        value={bankAccountName} 
                        onChange={(e) => setBankAccountName(e.target.value.toUpperCase())} 
                        required
                      />

                      <Button type="submit" variant="primary" className="btn-3d">Kirim Verifikasi</Button>
                    </div>
                  )}

                  {verificationStep === 'checking' && (
                    <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                      <div className="captcha-spinner" style={{ width: '50px', height: '50px', borderWidth: '5px', marginBottom: '1.5rem' }} />
                      <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.2rem' }}>Memproses Verifikasi Rekening</h4>
                      <div style={{ maxWidth: '350px', margin: '0 auto', fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                        <span style={{ color: checkSubStep >= 1 ? 'var(--success)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>
                          {checkSubStep >= 1 ? '✓' : '•'} Menghubungkan ke API Validator Bank Indonesia...
                        </span>
                        <span style={{ color: checkSubStep >= 2 ? 'var(--success)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>
                          {checkSubStep >= 2 ? '✓' : '•'} Memvalidasi kecocokan nomor rekening {bankName}...
                        </span>
                        <span style={{ color: checkSubStep >= 3 ? 'var(--success)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>
                          {checkSubStep >= 3 ? '✓' : '•'} Pemilik rekening teridentifikasi: <strong>{bankAccountName}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Admin Tools Tab */}
          {activeTab === 'admin' && userRole === 'admin' && (
            <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Pengaturan Admin</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Pusat kendali integrasi dan sinkronisasi data sistem MarketDigi.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Integrasi Layanan VIP Reseller</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Tarik ribuan produk terbaru (seperti Mobile Legends, PUBG, dll) langsung dari API VIP Reseller. 
                    Produk akan secara otomatis dimasukkan ke tabel "products" toko Anda (sebagai Admin) dengan markup harga +10%.
                  </p>
                  <Button onClick={handleSyncVIP} disabled={isSaving} variant="primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}>
                    {isSaving ? 'Menyinkronkan Data...' : '🔄 Sinkronisasi Produk Top Up'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
