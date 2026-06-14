"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';


export function Popup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Prevent showing popup if it was closed recently
    const popupClosedAt = localStorage.getItem("marketdigi_popup_closed_at");
    if (popupClosedAt) {
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - Number(popupClosedAt) <= threeDays) {
        return;
      }
    }

    let timer: NodeJS.Timeout;

    const handleScroll = () => {
      // Calculate scroll percentage
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      if (scrolled >= 40 && !isVisible) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      }
    };

    // Trigger after 8 seconds idle
    timer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
        window.removeEventListener('scroll', handleScroll);
      }
    }, 8000);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("marketdigi_popup_closed_at", Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content glass-panel">
        <button className="popup-close" onClick={handleClose} aria-label="Tutup">
          &times;
        </button>
        <h3 className="popup-title">Dapatkan produk digital terbaik hari ini!</h3>
        <p className="popup-desc">Semua kebutuhan digital dalam satu tempat dengan proses instan.</p>
        <Link href="/kategori">
          <Button variant="primary" style={{ width: '100%' }} onClick={handleClose}>
            Lihat Produk
          </Button>
        </Link>
      </div>
    </div>
  );
}
