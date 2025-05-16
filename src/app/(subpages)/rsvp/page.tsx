'use client';

import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { Suspense } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu as MenuIcon } from 'lucide-react';

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

  return (
    <div className="mobile-gallery-container">
      {!isPartySelected && (
        <header className="gallery-header relative z-10">
          <div className="logo">
            <Link href="/"> 
              <Image src="/logow.png" alt="Logo" width={50} height={50} className="header-logo-image" />
            </Link>
          </div>
          <Link href="/"> 
            <div className="header-title">CHELSEA & NEIL</div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="menu-icon-button">
                <MenuIcon className="h-6 w-6 menu-actual-icon" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mobile-dropdown-menu-content">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/events">Events</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/story">Our Story</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/faq">FAQ</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/rsvp">RSVP</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
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

        <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image relative z-0" />

        <div className="gallery-section pt-12 relative z-2">
          {/* Static paragraph removed, handled by RSVPForm */}
          
          <div className="max-w-3xl mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <RSVPForm onPartySelectStateChange={setIsPartySelected} />
            </Suspense>
          </div>
        </div>

        {!isPartySelected && (
          <div className="bench-container rsvp-bench-container relative z-1">
            <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
          </div>
        )}
      </main>
    </div>
  );
} 