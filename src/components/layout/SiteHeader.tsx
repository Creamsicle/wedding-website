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

const navLinks = [
  { href: "/events", label: "EXHIBITIONS" },
  { href: "/story", label: "HISTORY" },
  { href: "/faq", label: "FAQ" },
  { href: "/rsvp", label: "RSVP" },
];

// Helper function for Title Case
const toTitleCase = (str: string) => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

interface SiteHeaderProps {
  className?: string; // Optional className prop
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  // Combine base classes with any passed className
  const headerClasses = `gallery-header relative ${className || ''}`.trim();

  return (
    <header className={headerClasses}>
      {/* Left Group: Logo + Title */}
      <div className="flex flex-shrink-0 items-center z-10">
        <div className="logo">
          <Link href="/">
            <Image src="/logow.png" alt="Logo" width={50} height={50} className="header-logo-image" />
          </Link>
        </div>
        <Link href="/">
          <div className="header-title ml-4">CHELSEA & NEIL</div>
        </Link>
      </div>
      
      {/* Center Group: Desktop Navigation - Adjusted spacing */}
      <nav className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:flex items-center space-x-12">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-base font-semibold uppercase tracking-wider text-white hover:text-rust-light transition-colors"
          >
            {link.label} 
          </Link>
        ))}
      </nav>

      {/* Right Group: Mobile Menu trigger and Desktop Spacer */}
      <div className="flex flex-shrink-0 items-center justify-end w-[50px] z-10">
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="menu-icon-button">
                <MenuIcon className="h-6 w-6 menu-actual-icon" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mobile-dropdown-menu-content">
              <DropdownMenuItem asChild>
                <Link href="/">
                  {toTitleCase("HOME")}
                </Link>
              </DropdownMenuItem>
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>
                    {/* Render FAQ and RSVP as all caps, others as Title Case for mobile */}
                    {(link.label === "FAQ" || link.label === "RSVP") ? link.label : toTitleCase(link.label)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 