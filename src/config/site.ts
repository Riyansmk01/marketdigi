export const siteConfig = {
  name: "Marketdigi.me",
  description: "Marketplace produk digital nomor 1 dengan pengiriman instan, garansi aman, dan transaksi yang dilindungi oleh Trade Guard di Marketdigi.me.",
  url: "https://marketdigi.me",
  ogImage: "https://marketdigi.me/og.jpg",
  links: {
    twitter: "https://twitter.com/marketdigi",
    github: "https://github.com/marketdigi",
  },
  mainNav: [
    {
      title: "Semua Produk",
      href: "/products",
    },
    {
      title: "Flash Sale",
      href: "/flash-sale",
    },
    {
      title: "Kategori",
      href: "/kategori",
    },
  ],
  footerNav: [
    {
      title: "Eksplor",
      items: [
        { title: "Semua Produk", href: "/products" },
        { title: "Flash Sale", href: "/flash-sale" },
        { title: "Kategori", href: "/kategori" },
      ],
    },
    {
      title: "Bantuan",
      items: [
        { title: "Pusat Bantuan", href: "/help" },
        { title: "Syarat & Ketentuan", href: "/terms" },
        { title: "Privasi", href: "/privacy" },
      ],
    },
    {
      title: "Seller",
      items: [
        { title: "Buka Toko", href: "/register?role=seller" },
        { title: "Seller Center", href: "/dashboard" },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;
