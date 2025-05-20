'use client';

import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { Suspense } from 'react';
import { useState } from 'react';
// import Image from 'next/image'; // No longer needed
import SiteHeader from '@/components/layout/SiteHeader';

export default function RSVPMobilePage() { // Renamed component
  const [isPartySelected, setIsPartySelected] = useState(false);

  // Removed mousePosition and useEffect for spotlight as it was already commented out
  // Removed containerClasses logic

  return (
    <div className="rsvp-mobile-container"> {/* Simplified container class */}
      {!isPartySelected && (
        <SiteHeader />
      )}

      {/* Lights image removed */}

      <main className="relative z-20 flex-grow"> {/* Added flex-grow */}
        {/* Gradient, noise, overlay, and spotlight elements were already commented out/removed */}

        <div className="pt-12 relative z-2">
          <div className="max-w-3xl mx-auto w-full px-4"> {/* Added w-full and some padding for content safety */}
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