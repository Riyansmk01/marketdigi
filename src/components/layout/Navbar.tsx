'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';


export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('buyer');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchVal, setSearchVal] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkAuth = () => {
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(logged);
    if (logged) {
      setEmail(localStorage.getItem('userEmail') || 'user@marketdigi.me');
      setRole(localStorage.getItem('userRole') || 'buyer');
    }
  };

  const checkNotifications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: dbNotifications } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (dbNotifications) {
          setNotifications(dbNotifications);
          setUnreadCount(dbNotifications.filter((n: any) => !n.is_read).length);
        }
      }
    } catch (err) {
      console.error('Navbar error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      checkNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', session.user.id);
        checkNotifications();
        toast.success('Semua notifikasi ditandai telah dibaca.');
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    checkAuth();
    checkNotifications();

    // Listen to Supabase Auth state changes and sync to localStorage
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        localStorage.setItem('userEmail', session.user.email || '');
        localStorage.setItem('isLoggedIn', 'true');
        
        // Fetch database-backed profile role
        let userRole = 'buyer';
        if (session.user.email === 'perdhanariyan@gmail.com') {
          userRole = 'admin';
        } else {
          try {
            const { data: usersResult } = await supabase.from('users').select('role, balance').eq('id', session.user.id);
            const dbUser = Array.isArray(usersResult) ? usersResult[0] : usersResult;
            if (dbUser) {
              userRole = dbUser.role || 'buyer';
              localStorage.setItem('walletBalance', String(dbUser.balance || 0));
            }
          } catch (err) {
            // Non-critical; silently ignore
          }
        }
        localStorage.setItem('userRole', userRole);

        // Only fetch seller store data if user is seller or admin
        if (userRole === 'seller' || userRole === 'admin') {
          try {
            const { data: spResult } = await supabase.from('seller_profiles').select('id, whatsapp_number').eq('user_id', session.user.id);
            const sellerProfile = Array.isArray(spResult) ? spResult[0] : null;
            if (sellerProfile) {
              if (sellerProfile.whatsapp_number) {
                localStorage.setItem('storePhone', sellerProfile.whatsapp_number);
              }
              const { data: storeResult } = await supabase.from('stores').select('name, slug').eq('seller_id', sellerProfile.id);
              const store = Array.isArray(storeResult) ? storeResult[0] : null;
              if (store) {
                localStorage.setItem('storeName', store.name);
                localStorage.setItem('storeSlug', store.slug);
              }
            }
          } catch (err) {
            // Non-critical; silently ignore
          }
        }
        checkAuth();
        checkNotifications();
      }
    });

    const onStorageChange = () => {
      checkAuth();
      checkNotifications();
    };

    window.addEventListener('storage', onStorageChange);
    // Periodically poll auth and notifications for instantaneous reactivity
    const interval = setInterval(() => {
      checkAuth();
      checkNotifications();
    }, 5000);
    return () => {
      window.removeEventListener('storage', onStorageChange);
      clearInterval(interval);
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out from Supabase:', err);
    }
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('storeName');
    localStorage.removeItem('storeSlug');
    localStorage.removeItem('storePhone');
    localStorage.removeItem('walletBalance');
    setIsLoggedIn(false);
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    toast.success('Anda telah keluar dari akun.');
    router.push('/login');
  };

  return (
    <nav className="navbar-container">
      <div className="container navbar-content">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
          <img 
            src="/marketdigilogo.png" 
            alt={siteConfig.name} 
            className="logo-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const textNode = e.currentTarget.nextSibling as HTMLElement;
              if (textNode) textNode.style.display = 'block';
            }}
          />
          <span className="logo text-gradient" style={{ display: 'none', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.05em' }}>
            {siteConfig.name}
          </span>
        </Link>
        
        {/* Search Bar for Desktop */}
        <form onSubmit={handleSearchSubmit} className="search-bar-desktop">
          <input 
            type="text" 
            placeholder="Cari akun, link akses, OTP..." 
            className="search-input" 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <Button type="submit" variant="primary" style={{ borderRadius: '999px', padding: '0.5rem 1rem' }}>Cari</Button>
        </form>

        {/* Navigation Links (Desktop) */}
        <div className="nav-links-desktop">
          {siteConfig.mainNav.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button variant="secondary" size="sm">{item.title}</Button>
            </Link>
          ))}
          <Link href="/cart">
            <Button variant="secondary" size="sm">🛒 Keranjang</Button>
          </Link>
          
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
              {/* Bell Icon Notification for Desktop */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => { setShowNotifDropdown(!showNotifDropdown); setShowDropdown(false); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                  className="btn-ghost"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'var(--danger)',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div 
                    className="glass-panel" 
                    style={{ 
                      position: 'absolute', 
                      top: '140%', 
                      right: 0, 
                      width: '320px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '0.75rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.5rem',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 100
                    }}
                    onMouseLeave={() => setShowNotifDropdown(false)}
                  >
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.9rem' }}>🔔 Notifikasi Terbaru</strong>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Tandai semua dibaca</button>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '250px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>Belum ada notifikasi baru.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleMarkAsRead(notif.id)}
                            style={{ 
                              padding: '0.6rem', 
                              borderRadius: 'var(--radius-sm)', 
                              background: notif.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.06)', 
                              borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: notif.is_read ? '600' : '800', color: notif.is_read ? 'var(--text-primary)' : 'var(--accent-color)' }}>{notif.title}</span>
                              {!notif.is_read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)' }} />}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{notif.message}</p>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7, marginTop: '0.2rem', display: 'block' }}>{new Date(notif.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => { setShowDropdown(!showDropdown); setShowNotifDropdown(false); }}
                  style={{ 
                    background: 'linear-gradient(135deg, var(--accent-color), #818cf8)', 
                    color: 'white', 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    border: 'none', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(99,102,241,0.2)'
                  }}
                >
                  {email.substring(0, 2).toUpperCase()}
                </button>
                
                {showDropdown && (
                  <div 
                    className="glass-panel" 
                    style={{ 
                      position: 'absolute', 
                      top: '120%', 
                      right: 0, 
                      width: '220px', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '0.75rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.25rem',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 100
                    }}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '0.5rem', overflow: 'hidden' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Email Masuk</span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{email}</strong>
                    </div>
                    <Link href="/profile" onClick={() => setShowDropdown(false)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>👤 Profil Saya</Link>
                    <Link href="/riwayat-pesanan" onClick={() => setShowDropdown(false)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>📦 Pesanan Saya</Link>
                    <Link href="/wishlist" onClick={() => setShowDropdown(false)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>❤️ Wishlist Saya</Link>
                    <Link href="/pesan" onClick={() => setShowDropdown(false)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>💬 Percakapan</Link>
                    <Link href="/ulasan" onClick={() => setShowDropdown(false)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>✍️ Ulasan Produk</Link>
                    <Link href="/settings" onClick={() => setShowDropdown(false)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'block', fontWeight: 600 }}>⚙️ Pengaturan</Link>
                    {(role === 'seller' || role === 'admin') && (
                      <Link href="/dashboard" onClick={() => setShowDropdown(false)} style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', display: 'block', fontWeight: 'bold', color: 'var(--accent-color)' }}>💼 Seller Center</Link>
                    )}
                    <button 
                      onClick={handleLogout} 
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '0.5rem', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--danger)', 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        borderTop: '1px solid var(--glass-border)',
                        marginTop: '0.5rem',
                        paddingTop: '0.5rem'
                      }}
                    >
                      🚪 Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Daftar</Button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <button 
          className="hamburger-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu Drawer Dropdown */}
        <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mobile-search-bar" style={{ display: 'flex' }}>
            <input 
              type="text" 
              placeholder="Cari produk digital..." 
              className="search-input" 
              style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none' }} 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <Button type="submit" variant="primary" size="sm" style={{ borderRadius: '999px', padding: '0.4rem 0.8rem' }}>Cari</Button>
          </form>

          <div className="mobile-links">
            {siteConfig.mainNav.map((item, index) => (
              <Link key={index} href={item.href} className="mobile-link-item" onClick={() => setIsMobileMenuOpen(false)}>
                {item.title}
              </Link>
            ))}
            <Link href="/cart" className="mobile-link-item" onClick={() => setIsMobileMenuOpen(false)}>
              🛒 Keranjang Belanja
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/profile" className="mobile-link-item" onClick={() => setIsMobileMenuOpen(false)}>👤 Profil Saya</Link>
                <Link href="/riwayat-pesanan" className="mobile-link-item" onClick={() => setIsMobileMenuOpen(false)}>📦 Pesanan Saya</Link>
                <Link href="/wishlist" className="mobile-link-item" onClick={() => setIsMobileMenuOpen(false)}>❤️ Wishlist Saya</Link>
                <Link href="/pesan" className="mobile-link-item" onClick={() => setIsMobileMenuOpen(false)}>💬 Chat Percakapan</Link>
                
                {/* Mobile Notification Accordion */}
                <div className="mobile-link-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <button 
                    onClick={() => {
                      setShowNotifDropdown(!showNotifDropdown);
                    }} 
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', font: 'inherit', padding: 0, width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <span>🔔 Notifikasi Terbaru {unreadCount > 0 && `(${unreadCount})`}</span>
                    <span>{showNotifDropdown ? '▲' : '▼'}</span>
                  </button>
                  {showNotifDropdown && (
                    <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer', marginBottom: '0.25rem' }}>Tandai semua dibaca</button>
                      )}
                      {notifications.length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>Belum ada notifikasi baru.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setIsMobileMenuOpen(false);
                            }}
                            style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.02)', cursor: 'pointer' }}
                          >
                            <div style={{ fontSize: '0.85rem', fontWeight: notif.is_read ? 'normal' : 'bold', color: notif.is_read ? 'var(--text-primary)' : 'var(--accent-color)' }}>{notif.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{notif.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {(role === 'seller' || role === 'admin') && (
                  <Link href="/dashboard" className="mobile-link-item" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>💼 Seller Center</Link>
                )}
              </>
            )}
          </div>

          <div className="mobile-actions">
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="secondary" style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger)' }}>🚪 Keluar Akun</Button>
            ) : (
              <>
                <Link href="/login" style={{ flex: 1 }} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" style={{ width: '100%' }}>Masuk</Button>
                </Link>
                <Link href="/register" style={{ flex: 1 }} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" style={{ width: '100%' }}>Daftar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
