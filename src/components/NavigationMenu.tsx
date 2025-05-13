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

const navigation = [
  { name: "EVENTS", href: "/events" },
  { name: "STORY", href: "/story" },
  { name: "FAQ", href: "/faq" },
  { name: "RSVP", href: "/rsvp" },
];

export default function NavigationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pt-[50px]">
      <nav className="container mx-auto px-8 h-24 flex items-center justify-center">
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
              className="md:hidden text-white absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/10 bg-black/30 rounded-full backdrop-blur-sm border border-white/20 transition-all"
            >
              <Menu className="h-8 w-8" />
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