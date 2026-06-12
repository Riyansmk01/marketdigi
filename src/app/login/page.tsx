'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

type AuthMode = 'email-step-1' | 'email-step-2'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<AuthMode>('email-step-1')
  
  // Normal Login states
  const [password, setPassword] = useState('')
  const [otpType, setOtpType] = useState<'password' | 'telegram' | 'whatsapp'>('password')
  const [otpSent, setOtpSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Only process session on OAuth redirect (when URL hash is present) or fresh page load after OAuth
    async function checkAuthSession() {
      if (typeof window !== 'undefined') {
        // Only run on OAuth callback (hash present) or if localStorage shows logged in
        const hasHash = window.location.hash.includes('access_token')
        const alreadyLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        
        // If already logged in and no OAuth hash, skip (avoid re-processing)
        if (alreadyLoggedIn && !hasHash) {
          return
        }

        setIsConnecting(true)
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          
          // Clear Supabase session tokens from URL hash immediately
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname)
          }

          if (session?.user) {
            localStorage.setItem('userEmail', session.user.email || '')
            localStorage.setItem('isLoggedIn', 'true')
            
            // Fetch database-backed profile role and balance (no .single() to avoid 406)
            const { data: usersResult } = await supabase.from('users').select('role, balance').eq('id', session.user.id)
            const dbUser = Array.isArray(usersResult) ? usersResult[0] : null
            
            // Determine effective role
            let role = dbUser?.role || 'buyer'

            // Admin override by email
            if (session.user.email === 'perdhanariyan@gmail.com') {
              role = 'admin'
              await supabase.from('users').update({ role: 'admin' }).eq('id', session.user.id)
            } else {
              // Check for dynamic OAuth role selection (from register page)
              const oauthChosenRole = localStorage.getItem('oauth_chosen_role')
              if (oauthChosenRole) {
                role = oauthChosenRole
                // Always update DB to chosen role — even if user already existed
                await supabase.from('users').update({ role: oauthChosenRole }).eq('id', session.user.id)
                localStorage.removeItem('oauth_chosen_role')
              }
            }

            localStorage.setItem('walletBalance', String(dbUser?.balance || 0))
            localStorage.setItem('userRole', role)
            
            // Sync/Create store properties (only for seller/admin)
            if (role === 'seller' || role === 'admin') {
              const { data: spResult } = await supabase.from('seller_profiles').select('id').eq('user_id', session.user.id)
              let sellerProfile = Array.isArray(spResult) ? spResult[0] : null

              if (!sellerProfile) {
                // Auto-create missing seller profile
                const randomPhone = '0853' + Math.floor(10000000 + Math.random() * 90000000)
                const { data: newProfileResult } = await supabase.from('seller_profiles').insert({
                  user_id: session.user.id,
                  whatsapp_number: randomPhone,
                  whatsapp_verified: true,
                  tier: 0
                }).select('id')
                sellerProfile = Array.isArray(newProfileResult) ? newProfileResult[0] : null
              }

              if (sellerProfile) {
                const { data: storeResult } = await supabase.from('stores').select('name, slug').eq('seller_id', sellerProfile.id)
                let store = Array.isArray(storeResult) ? storeResult[0] : null

                if (!store) {
                  const emailPrefix = session.user.email?.split('@')[0] || 'store'
                  const storeNameDefault = 'Toko ' + emailPrefix
                  const storeSlugDefault = emailPrefix.toLowerCase().replace(/[^a-z0-9-]/g, '') + '-' + Math.floor(100 + Math.random() * 900)
                  const { data: newStoreResult } = await supabase.from('stores').insert({
                    seller_id: sellerProfile.id,
                    name: storeNameDefault,
                    slug: storeSlugDefault
                  }).select('name, slug')
                  store = Array.isArray(newStoreResult) ? newStoreResult[0] : null
                }

                if (store) {
                  localStorage.setItem('storeName', store.name)
                  localStorage.setItem('storeSlug', store.slug)
                }
              }
            }
            
            window.dispatchEvent(new Event('storage'))
            toast.success(`Berhasil masuk! Selamat datang, ${session.user.email}.`)
            router.push('/profile?loginSuccess=true')
          } else if (error) {
            console.error('Session check error:', error)
          }
        } catch (err) {
          console.error('Failed to get session:', err)
        } finally {
          setIsConnecting(false)
        }
      }
    }
    checkAuthSession()
  }, [router])

  // 1. Normal Email Login Handlers
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setErrorMsg('Alamat email wajib diisi')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Masukkan format email yang valid')
      return
    }
    setErrorMsg('')
    setStep('email-step-2')
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpType === 'password' && !password) {
      setErrorMsg('Kata sandi wajib diisi')
      return
    }
    
    setIsConnecting(true)
    setErrorMsg('')
    try {
      if (otpType === 'password') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        
        if (data.session?.user) {
          localStorage.setItem('userEmail', data.session.user.email || '')
          localStorage.setItem('isLoggedIn', 'true')
          
          // Fetch role from DB (no .single() to avoid 406)
          const { data: usersResult } = await supabase.from('users').select('role, balance').eq('id', data.session.user.id)
          const dbUser = Array.isArray(usersResult) ? usersResult[0] : null
          let role = dbUser?.role || 'buyer'

          // Admin override by email
          if (data.session.user.email === 'perdhanariyan@gmail.com') {
            role = 'admin'
            await supabase.from('users').update({ role: 'admin' }).eq('id', data.session.user.id)
          }

          localStorage.setItem('walletBalance', String(dbUser?.balance || 0))
          localStorage.setItem('userRole', role)
          
          // Sync store properties (only for seller/admin)
          if (role === 'seller' || role === 'admin') {
            const { data: spResult } = await supabase.from('seller_profiles').select('id').eq('user_id', data.session.user.id)
            const sellerProfile = Array.isArray(spResult) ? spResult[0] : null
            if (sellerProfile) {
              const { data: storeResult } = await supabase.from('stores').select('name, slug').eq('seller_id', sellerProfile.id)
              const store = Array.isArray(storeResult) ? storeResult[0] : null
              if (store) {
                localStorage.setItem('storeName', store.name)
                localStorage.setItem('storeSlug', store.slug)
              }
            }
          }
          
          window.dispatchEvent(new Event('storage'))
          toast.success('Berhasil masuk. Selamat datang kembali di MarketDigi.')
          router.push('/profile?loginSuccess=true')
        }
      } else {
        // Fallback simulated logins for OTP Telegram & WhatsApp
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('userRole', 'buyer')
        window.dispatchEvent(new Event('storage'))
        toast.success(`Berhasil masuk via OTP ${otpType === 'telegram' ? 'Telegram' : 'WhatsApp'}!`)
        router.push('/profile?loginSuccess=true')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.')
      toast.error('Masuk Gagal')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleSendOTP = (type: 'telegram' | 'whatsapp') => {
    setOtpType(type)
    setOtpSent(true)
    setErrorMsg('')
    toast.success(`💬 Kode OTP berhasil dikirimkan ke nomor ${type === 'telegram' ? 'Telegram' : 'WhatsApp'} Anda!`)
  }

  // 2. Google Login Handlers
  const handleGoogleLogin = async () => {
    setErrorMsg('')
    try {
      setIsConnecting(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      })
      if (error) throw error
    } catch (err: any) {
      console.error('Google OAuth error:', err)
      toast.error('Gagal menghubungkan ke Google: ' + err.message)
      setIsConnecting(false)
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
          <h3 style={{ color: '#fff', fontWeight: 'bold' }}>Mengamankan Sesi Masuk Anda...</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Mohon tunggu sebentar.</p>
        </div>
      )}

      <div className="glass-panel card-3d" style={{ width: '460px', maxWidth: '100%', padding: '2.5rem', background: 'var(--bg-secondary)' }}>
        
        {/* STEP 1: Enter Normal Email */}
        {step === 'email-step-1' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 className="text-gradient" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Masuk Akun</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Akses pembelian instan dan kelola layanan digital Anda.</p>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid var(--danger)' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <Input 
                  label="Alamat Email" 
                  placeholder="contoh@email.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginBottom: '1.5rem' }} className="btn-3d">
                Lanjutkan
              </Button>
            </form>

            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '1.5rem' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-secondary)', padding: '0 0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ATAU MASUK DENGAN</span>
            </div>

            {/* Google Login Trigger */}
            <button 
              type="button"
              onClick={handleGoogleLogin}
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
                marginBottom: '1rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              {/* Google multicolored G SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.18-5.12 4.18-3.324 0-6.024-2.7-6.024-6.024s2.7-6.024 6.024-6.024c1.472 0 2.82.533 3.86 1.41l3.078-3.078C18.995 2.84 15.827 1.5 12.24 1.5 6.442 1.5 1.74 6.2 1.74 12s4.702 10.5 10.5 10.5c5.798 0 10.5-4.7 10.5-10.5 0-.665-.084-1.309-.224-1.925H12.24z"/>
                <path fill="#4285f4" d="M22.516 10.075H12.24v4.325h6.887a7.228 7.228 0 0 1-3.111 4.74l3.175 3.175c4.71-4.325 7.42-10.7 7.42-10.7a11.162 11.162 0 0 0-.226-1.54z"/>
                <path fill="#fbbc05" d="M5.716 7.467A6.026 6.026 0 0 1 12.24 5.952c1.472 0 2.82.533 3.86 1.41l3.078-3.078A10.457 10.457 0 0 0 12.24 1.5c-4.488 0-8.326 2.808-9.878 6.786l3.354-.819z"/>
                <path fill="#34a853" d="M2.362 8.286l3.354.819C6.467 7.467 8.243 5.952 12.24 5.952c1.472 0 2.82.533 3.86 1.41l3.078-3.078A10.457 10.457 0 0 0 12.24 1.5c-4.488 0-8.326 2.808-9.878 6.786l3.354-.819z"/>
              </svg>
              Masuk dengan Google
            </button>

            {/* Other OTP logins */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button 
                type="button"
                onClick={() => handleSendOTP('telegram')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ✈️ Telegram
              </button>
              <button 
                type="button"
                onClick={() => handleSendOTP('whatsapp')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
              >
                💬 WhatsApp
              </button>
            </div>
          </>
        )}

        {/* STEP 2: Password / OTP Verification */}
        {step === 'email-step-2' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email: <strong>{email}</strong></span>
                <button type="button" onClick={() => { setStep('email-step-1'); setOtpSent(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Ubah</button>
              </div>

              {otpType === 'password' ? (
                <Input 
                  label="Kata Sandi" 
                  placeholder="Masukkan kata sandi Anda" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              ) : (
                <div>
                  <Input 
                    label="Kode Verifikasi (OTP)" 
                    placeholder="Masukkan 6 digit kode OTP" 
                    type="text"
                    maxLength={6}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>
                    {otpSent ? 'Kode OTP dikirim. Tidak menerimanya? ' : ''}
                    <button type="button" onClick={() => handleSendOTP(otpType)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 600 }}>Kirim Ulang</button>
                  </span>
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginBottom: '1.5rem' }} className="btn-3d">
              Masuk Akun
            </Button>
            
            {otpType === 'password' && (
              <div style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <Link href="#" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Lupa Kata Sandi?</Link>
              </div>
            )}
          </form>
        )}

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          Belum punya akun? <Link href="/register" style={{ color: 'var(--accent-color)', fontWeight: 800 }}>Daftar Disini</Link>
        </div>
      </div>
    </div>
  )
}
