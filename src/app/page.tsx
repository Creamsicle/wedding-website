'use client';

import Image from 'next/image';
import SiteHeader from '@/components/layout/SiteHeader';
import React, { useState, useEffect } from 'react';

export default function HomePage() {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 769);
    };
    handleResize();
  }, []);

  return (
    <div className="mobile-gallery-container">
      <SiteHeader />

      <main className="gallery-main gallery-main-home">
        <div className="artwork-display artwork-display-home">
          {isMobileView ? (
            <Image src="/images/Lights2.png" alt="Gallery lights mobile" width={1000} height={100} className="lights-image" />
          ) : (
            <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" />
          )}
          
          <div className="home-content-block frame-and-plaque-container w-full max-w-[75%] md:max-w-[340px] lg:max-w-[650px] mx-auto">
            <div className="hero-image-container w-full mb-0 relative">
              <Image 
                src="/images/Hero-Frame0.png" 
                alt="Artwork frame with photo" 
                fill 
                sizes="100vw" 
                className="artwork-frame"
              />
            </div>
            <div className="home-plaque-wrapper flex justify-center">
              <Image src="/images/hero-plaque1.png" alt="Artwork plaque" width={300} height={100} className="plaque-image-home" />
            </div>
          </div>

        </div>
        <div className="bench-container">
          <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
        </div>
      </main>
    </div>
  );
} 