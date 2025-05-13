import SubpageNavigation from "@/components/SubpageNavigation";
import Image from "next/image";
import Link from "next/link";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SubpageNavigation />
      <div className="flex-1">
        {children}
      </div>
      <section className="relative py-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/lilies.jpg"
            alt="Lilies Background"
            fill
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 backdrop-blur-[2px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <Link href="/">
                <Image 
                  src="/logow.png" 
                  alt="Wedding Logo" 
                  width={128} 
                  height={128} 
                  className="object-contain hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            <div className="space-y-4">
              <p className="text-[#FFF8E7] font-serif text-2xl tracking-wider">OCTOBER 10-11, 2025</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 