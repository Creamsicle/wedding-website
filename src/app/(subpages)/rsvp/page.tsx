'use client';

import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { Suspense } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import SiteHeader from '@/components/layout/SiteHeader';

export default function RSVPPage() {
  const [isPartySelected, setIsPartySelected] = useState(false);

  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // No longer needed for spotlight

  // useEffect(() => { // No longer needed for spotlight
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  const containerClasses = [
    'mobile-gallery-container',
    isPartySelected ? 'rsvp-active' : '',
    isPartySelected ? 'lights-hidden' : '',
    isPartySelected ? 'bench-hidden' : ''
  ].join(' ').trim();

  return (
    <div className={containerClasses}>
      {!isPartySelected && (
        <SiteHeader />
      )}

      {/* Conditionally render Lights ONLY if party is NOT selected */} 
      {!isPartySelected && (
        <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image relative z-0" />
      )}

      <main className="gallery-main rsvp-custom-main relative z-20">
        {/* Gradient layers - REMOVED */}
        {/* <div className="gallery-gradient-1" /> */}
        {/* <div className="gallery-gradient-2" /> */}
        
        {/* Artistic noise texture overlay - REMOVED */}
        {/* <div className="gallery-noise" /> */}
        
        {/* Dark overlay - REMOVED */}
        {/* <div className="gallery-overlay" /> */}
        
        {/* Interactive spotlight that follows mouse - REMOVED */}
        {/* <div 
          className="gallery-spotlight"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        /> */}

        <div className="gallery-section pt-12 relative z-2">
          {/* Static paragraph removed, handled by RSVPForm */}
          
          <div className="max-w-3xl mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <RSVPForm onPartySelectStateChange={setIsPartySelected} />
            </Suspense>
          </div>
        </div>

        {/* Conditionally render Bench ONLY if party is NOT selected */} 
        {/* The .bench-hidden class on parent will also hide it, but this is more explicit */} 
        {!isPartySelected && (
          <div className="bench-container rsvp-bench-container relative z-1">
            <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
          </div>
        )}
      </main>
    </div>
  );
} 