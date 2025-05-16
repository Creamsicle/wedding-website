"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const navigation = [
  { name: "HOME", href: "/" },
  { name: "EXHIBITION", href: "/exhibition" },
  { name: "EVENTS", href: "/events" },
  { name: "STORY", href: "/story" },
  { name: "FAQ", href: "/faq" },
  { name: "RSVP", href: "/rsvp" },
];

export default function SubpageNavigation() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Show nav when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } 
      // Hide nav when scrolling down and not at top
      else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 group transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Starry night background - only shows on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10">
        <Image 
          src="/starrynight.jpg" 
          alt="Starry Night Background" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>
      
      {/* Semi-transparent nav that lets gallery background show through */}
      <nav className="container mx-auto px-8 h-20 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/logow.png" 
            alt="Wedding Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
          <span className="text-[#FFF8E7] font-serif text-xl">Chelsea & Neil</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[#FFF8E7] hover:text-white transition-colors tracking-widest text-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-full"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-lg py-2 px-4 rounded-md hover:bg-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
} 