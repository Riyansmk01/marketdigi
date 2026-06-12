import Link from 'next/link'

export const metadata = {
  title: 'Kategori Produk',
}

export default function KategoriPage() {
  const categories = [
    { name: 'Akun Streaming', type: 'video', src: '/streamshop.mp4', desc: 'Netflix, Spotify, Disney+', count: 1250 },
    { name: 'Software & OS', type: 'video', src: '/SOAS.mp4', desc: 'Windows, Office, Antivirus', count: 850 },
    { name: 'Top Up Game', type: 'video', src: '/topupgame.mp4', desc: 'MLBB, PUBG, Valorant', count: 4500 },
    { name: 'Voucher Digital', type: 'video', src: '/voucher.mp4', desc: 'Google Play, Spotify, E-Wallet', count: 1800 },
    { name: 'Jasa Freelance', type: 'video', src: '/jasa.mp4', desc: 'Logo, Copywriting, SEO', count: 2100 },
    { name: 'Template Desain', type: 'image', src: '/template-desain.png', desc: 'Figma, Canva, PPT', count: 3200 },
    { name: 'Layanan AI', type: 'image', src: '/layanan-ai.png', desc: 'ChatGPT Plus, Midjourney', count: 620 },
    { name: 'Web & Hosting', type: 'image', src: '/web-hosting.png', desc: 'Domain, VPS, Script', count: 1100 }
  ];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>Kategori Lengkap</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
        Jelajahi semua produk digital yang tersedia berdasarkan kategori spesifik.
      </p>

      <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
        {categories.map((cat, idx) => (
          <Link href={`/products?category=${cat.name}`} key={idx} className="glass-panel card-3d" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
            <div style={{ height: '100px', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              {cat.type === 'video' ? (
                <video src={cat.src} autoPlay loop muted playsInline style={{ height: '120%', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'contrast(1.1)' }} />
              ) : (
                <img src={cat.src} alt={cat.name} style={{ height: '120%', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'contrast(1.1)' }} />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cat.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{cat.desc}</p>
            </div>
            <div className="badge badge-default" style={{ marginTop: 'auto' }}>{cat.count} Produk</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
