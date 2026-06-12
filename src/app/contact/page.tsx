'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

function ContactForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [invoice, setInvoice] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileUploaded, setFileUploaded] = useState<string | null>(null)

  useEffect(() => {
    const defaultInvoice = searchParams.get('invoice')
    if (defaultInvoice) {
      setInvoice(defaultInvoice)
    }

    const userEmail = localStorage.getItem('userEmail')
    if (userEmail) {
      setEmail(userEmail)
    }
  }, [searchParams])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.')
        return
      }
      setFileUploaded(file.name)
      toast.success('Bukti kendala terpilih.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate sending dispute/ticket
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(`📩 Tiket Pengaduan Berhasil Terkirim! Invoice: ${invoice || 'Umum'}. Tim Support kami akan segera membalas via WhatsApp ${whatsappPhone} atau email ${email}.`)
      // Reset form
      setMessage('')
      setFileUploaded(null)
    }, 1500)
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Support Channels & General Info */}
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Hubungi Dukungan</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            Ada kendala transaksi, pembayaran tidak terverifikasi, atau ingin klaim garansi Trade Guard? Kirim laporan Anda di sini atau hubungi kami langsung lewat WhatsApp atau Email untuk respon instan.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* WhatsApp Support */}
            <div className="glass-panel card-3d" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', width: '55px', height: '55px', background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                💬
              </div>
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>WhatsApp Dukungan Resmi</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Hubungi kami langsung melalui WhatsApp untuk respon cepat.</p>
                <a href="https://wa.me/6285378963269" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Hubungi 085378963269 ➔
                </a>
              </div>
            </div>

            {/* Email Channel */}
            <div className="glass-panel card-3d" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', width: '55px', height: '55px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                📩
              </div>
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>E-mail Support Resmi</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Untuk pertanyaan bisnis, partnership, atau kendala serius.</p>
                <a href="mailto:infomahasi@gmail.com" style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  infomahasi@gmail.com ➔
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Dispute Form */}
        <div className="glass-panel card-3d" style={{ padding: '2.5rem', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>Buat Tiket Laporan</h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input 
              label="Alamat Email Akun" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              required 
            />

            <Input 
              label="Nomor Invoice (Opsional)" 
              type="text" 
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              placeholder="INV-2026XXXX-XXXX" 
            />

            <Input 
              label="Nomor WhatsApp Anda (Untuk Hubungi Balik)" 
              type="text" 
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              placeholder="Contoh: 0812XXXXXXXX" 
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kronologi Kendala</label>
              <textarea 
                rows={4} 
                className="input-field" 
                placeholder="Jelaskan secara rinci kendala transaksi atau kegagalan lisensi produk Anda..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                required
              />
            </div>

            {/* Simulated file upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Screenshot Bukti Kendala (Opsional)</label>
              <div style={{ border: '2px dashed var(--glass-border-hover)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', background: 'var(--bg-primary)', position: 'relative', cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                />
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📁</span>
                {fileUploaded ? (
                  <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>✓ {fileUploaded} Terpilih</span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Klik atau seret file gambar screenshot di sini</span>
                )}
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="btn-3d" style={{ marginTop: '1rem' }}>
              {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Tiket Pengaduan'}
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1.5rem' }}>Memuat Halaman...</div>}>
      <ContactForm />
    </Suspense>
  )
}
