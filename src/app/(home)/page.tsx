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

      {/* Navigation Cards Section */}
      <section className="bg-[#0A1A3B] py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/events" className="block group">
              <Card className="bg-white/5 border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                <CardContent className="pt-6 pb-6 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                  <h3 className="text-2xl font-serif mb-2 text-[#FFF8E7]">Events</h3>
                  <p className="text-white/80">
                    View our wedding weekend schedule
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/story" className="block group">
              <Card className="bg-white/5 border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                <CardContent className="pt-6 pb-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                  <h3 className="text-2xl font-serif mb-2 text-[#FFF8E7]">Story</h3>
                  <p className="text-white/80">
                    Read about our journey together
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/faq" className="block group">
              <Card className="bg-white/5 border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                <CardContent className="pt-6 pb-6 text-center">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                  <h3 className="text-2xl font-serif mb-2 text-[#FFF8E7]">FAQ</h3>
                  <p className="text-white/80">
                    Find answers to common questions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/rsvp" className="block group">
              <Card className="bg-white/5 border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white/10">
                <CardContent className="pt-6 pb-6 text-center">
                  <Send className="w-12 h-12 mx-auto mb-4 text-[#FFF8E7]" />
                  <h3 className="text-2xl font-serif mb-2 text-[#FFF8E7]">RSVP</h3>
                  <p className="text-white/80">
                    Confirm your attendance
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="bg-[#0A1A3B] py-24">
        <div className="container mx-auto px-4">
          <CountdownClock />
        </div>
      </section>

      {/* Date Footer */}
      <section className="bg-[#9e3b06] py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <Image 
                src="/logow.png" 
                alt="Wedding Logo" 
                width={128} 
                height={128} 
                className="object-contain"
              />
            </div>
            <div className="space-y-4">
              <p className="text-[#FFF8E7] font-serif text-2xl tracking-wider">OCTOBER 10-11, 2025</p>
            </div>
          </div>
        </div>
        {/* Decorative Border */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[url('/border-top.svg')] bg-repeat-x"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[url('/border-bottom.svg')] bg-repeat-x"></div>
      </section>
    </div>
  );
} 