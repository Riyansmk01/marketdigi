import React from 'react'

export const metadata = {
  title: 'Kebijakan Privasi',
}

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh', maxWidth: '800px' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Kebijakan Privasi</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Terakhir diperbarui: 12 Juni 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
        
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>1. Data Sensitif Yang Kami Kumpulkan</h2>
          <p>
            Untuk memfasilitasi transaksi digital dan menjaga keamanan platform dari tindakan fraud, kami mengumpulkan data sensitif seperti alamat email akun, nomor WhatsApp aktif (untuk verifikasi OTP seller), username Telegram (untuk penanganan sengketa cepat), dan logs alamat IP ketika melakukan transaksi pembayaran.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>2. Penggunaan Data Untuk Fraud & Audit</h2>
          <p>
            Segala data transaksi, riwayat komplain, dan screenshot bukti kegagalan produk yang dikirimkan melalui tiket bantuan akan kami simpan secara terenkripsi. Data ini digunakan secara internal untuk audit transaksi berkala, melacak reputasi seller, mendeteksi penyalahgunaan lisensi (sharing ilegal), serta kepatuhan hukum transaksi digital Indonesia.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>3. Retensi & Penghapusan Data</h2>
          <p>
            Kami menahan informasi akun dan data pembelian digital Anda selama akun Anda aktif di sistem kami untuk memastikan Anda dapat mengakses kembali lisensi/akun digital yang telah Anda beli kapan saja. Jika Anda mengajukan penghapusan akun, data PII (Personally Identifiable Information) akan dibersihkan dalam waktu 30 hari kerja, kecuali data audit transaksi yang harus disimpan sesuai regulasi keuangan nasional.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>4. Keamanan & Enkripsi</h2>
          <p>
            Seluruh data autentikasi dan API key seller yang digenerate dalam platform akan dienkripsi dengan standar industri tinggi menggunakan algoritma hashing modern. Pihak luar ataupun admin internal kami tidak memiliki visibilitas langsung terhadap isi kata sandi mentah Anda demi keamanan penuh akun Anda.
          </p>
        </section>

      </div>
    </div>
  )
}
