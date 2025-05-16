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

const navigation = [
  { name: "EXHIBITION", href: "/exhibition" },
  { name: "EVENTS", href: "/events" },
  { name: "STORY", href: "/story" },
  { name: "FAQ", href: "/faq" },
  { name: "RSVP", href: "/rsvp" },
];

export default function NavigationMenu() {
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
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <nav className="container mx-auto px-8 h-24 flex items-center justify-center relative">
        <div className="hidden md:flex items-center space-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white hover:text-white/80 transition-colors tracking-widest text-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              className="md:hidden text-white absolute right-6 top-1/2 -translate-y-1/2 p-4 hover:bg-white/10 bg-black/30 rounded-full backdrop-blur-sm border border-white/20 transition-all"
            >
              <Menu className="h-10 w-10" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left text-white/90 text-2xl">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-6 mt-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-xl py-3 px-6 rounded-md text-white hover:bg-[var(--rust-primary)] transition-colors tracking-widest"
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