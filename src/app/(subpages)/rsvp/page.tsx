'use client';

import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SiteHeader from '@/components/layout/SiteHeader';
import { useDynamicViewportHeight } from '@/lib/hooks/useDynamicViewportHeight';

export default function RSVPPage() {
  const [isPartySelected, setIsPartySelected] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { triggerViewportUpdate } = useDynamicViewportHeight();

  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // No longer needed for spotlight

  // useEffect(() => { // No longer needed for spotlight
  //   const handleMouseMove = (e: MouseEvent) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      if (mobile !== isMobileView) {
        setIsMobileView(mobile);
        console.log('[RSVPPage] Mobile view changed to:', mobile);
      }
    };
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobileView]);

  useEffect(() => {
    console.log('[RSVPPage] isPartySelected changed to:', isPartySelected, 'Triggering viewport update.');
    triggerViewportUpdate();

    if (containerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _height = containerRef.current.offsetHeight;
      console.log('[RSVPPage] Read offsetHeight to attempt reflow.');
    }

    setTimeout(() => {
      console.log('[RSVPPage] Delayed (50ms) triggerViewportUpdate.');
      triggerViewportUpdate();
       if (containerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _height = containerRef.current.offsetHeight;
      }
    }, 50);
    setTimeout(() => {
      console.log('[RSVPPage] Delayed (150ms) triggerViewportUpdate.');
      triggerViewportUpdate();
       if (containerRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _height = containerRef.current.offsetHeight;
      }
    }, 150);

  }, [isPartySelected, triggerViewportUpdate]);

  const containerClasses = [
    'mobile-gallery-container',
    'rsvp-page',
    isMobileView ? 'rsvp-mobile-view-active' : '',
    isPartySelected ? 'rsvp-active' : '',
    isPartySelected && !isMobileView ? 'lights-hidden' : '',
    isPartySelected && !isMobileView ? 'bench-hidden' : ''
  ].join(' ').trim();

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Conditionally render SiteHeader: show on desktop always, or on mobile only if no party is selected */}
      {(!isMobileView || (isMobileView && !isPartySelected)) && (
        <SiteHeader className="rsvp-specific-header" />
      )}

      {!isMobileView && !isPartySelected && (
        <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image z-0" />
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

        <div className="gallery-section relative z-2">
          {/* Static paragraph removed, handled by RSVPForm */}
          
          <div className="max-w-3xl mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <RSVPForm 
                onPartySelectStateChange={setIsPartySelected} 
                isMobileView={isMobileView} 
              />
            </Suspense>
          </div>
        </div>
      </main>

      {!isMobileView && !isPartySelected && (
        <div className="bench-container rsvp-bench-container relative z-1">
          <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
        </div>
      )}
    </div>
  );
} 