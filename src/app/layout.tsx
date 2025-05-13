import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chelsea & Neil's Wedding",
  description: "Join us on our special day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <main>{children}</main>
        <footer className="border-t mt-20">
          <div className="container mx-auto px-4 h-16 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Chelsea & Neil. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
