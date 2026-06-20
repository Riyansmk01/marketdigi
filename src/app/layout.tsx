import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { siteConfig } from '@/config/site'
import { PromoBanner } from '@/components/ui/PromoBanner'

export const metadata: Metadata = {
  metadataBase: new URL('https://marketdigi.me'),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "marketplace produk digital",
    "marketdigi",
    "marketdigi.me",
    "akun streaming murah",
    "netflix premium indonesia",
    "lisensi windows 11 pro original",
    "canva pro lifetime murah",
    "spotify premium family invite",
    "produk digital legal",
    "jasa digital indonesia"
  ],
  authors: [{ name: "Marketdigi.me Team" }],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Marketdigi.me - Marketplace Produk Digital Terpercaya",
      }
    ],
  },
  icons: {
    icon: '/marketdigilogo.png',
    shortcut: '/marketdigilogo.png',
    apple: '/marketdigilogo.png',
    other: [
      { rel: 'manifest', url: '/site.webmanifest' }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  other: {
    "geo.region": "ID",
    "geo.position": "-6.200000;106.816666",
    "ICBM": "-6.200000, 106.816666",
  }
}

import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <PromoBanner />
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" richColors toastOptions={{ style: { borderRadius: 'var(--radius-md)', fontFamily: 'inherit' } }} />
      </body>
    </html>
  )
}
