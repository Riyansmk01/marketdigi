import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Function to generate abstract soft gradients and icons based on product names
function getProductTheme(title: string) {
  const lowercaseTitle = title.toLowerCase();
  
  if (lowercaseTitle.includes('netflix')) {
    return {
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #881337 100%)',
      icon: (
        <svg width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        </svg>
      )
    };
  }
  
  if (lowercaseTitle.includes('windows')) {
    return {
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #1e3a8a 100%)',
      icon: (
        <svg width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
        </svg>
      )
    };
  }
  
  if (lowercaseTitle.includes('canva')) {
    return {
      gradient: 'linear-gradient(135deg, #a855f7 0%, #581c87 100%)',
      icon: (
        <svg width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-2.22 1.184l-.872 1.192h11.124l-.872-1.192a3 3 0 00-2.22-1.184H9.53zM12 11.25a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM4.75 18h14.5M3 21h18" />
        </svg>
      )
    };
  }
  
  if (lowercaseTitle.includes('spotify')) {
    return {
      gradient: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
      icon: (
        <svg width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    };
  }
  
  // Default fallback for general digital items
  return {
    gradient: 'linear-gradient(135deg, #6366f1 0%, #312e81 100%)',
    icon: (
      <svg width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h19.5M9 3.75h6m-6 0l-1.5 5.25m7.5-5.25L16.5 9M8.25 9h7.5" />
      </svg>
    )
  };
}

// Function to generate dynamic-looking sold counts based on ID
function getSoldCount(id: string) {
  const num = parseInt(id) || 1;
  if (num === 2) return '1.2k+';
  if (num === 4) return '500+';
  return `${(num * 37 + 13) % 150 + 40}+`;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
  const theme = getProductTheme(product.title);
  
  return (
    <Link href={`/product/${product.id}`} className={`product-card ${className}`}>
      {/* Dynamic graphic thumbnail */}
      <div className="card-img-placeholder" style={{ background: theme.gradient }}>
        {product.thumbnailUrl ? (
          <img src={product.thumbnailUrl} alt={product.title} />
        ) : (
          theme.icon
        )}
      </div>
      
      <div className="card-content">
        {/* Soft badges */}
        <div className="card-badges">
          {product.badge === 'Ready' && <Badge variant="ready">{product.badge}</Badge>}
          {product.badge === 'Promo' && <Badge variant="promo">{product.badge}</Badge>}
          {product.badge === 'Terlaris' && <Badge variant="terlaris">{product.badge}</Badge>}
          {product.badge === 'Habis' && <Badge variant="default">{product.badge}</Badge>}
          {!product.badge && <Badge variant="default">Digital</Badge>}
        </div>
        
        <h3 className="card-title">{product.title}</h3>
        
        {/* Product rating and sales volume */}
        <div className="card-rating-sold">
          <span className="rating-star">⭐ {product.ratingAvg !== undefined && product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : '0.0'} ({product.reviewCount || 0})</span>
          <span className="divider">•</span>
          <span className="sold-count">Terjual {getSoldCount(product.id)}</span>
        </div>
        
        <div className="card-price">{product.displayPrice}</div>
        
        {/* Card Metadata info */}
        <div className="card-meta">
          <span className="seller-name">{product.seller.name}</span>
          <span className="divider">•</span>
          <span className="fulfillment-type">{product.fulfillmentType}</span>
        </div>

        {/* CTA Button */}
        <div className="card-cta">
          <span className="cta-button">Lihat Detail</span>
        </div>
      </div>
    </Link>
  );
}
