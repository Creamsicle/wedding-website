'use client';

import Image from 'next/image';
import { Calendar, Clock, MapPin, Car, Shirt, CalendarCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MapTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  mapUrl: string;
}

function MapTooltip({ visible, x, y, mapUrl }: MapTooltipProps) {
  if (!visible) return null;

  return (
    <div 
      className="fixed z-50 w-[300px] h-[200px] bg-black/90 rounded-lg overflow-hidden shadow-2xl border border-white/10"
      style={{ 
        left: `${x + 20}px`, 
        top: `${y - 100}px`,
        transform: 'scale(1)',
        opacity: 1,
        transition: 'transform 0.2s ease, opacity 0.2s ease'
      }}
    >
      <div className="relative w-full h-full">
        <iframe
          src={`${mapUrl}&zoom=16`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
          <div className="relative">
            <MapPin className="w-8 h-8 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500/20 rounded-full blur-sm animate-ping" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mapTooltip, setMapTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    mapUrl: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    mapUrl: ''
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const venues = {
    queensManor: {
      name: "Queen's Manor Event Centre",
      address: "2 Auction Lane, Brampton, Ontario L6T 0C4",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2884.383650822939!2d-79.79138388446882!3d43.70744857911935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b15c3e8c87de7%3A0x84a33f4c3ce07c95!2sQueen's+Manor+Event+Centre!5e0!3m2!1sen!2sca!4v1710901234567!5m2!1sen!2sca&style=dark",
      googleMapsUrl: "https://maps.google.com/?q=Queen's+Manor+Event+Centre,+2+Auction+Lane,+Brampton,+Ontario+L6T+0C4"
    },
    artGallery: {
      name: "Art Gallery of Hamilton",
      address: "123 King Street West, Hamilton, Ontario L8P 4S8",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.0456789012345!2d-79.8712!3d43.2567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9b829379ef31%3A0x1427c4e74cc3c96d!2sArt+Gallery+of+Hamilton!5e0!3m2!1sen!2sca!4v1710901234567!5m2!1sen!2sca&style=dark",
      googleMapsUrl: "https://maps.google.com/?q=Art+Gallery+of+Hamilton,+123+King+Street+West,+Hamilton,+Ontario+L8P+4S8"
    }
  };

  const handleAddressHover = (venue: keyof typeof venues, event: React.MouseEvent) => {
    setMapTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      mapUrl: venues[venue].mapUrl
    });
  };

  const handleAddressLeave = () => {
    setMapTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="gallery-container">
      {/* Gradient layers */}
      <div className="gallery-gradient-1" />
      <div className="gallery-gradient-2" />
      
      {/* Artistic noise texture overlay */}
      <div className="gallery-noise" />
      
      {/* Dark overlay */}
      <div className="gallery-overlay" />
      
      {/* Interactive spotlight that follows mouse */}
      <div 
        className="gallery-spotlight"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />

      <MapTooltip {...mapTooltip} />

      <div className="gallery-section">
        <h1 className="gallery-heading">Exhibition of Celebrations</h1>
        <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto text-lg">
          We invite you to explore our carefully curated collection of moments,
          each telling a unique story of our celebration.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Hindu Ceremony Installation */}
          <div className="exhibition-piece">
            <div className="relative h-[30vh] w-full">
              <Image
                src="/images/events/hindu_ceremony.jpg"
                alt="Hindu Ceremony"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
              <div className="artwork-frame" />
            </div>
            
            <div className="artwork-plaque">
              <h2 className="plaque-title">Hindu Ceremony</h2>
              
              <div className="space-y-4 text-white/80">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Friday, October 10, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">8:00 AM - 1:00 PM</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-white">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                  <div>
                    <a 
                      href={venues.queensManor.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      onMouseEnter={(e) => handleAddressHover('queensManor', e)}
                      onMouseLeave={handleAddressLeave}
                    >
                      <div className="text-sm group-hover:text-white/90 transition-colors">
                        {venues.queensManor.name}
                      </div>
                      <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        {venues.queensManor.address}
                      </div>
                    </a>
                  </div>
                </div>

                <section className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarCheck className="w-4 h-4 text-white" />
                    <h3 className="text-lg font-serif text-white">Schedule</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>8:00 AM - Breakfast</li>
                    <li>9:00 AM - Hindu Wedding Ceremony</li>
                    <li>11:00 AM - Celebration continues with music and lunch</li>
                  </ul>
                </section>

                <section className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shirt className="w-4 h-4 text-white" />
                    <h3 className="text-lg font-serif text-white">Dress Code</h3>
                  </div>
                  <p className="text-sm">
                    Indian formal wear is encouraged (think shalwars, sarees, kurtas, sherwanis, or lehengas)! 
                    If you don't have traditional Indian attire, western formal wear is perfectly fine too.
                  </p>
                </section>

                <section className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-white" />
                    <h3 className="text-lg font-serif text-white">Location & Travel</h3>
                  </div>
                  <p className="text-sm mb-3">
                    There's a lot of parking at the Queen's Manor Event Centre, and bus routes close by. 
                    If you need a ride please let us know!
                  </p>
                </section>
              </div>
            </div>
          </div>

          {/* Wedding and Reception Installation */}
          <div className="exhibition-piece">
            <div className="relative h-[30vh] w-full">
              <Image
                src="/images/events/reception.webp"
                alt="Wedding and Reception"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
              <div className="artwork-frame" />
            </div>
            
            <div className="artwork-plaque">
              <h2 className="plaque-title">Wedding and Reception</h2>
              
              <div className="space-y-4 text-white/80">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Saturday, October 11, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">3:30 PM - 12:30 AM</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-white">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                  <div>
                    <a 
                      href={venues.artGallery.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      onMouseEnter={(e) => handleAddressHover('artGallery', e)}
                      onMouseLeave={handleAddressLeave}
                    >
                      <div className="text-sm group-hover:text-white/90 transition-colors">
                        {venues.artGallery.name}
                      </div>
                      <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        {venues.artGallery.address}
                      </div>
                    </a>
                  </div>
                </div>

                <section className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarCheck className="w-4 h-4 text-white" />
                    <h3 className="text-lg font-serif text-white">Schedule</h3>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li>3:30 PM - Arrive and settle in, find a seat!</li>
                    <li>4:00 PM - Ceremony</li>
                    <li>5:00 PM - Cocktail hour & explore the art gallery!</li>
                    <li>6:00 PM - Dinner, reception, dancing 🎉</li>
                  </ul>
                </section>

                <section className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Shirt className="w-4 h-4 text-white" />
                    <h3 className="text-lg font-serif text-white">Dress Code</h3>
                  </div>
                  <p className="text-sm">
                    Formal and vibrant! Think bold colours and festive flair, however vibrant means to you.
                  </p>
                </section>

                <section className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-white" />
                    <h3 className="text-lg font-serif text-white">Location & Travel</h3>
                  </div>
                  <p className="text-sm mb-3">
                    There are many parking lots and some street parking surrounding the Art Gallery of Hamilton, 
                    and multiple bus stops near Jackson Square. Let us know if you need help getting there. ♡
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 