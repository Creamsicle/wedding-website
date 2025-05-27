// 'use client'; // No longer a client component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
// import { useDynamicViewportHeight } from "@/lib/hooks/useDynamicViewportHeight"; // No longer called here
import { DynamicViewportHeightInitializer } from "@/components/layout/DynamicViewportHeightInitializer"; // Import the new component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chelsea & Neil's Wedding",
  description: "We hope you can join us on October 10-11, 2025",
  icons: {
    icon: [
      { url: '/pigeon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/pigeon.svg',
    apple: '/pigeon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useDynamicViewportHeight(); // No longer called here

  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background h-full flex flex-col")}>
        <DynamicViewportHeightInitializer />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
