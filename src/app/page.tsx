'use client';

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

export default function HomePage() {
  return (
    <div className="mobile-gallery-container">
      <header className="gallery-header">
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