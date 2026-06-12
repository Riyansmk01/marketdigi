import React from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--glass-border)', padding: '4rem 0 2rem 0', marginTop: '4rem', background: 'var(--bg-secondary)' }}>
      <div className="container grid grid-cols-4">
        <div>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
            <img 
              src="/logosementara.png" 
              alt={siteConfig.name} 
              className="logo-img"
              style={{ height: '32px' }}
            />
          </Link>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{siteConfig.description}</p>
        </div>
        
        {siteConfig.footerNav.map((section, idx) => (
          <div key={idx}>
            <h4 style={{ marginBottom: '1.25rem', fontWeight: 600 }}>{section.title}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link href={item.href} style={{ transition: 'color 0.2s' }}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} {siteConfig.name} Hak Cipta Dilindungi.
      </div>
    </footer>
  );
}
