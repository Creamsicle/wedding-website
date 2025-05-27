'use client';

import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { Suspense, useEffect } from 'react';
import { useState } from 'react';
// import Image from 'next/image'; // No longer needed
import SiteHeader from '@/components/layout/SiteHeader';
import { DynamicViewportHeightInitializer } from '@/components/layout/DynamicViewportHeightInitializer';

export default function RSVPMobilePage() { // Renamed component
  const [isPartySelected, setIsPartySelected] = useState(false);

  useEffect(() => {
    document.body.classList.add('on-rsvp-mobile');
    return () => {
      document.body.classList.remove('on-rsvp-mobile');
    };
  }, []);

  // Removed mousePosition and useEffect for spotlight as it was already commented out
  // Removed containerClasses logic

  return (
    <div className="rsvp-mobile-container"> {/* Simplified container class */}
      <DynamicViewportHeightInitializer />
      {!isPartySelected && (
        <div style={{ paddingTop: '60px' }}> {/* Added wrapper div with conditional padding */}
          <SiteHeader />
        </div>
      )}

      {/* Lights image removed */}

      <main className="relative z-20 flex-grow flex flex-col bg-transparent diag-magenta"> {/* Added bg-transparent */}
        {/* Gradient, noise, overlay, and spotlight elements were already commented out/removed */}

        <div className={`${isPartySelected ? 'pt-8' : 'pt-12'} relative z-2 flex-grow flex flex-col w-full items-center bg-transparent diag-red`}> {/* Added bg-transparent */}
          <div className="max-w-3xl w-full px-4 flex-grow flex flex-col bg-transparent diag-limegreen">
            <Suspense fallback={<div>Loading...</div>}>
              <RSVPForm onPartySelectStateChange={setIsPartySelected} />
            </Suspense>
          </div>
        </div>

        {/* Bench image removed */}
      </main>
    </div>
  );
} 