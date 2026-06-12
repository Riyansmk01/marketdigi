'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Default to seller role if ?role=seller is present
  const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer'
  
  const [role, setRole] = useState<'buyer' | 'seller'>(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Seller fields
  const [storeName, setStoreName] = useState('')
  const [storeSlug, setStoreSlug] = useState('')
  const [phone, setPhone] = useState('')
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleGoogleRegister = async () => {
    setErrorMsg('')
    try {
      setIsConnecting(true)
      localStorage.setItem('oauth_chosen_role', role) // Save selected role ('buyer' or 'seller')
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      })
      if (error) throw error
    } catch (err: any) {
      console.error('Google OAuth registration error:', err)
      toast.error('Gagal registrasi via Google: ' + err.message)
      setIsConnecting(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password || !confirmPassword) {
      setErrorMsg('Semua data wajib diisi')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok')
      return
    }

    setIsConnecting(true)

    if (role === 'seller') {
      if (!storeName || !storeSlug || !phone) {
        setErrorMsg('Data toko dan nomor telepon wajib diisi')
        setIsConnecting(false)
        return
      }

      // Direct Seller Registration with WhatsApp auto-validation
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'seller',
              storeName,
              storeSlug,
              phone
            }
          }
        })
        if (error) throw error

        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', 'seller')
        localStorage.setItem('storeName', storeName)
        localStorage.setItem('storeSlug', storeSlug)
        localStorage.setItem('storePhone', phone)
        window.dispatchEvent(new Event('storage'))
        
        toast.success('🎉 Pendaftaran Seller Berhasil! Toko Anda kini aktif.')
        router.push('/dashboard?welcome=true')
      } catch (err: any) {
        setErrorMsg(err.message || 'Pendaftaran gagal. Silakan periksa kembali email Anda.')
        toast.error('Registrasi Gagal')
      } finally {
        setIsConnecting(false)
      }
    } else {
      // Real Buyer Registration via Supabase
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: role }
          }
        })
        if (error) throw error

        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', role)
        window.dispatchEvent(new Event('storage'))
        
        toast.success('Akun berhasil dibuat. Yuk mulai belanja produk digital.')
        router.push('/profile?registerSuccess=true')
      } catch (err: any) {
        setErrorMsg(err.message || 'Pendaftaran gagal. Silakan periksa kembali email Anda.')
        toast.error('Registrasi Gagal')
      } finally {
        setIsConnecting(false)
      }
    }
  }

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, rgba(0,0,0,0) 60%)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .captcha-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid var(--accent-color);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
      ` }} />

      {isConnecting && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' }}>
          <div className="captcha-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px', marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', fontWeight: 'bold' }}>Memproses Pendaftaran Anda...</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Mohon tunggu sebentar.</p>
        </div>
      )}

      <div className="glass-panel card-3d" style={{ width: '500px', maxWidth: '100%', padding: '2.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Daftar Akun</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mulai berbelanja produk digital atau buka toko Anda sendiri sekarang.</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--glass-border)' }}>
          <button 
            type="button"
            onClick={() => { setRole('buyer'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: 'var(--radius-sm)', background: role === 'buyer' ? 'var(--bg-secondary)' : 'transparent', color: role === 'buyer' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', boxShadow: role === 'buyer' ? 'var(--shadow-sm)' : 'none' }}
          >
            🛒 Sebagai Pembeli
          </button>
          <button 
            type="button"
            onClick={() => { setRole('seller'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: 'var(--radius-sm)', background: role === 'seller' ? 'var(--bg-secondary)' : 'transparent', color: role === 'seller' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 700, cursor: 'pointer', boxShadow: role === 'seller' ? 'var(--shadow-sm)' : 'none' }}
          >
            💼 Sebagai Penjual
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid var(--danger)' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            <Input 
              label="Alamat Email" 
              type="email" 
              placeholder="contoh@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              label="Kata Sandi" 
              type="password" 
              placeholder="Buat kata sandi minimal 6 karakter" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Input 
              label="Konfirmasi Kata Sandi" 
              type="password" 
              placeholder="Ketik ulang kata sandi Anda" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Seller Specific Fields */}
            {role === 'seller' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontWeight: '800', color: 'var(--accent-color)' }}>Pengaturan Toko Digital</h4>
                
                <Input 
                  label="Nama Toko" 
                  type="text" 
                  placeholder="Contoh: Montshop" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Slug Toko (Domain Toko)</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.25rem' }}>marketdigi.me/store/</span>
                    <input 
                      type="text" 
                      placeholder="montshop"
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontWeight: 'bold' }}
                      required
                    />
                  </div>
                </div>

                <Input 
                  label="No. WhatsApp (Validasi Mandiri)" 
                  type="tel" 
                  placeholder="Contoh: 081234567890" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }} className="btn-3d">
            Daftar Sekarang
          </Button>

          <div style={{ position: 'relative', textAlign: 'center', margin: '1.5rem 0' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-secondary)', padding: '0 0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ATAU DAFTAR DENGAN</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleRegister}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--glass-border)', 
              background: '#ffffff', 
              color: '#1f2937',
              fontWeight: 700, 
              cursor: 'pointer', 
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.18-5.12 4.18-3.324 0-6.024-2.7-6.024-6.024s2.7-6.024 6.024-6.024c1.472 0 2.82.533 3.86 1.41l3.078-3.078C18.995 2.84 15.827 1.5 12.24 1.5 6.442 1.5 1.74 6.2 1.74 12s4.702 10.5 10.5 10.5c5.798 0 10.5-4.7 10.5-10.5 0-.665-.084-1.309-.224-1.925H12.24z"/>
              <path fill="#4285f4" d="M22.516 10.075H12.24v4.325h6.887a7.228 7.228 0 0 1-3.111 4.74l3.175 3.175c4.71-4.325 7.42-10.7 7.42-10.7a11.162 11.162 0 0 0-.226-1.54z"/>
              <path fill="#fbbc05" d="M5.716 7.467A6.026 6.026 0 0 1 12.24 5.952c1.472 0 2.82.533 3.86 1.41l3.078-3.078A10.457 10.457 0 0 0 12.24 1.5c-4.488 0-8.326 2.808-9.878 6.786l3.354-.819z"/>
              <path fill="#34a853" d="M2.362 8.286l3.354.819C6.467 7.467 8.243 5.952 12.24 5.952c1.472 0 2.82.533 3.86 1.41l3.078-3.078A10.457 10.457 0 0 0 12.24 1.5c-4.488 0-8.326 2.808-9.878 6.786l3.354-.819z"/>
            </svg>
            Daftar dengan Google
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          Sudah punya akun? <Link href="/login" style={{ color: 'var(--accent-color)', fontWeight: 800 }}>Masuk Disini</Link>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.5rem' }}>Memuat Halaman...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
