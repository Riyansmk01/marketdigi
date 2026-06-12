export type FulfillmentType = 'Akun Digital' | 'Link Akses' | 'OTP Service' | 'Pre-Order' | 'Produk digital legal';

export interface Seller {
  id: string;
  name: string;
  slug: string;
  ratingAvg: number;
  reviewCount: number;
  lastActive?: string;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  displayPrice: string;
  badge?: 'Ready' | 'Promo' | 'Terlaris' | 'Habis';
  fulfillmentType: FulfillmentType;
  seller: Seller;
  slug: string;
  thumbnailUrl?: string;
  ratingAvg?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: string;
  note?: string;
  customFields?: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
}
