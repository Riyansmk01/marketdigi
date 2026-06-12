'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface FAQItem {
  q: string
  a: string
  cat: string
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  const faqs: FAQItem[] = [
    {
      q: 'Bagaimana cara mendapatkan produk digital setelah pembayaran?',
      a: 'Setelah pembayaran diverifikasi secara instan oleh sistem, kode lisensi, akun digital, atau link akses Anda akan langsung terkirim dan muncul di tab "Riwayat Pesanan" dan halaman Detail Transaksi Anda. Tidak ada waktu tunggu.',
      cat: 'Transaksi'
    },
    {
      q: 'Apakah semua transaksi dilindungi Trade Guard?',
      a: 'Ya, seluruh transaksi di platform Marketdigi dilindungi oleh sistem Trade Guard selama 30 hari. Dana Anda akan ditahan oleh sistem escrow kami dan baru diteruskan ke penjual setelah Anda mengonfirmasi produk berfungsi dengan baik.',
      cat: 'Transaksi'
    },
    {
      q: 'Bagaimana cara mendaftar sebagai seller?',
      a: 'Anda bisa mengklik tombol "Buka Toko" di navigasi footer atau langsung mengakses rute pendaftaran dengan role seller. Masukkan email, kata sandi, nama toko, slug toko, dan nomor WhatsApp aktif Anda untuk verifikasi instan.',
      cat: 'Akun'
    },
    {
      q: 'Apa itu status "Garansi Aktif"?',
      a: 'Status ini menandakan produk digital yang Anda beli memiliki perlindungan garansi dari penjual. Jika produk mengalami kendala (misal: akun terkena premium lock atau lisensi tidak bisa diaktifkan), Anda berhak mengajukan klaim garansi atau komplain.',
      cat: 'Garansi & Refund'
    },
    {
      q: 'Bagaimana cara mengajukan komplain pesanan?',
      a: 'Buka menu "Riwayat Pesanan", temukan transaksi yang bermasalah, lalu klik tombol "Ajukan Komplain". Sistem Trade Guard akan menahan pencairan dana ke penjual dan mengundang moderator kami untuk menengahi sengketa.',
      cat: 'Garansi & Refund'
    },
    {
      q: 'Bagaimana cara mengintegrasikan pengiriman otomatis API?',
      a: 'Sebagai seller, Anda dapat masuk ke "Pengaturan Akun" -> "Mode Pengembang (API)" lalu men-generate API key Anda. Gunakan key ini untuk memicu webhook otomatis yang mengirim kredensial produk ke pembeli saat pembayaran sukses.',
      cat: 'API Integrasi'
    }
  ]

  const categories = ['Semua', 'Transaksi', 'Akun', 'Garansi & Refund', 'API Integrasi']

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = activeCategory === 'Semua' || faq.cat === activeCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      {/* Hero section */}
      <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--bg-secondary), rgba(99, 102, 241, 0.08))', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>Pusat Bantuan</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>Cari solusi kendala transaksi digital atau panduan penggunaan platform Anda.</p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '0.3rem 0.5rem 0.3rem 1.5rem', borderRadius: '999px', boxShadow: 'var(--shadow-md)' }}>
          <input 
            type="text" 
            placeholder="Ketik pertanyaan Anda di sini..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontSize: '1rem' }}
          />
          <Button variant="primary" style={{ borderRadius: '999px', padding: '0.6rem 1.5rem' }} className="btn-3d">Cari</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem', alignItems: 'flex-start' }}>
        {/* Left Side: Filter Categories */}
        <aside>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Topik Bantuan</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.6rem 1rem',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: activeCategory === cat ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    color: activeCategory === cat ? 'var(--accent-color)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Side: FAQs */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Pertanyaan Populer</h2>
          
          {filteredFaqs.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              😔 Tidak ditemukan solusi untuk pencarian Anda. Silakan hubungi tim dukungan kami.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="glass-panel card-3d" style={{ padding: '1.5rem 2rem', background: 'var(--bg-secondary)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    ❓ {faq.q}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                    {faq.a}
                  </p>
                  <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Tag: {faq.cat}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Contact Support CTA */}
          <div className="glass-panel card-3d" style={{ padding: '2rem', background: 'rgba(99, 102, 241, 0.05)', marginTop: '4rem', textAlign: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Masih Mengalami Kendala?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Hubungi tim customer service kami yang aktif melayani kendala transaksi 24 jam sehari.</p>
            <Link href="/contact">
              <Button variant="primary" className="btn-3d" style={{ padding: '0.75rem 2rem' }}>Hubungi Customer Support</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
