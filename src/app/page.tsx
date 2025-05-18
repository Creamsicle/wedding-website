'use client';

import Image from 'next/image';
import SiteHeader from '@/components/layout/SiteHeader';

export default function HomePage() {
  return (
    <div className="mobile-gallery-container">
      <SiteHeader />

      <main className="gallery-main">
        <div className="artwork-display">
          <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" />
          <div className="framed-artwork">
            <Image src="/images/Hero-Frame.png" alt="Artwork frame with photo" width={600} height={900} className="artwork-frame" />
          </div>
          <Image src="/images/hero-plaque.png" alt="Artwork plaque" width={300} height={100} className="plaque-image" />
        </div>
        <div className="bench-container">
          <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
        </div>
      </main>
    </div>
  );
} 