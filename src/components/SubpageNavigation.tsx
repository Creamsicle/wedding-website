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
import { useState } from "react";
import Image from "next/image";

const navigation = [
  { name: "HOME", href: "/" },
  { name: "EVENTS", href: "/events" },
  { name: "STORY", href: "/story" },
  { name: "FAQ", href: "/faq" },
  { name: "RSVP", href: "/rsvp" },
];

export default function SubpageNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-[#0A1A3B] border-b border-white/10">
      <nav className="container mx-auto px-8 h-20 flex items-center justify-between">
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
              className="text-[#FFF8E7] hover:text-white/80 transition-colors tracking-widest text-sm"
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