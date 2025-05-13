import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Users, HelpCircle, Send } from "lucide-react";
import CountdownClock from "@/components/CountdownClock";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        style={{
          backgroundImage: `url('/herobg2.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="min-h-screen flex flex-col items-center"
      >
        <div className="pt-[calc(6rem+50px)]">
          <h1 className="text-4xl md:text-6xl font-serif tracking-wider text-white">
            CHELSEA & NEIL
          </h1>
        </div>
      </section>

      {/* Starry Night Background Container */}
      <div 
        style={{
          backgroundImage: `url('/starrynight.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Navigation Cards Section */}
        <section className="relative">
          <div className="bg-[#0A1A3B]/60 py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/events" className="block">
                  <div 
                    className="card-hover-area"
                    style={{ '--bg-image': `url('/starrynight.jpg')` } as React.CSSProperties}
                  >
                    <Card className="relative bg-white/5 border-white/10 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                      <CardContent className="pt-6 pb-6 text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                        <h3 className="text-3xl font-serif font-bold mb-2 text-[#FFF8E7]">Events</h3>
                        <p className="text-white/80 text-lg font-medium">
                          On both Friday & Saturday
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </Link>

                <Link href="/story" className="block">
                  <div 
                    className="card-hover-area"
                    style={{ '--bg-image': `url('/starrynight.jpg')` } as React.CSSProperties}
                  >
                    <Card className="relative bg-white/5 border-white/10 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                      <CardContent className="pt-6 pb-6 text-center">
                        <Users className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                        <h3 className="text-3xl font-serif font-bold mb-2 text-[#FFF8E7]">Story</h3>
                        <p className="text-white/80 text-lg font-medium">
                          Our favourite love story
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </Link>

                <Link href="/faq" className="block">
                  <div 
                    className="card-hover-area"
                    style={{ '--bg-image': `url('/starrynight.jpg')` } as React.CSSProperties}
                  >
                    <Card className="relative bg-white/5 border-white/10 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                      <CardContent className="pt-6 pb-6 text-center">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                        <h3 className="text-3xl font-serif font-bold mb-2 text-[#FFF8E7]">FAQ</h3>
                        <p className="text-white/80 text-lg font-medium">
                          Questions you haven't asked
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </Link>

                <Link href="/rsvp" className="block">
                  <div 
                    className="card-hover-area"
                    style={{ '--bg-image': `url('/starrynight.jpg')` } as React.CSSProperties}
                  >
                    <Card className="relative bg-white/5 border-white/10 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                      <CardContent className="pt-6 pb-6 text-center">
                        <Send className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                        <h3 className="text-3xl font-serif font-bold mb-2 text-[#FFF8E7]">RSVP</h3>
                        <p className="text-white/80 text-lg font-medium">
                          Please confirm by July 32nd
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="bg-[#0A1A3B]/60 py-12">
          <div className="container mx-auto px-4">
            <CountdownClock />
          </div>
        </section>

        {/* Date Footer */}
        <section className="bg-[#0A1A3B]/60 py-12 relative">
          <div className="container mx-auto px-4">
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
    </div>
  );
} 