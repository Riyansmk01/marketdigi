import React from 'react'

export const metadata = {
  title: 'Syarat & Ketentuan',
}

export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh', maxWidth: '800px' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Syarat & Ketentuan Layanan</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Terakhir diperbarui: 12 Juni 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>1. Akurasi Data Akun</h2>
          <p>
            Semua pengguna platform Marketdigi wajib menyediakan informasi pendaftaran yang akurat, mutakhir, dan lengkap. Segala kerugian yang diakibatkan oleh kesalahan pengisian nomor WhatsApp, Telegram, ataupun alamat email penerima lisensi berada di luar tanggung jawab kami.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>2. Sistem Escrow & Pembayaran</h2>
          <p>
            Marketdigi menggunakan sistem escrow (rekening bersama) bernama <strong>Trade Guard</strong>. Dana pembayaran pembeli akan ditahan oleh sistem selama masa garansi aktif dan tidak akan diteruskan ke saldo seller hingga pembeli mengonfirmasi keberhasilan produk, atau setelah masa perlindungan otomatis 30 hari berakhir tanpa ada komplain.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>3. Kebijakan Pencabutan Listing (Product Ban)</h2>
          <p>
            Tim moderator kami berhak membekukan, menangguhkan, atau menghapus listing produk digital dari etalase seller jika ditemukan bukti sengketa hak cipta, terindikasi produk ilegal/crack, memicu komplain berulang dari pembeli, atau melanggar kebijakan jenis produk yang diizinkan di platform Marketdigi.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>4. Penyelesaian Sengketa (Dispute Resolution)</h2>
          <p>
            Jika terjadi konflik antara pembeli dan penjual mengenai fungsionalitas produk digital (seperti lisensi mati atau akun terkunci), pembeli dapat mengajukan laporan melalui fitur <strong>Ajukan Komplain</strong>. Moderator Marketdigi akan bertindak sebagai penengah yang adil dan berhak membatalkan transaksi serta mencairkan dana kembali ke pembeli jika terbukti bersalah.
          </p>
        </section>

        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
          <strong>⚠️ PENTING UNTUK SELLER:</strong> Dengan mendaftar sebagai seller di platform Marketdigi, Anda setuju untuk menjaga tingkat responsibilitas chat pembeli di atas 80% dan mematuhi jaminan garansi produk digital yang Anda tawarkan.
        </div>

      </div>
    </div>
  )
}
