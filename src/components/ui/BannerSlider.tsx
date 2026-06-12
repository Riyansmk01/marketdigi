"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './BannerSlider.css';

interface BannerSliderProps {
  images: { src: string; alt: string; href: string }[];
}

export function BannerSlider({ images }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="banner-slider">
      <div className="banner-slider-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((img, index) => (
          <div key={index} className="banner-slide">
            <Link href={img.href}>
              <img src={img.src} alt={img.alt} className="banner-image" />
            </Link>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button className="slider-btn prev-btn" onClick={prevSlide} aria-label="Previous slide">
            &#10094;
          </button>
          <button className="slider-btn next-btn" onClick={nextSlide} aria-label="Next slide">
            &#10095;
          </button>
          
          <div className="slider-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
