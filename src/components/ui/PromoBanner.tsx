"use client";

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  
  // Coordinates for touch/swipe control
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    { src: '/marketdigibanner1.png', alt: 'Semua Kebutuhan Digital Satu Tempat' },
    { src: '/banner2.png', alt: 'Promo Terpercaya Marketdigi' },
    { src: '/banner3.png', alt: 'Promo Spesial Marketdigi' }
  ];

  useEffect(() => {
    function shouldShowMainBanner() {
      if (pathname === "/") return true;
      if (pathname === "/products") return true;
      if (pathname.startsWith("/kategori")) return true;
      return false;
    }

    setIsVisible(shouldShowMainBanner());
  }, [pathname]);

  // Auto-swipe every 4 seconds, pause on hover for better readability
  useEffect(() => {
    if (!isVisible || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible, isHovered]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex(prev => (prev + 1) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!isVisible) return null;

  return (
    <div style={{ background: 'var(--bg-primary)', padding: '1.5rem 0' }}>
      <div className="container" style={{ position: 'relative' }}>
        {/* Scoped CSS Inject for layout, responsive sizing, and interactive transitions */}
        <style dangerouslySetInnerHTML={{ __html: `
          .banner-slider-container {
            position: relative;
            width: 100%;
            border-radius: var(--radius-xl);
            overflow: hidden;
            box-shadow: var(--shadow-lg);
            background: linear-gradient(135deg, #090e1a, #0b1528);
            border: 1px solid rgba(255, 255, 255, 0.08);
            /* Adaptive aspect ratio: taller on mobile to fit content, 3:1 on desktop */
            aspect-ratio: var(--banner-ratio-mobile, 2.3 / 1);
            transition: aspect-ratio 0.4s ease, transform 0.4s var(--transition-bounce), box-shadow 0.4s;
          }
          
          @media (min-width: 640px) {
            .banner-slider-container {
              aspect-ratio: var(--banner-ratio-tablet, 2.6 / 1);
            }
          }
          
          @media (min-width: 992px) {
            .banner-slider-container {
              aspect-ratio: var(--banner-ratio-desktop, 3 / 1);
            }
          }
          
          .banner-slider-container:hover {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18), var(--shadow-glow);
            transform: scale(1.003);
          }
          
          .nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease, background 0.2s, transform 0.2s;
            z-index: 15;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          }
          
          .banner-slider-container:hover .nav-arrow {
            opacity: 1;
          }
          
          .nav-arrow:hover {
            background: var(--accent-color);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-50%) scale(1.08);
          }
          
          .nav-arrow:active {
            transform: translateY(-50%) scale(0.92);
          }
          
          .nav-arrow.prev {
            left: 1.25rem;
          }
          
          .nav-arrow.next {
            right: 1.25rem;
          }
          
          .dots-container {
            position: absolute;
            bottom: 1.25rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.6rem;
            z-index: 15;
            background: rgba(15, 23, 42, 0.35);
            padding: 0.4rem 0.8rem;
            border-radius: var(--radius-full);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }
          
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            border: none;
            cursor: pointer;
            padding: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .dot.active {
            width: 24px;
            background: white;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          }
          
          .slide-link {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
            pointer-events: none;
          }
          
          .slide-link.active {
            pointer-events: auto;
          }
          
          .slide-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 6s ease-out;
          }
          
          .slide-link.active .slide-image {
            transform: scale(1.015);
          }
          
          /* Show arrows on touch devices implicitly without hover */
          @media (max-width: 768px) {
            .nav-arrow {
              opacity: 0.7;
              width: 38px;
              height: 38px;
            }
            .nav-arrow.prev { left: 0.75rem; }
            .nav-arrow.next { right: 0.75rem; }
          }
        ` }} />

        <div 
          className="banner-slider-container"
          style={{
            ['--banner-ratio-mobile' as any]: activeIndex === 2 ? '1916 / 821' : '2.3 / 1',
            ['--banner-ratio-tablet' as any]: activeIndex === 2 ? '1916 / 821' : '2.6 / 1',
            ['--banner-ratio-desktop' as any]: activeIndex === 2 ? '1916 / 821' : '3 / 1',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <Link 
                key={index}
                className={`slide-link ${isActive ? 'active' : ''}`}
                href="/products" 
                style={{ 
                  opacity: isActive ? 1 : 0,
                  zIndex: isActive ? 2 : 1,
                }}
              >
                <img 
                  src={slide.src} 
                  alt={slide.alt} 
                  className="slide-image"
                />
              </Link>
            );
          })}
          
          {/* Navigation Arrows */}
          <button 
            className="nav-arrow prev"
            onClick={handlePrev}
            aria-label="Previous Slide"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button 
            className="nav-arrow next"
            onClick={handleNext}
            aria-label="Next Slide"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          {/* Navigation Dots */}
          <div className="dots-container">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
                className={`dot ${activeIndex === index ? 'active' : ''}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

