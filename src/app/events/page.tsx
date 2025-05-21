'use client'; // Required for using hooks like useState

import Image from 'next/image';
import { useState } from 'react'; // Need useState for dialog state
import { Button } from '@/components/ui/button'; // Added Button import back
import { Info } from 'lucide-react'; // Info is used in the body
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added Card components
import { CalendarDays, Clock, MapPin, Shirt, Car } from 'lucide-react'; // These are used in the body
import SiteHeader from '@/components/layout/SiteHeader'; // Import the new SiteHeader

// Define an interface for the event structure
interface EventDetail {
  id: string;
  photo: string;
  plaque: string;
  altPhoto: string;
  altPlaque: string;
  title: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  schedule: string[];
  dressCode: string;
  parkingTravel: string;
  hasInfoIcon: boolean;
}

const eventDetails: EventDetail[] = [
  {
    id: 'hindu-ceremony',
    photo: '/images/events/Events-photo1.png',
    plaque: '/images/events/events-plaque1.png',
    altPhoto: 'Hindu Ceremony photo',
    altPlaque: 'Hindu Ceremony plaque',
    title: 'Hindu Ceremony',
    date: 'Friday, October 10, 2025',
    time: '8:00 AM - 1:00 PM',
    locationName: "Queen's Manor Event Centre",
    locationAddress: '2 Auction Lane, Brampton, Ontario L6T 0C4',
    schedule: [
      '8:00 AM: Breakfast',
      '9:00 AM - 11:00 AM: Hindu Wedding Ceremony',
      '11:00 AM - 1:00 PM: Celebration continues with music and lunch',
    ],
    dressCode: "Indian formal wear is encouraged (think shalwars, sarees, kurtas, sherwanis, or lehengas)! If you don\'t have traditional Indian attire, western formal wear is perfectly fine too. Most importantly, wear whatever makes you feel comfortable. :) We\'re just excited to have you there to celebrate with us!",
    parkingTravel: "There\'s a lot of parking at the Queen\'s Manor Event Centre, and bus routes close by. If you need a ride please let us know!",
    hasInfoIcon: false,
  },
  {
    id: 'wedding-reception',
    photo: '/images/events/Events-photo2.png',
    plaque: '/images/events/events-plaque2.png',
    altPhoto: 'Wedding + Reception photo',
    altPlaque: 'Wedding + Reception plaque',
    title: 'Wedding and Reception',
    date: 'Saturday, October 11, 2025',
    time: '3:30 PM',
    locationName: 'Art Gallery of Hamilton',
    locationAddress: '123 King Street West, Hamilton, Ontario L8P 4S8',
    schedule: [
      '3:30 PM: Arrive and settle in, find a seat!',
      '4:00 PM: Ceremony',
      '5:00 PM: Cocktail hour & explore the art gallery!',
      '6:00 PM - LATE: Dinner, reception, dancing 🎉',
    ],
    dressCode: 'Formal and vibrant! Think bold colours and festive flair, however vibrant means to you.',
    parkingTravel: "There are many parking lots and some street parking surrounding the Art Gallery of Hamilton, and multiple bus stops near Jackson Square. Let us know if you need help getting there. ♡",
    hasInfoIcon: false,
  },
];

export default function EventsNewPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);

  const openDialog = (event: EventDetail) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  return (
    <div className="mobile-gallery-container">
      <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" />
      <SiteHeader />

      <main className="gallery-main diag-magenta">
        <div className="events-list diag-red"> {/* New container for event items */}
          {eventDetails.map((event) => (
            <div key={event.id} className="event-item diag-limegreen">
              <div className="framed-artwork event-image-clickable diag-blue" onClick={() => openDialog(event)}>
                <Image src={event.photo} alt={event.altPhoto} width={600} height={450} className="artwork-frame" />
                {event.hasInfoIcon && (
                  <div className="info-icon-overlay">
                    <Info size={28} color="white" strokeWidth={1.5} />
                  </div>
                )}
                <div className="clickable-image-hint">
                  <Image src="/click.svg" alt="Click hint" width={50} height={50} />
                </div>
                <Image 
                  src={event.plaque} 
                  alt={event.altPlaque} 
                  width={300} 
                  height={100} 
                  className="plaque-image cursor-pointer diag-yellow" 
                  onClick={() => openDialog(event)} 
                />
              </div>
            </div>
          ))}
        </div>

        {selectedEvent && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent 
              className="event-dialog-content flex flex-col my-4 mx-2 sm:mx-auto sm:max-w-[600px] z-[1050] bg-gray-800/90 p-4 md:p-6 rounded-xl shadow-xl text-white styled-scrollbar"
              style={{
                maxHeight: `calc( (var(--dynamic-vh, 1vh) * 100) - 4rem )`,
                "--muted-foreground": "0 0% 100%"
              } as React.CSSProperties}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-white">{selectedEvent.title}</DialogTitle>
                <div className="pt-2 text-sm text-white/90 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="h-5 w-5 text-white/70" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-white/70" />
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-white/70 mt-1" />
                    <span>
                      <strong>{selectedEvent.locationName}</strong>
                      <br />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.locationAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-current hover:text-[var(--rust-light)] transition-colors"
                      >
                        {selectedEvent.locationAddress}
                      </a>
                    </span>
                  </div>
                </div>
              </DialogHeader>
              <div className="dialog-details-scrollable flex-1 py-4 space-y-4 overflow-y-auto min-h-0">
                <Card className="bg-gray-700/90 border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg text-[var(--rust-light)]">
                      <CalendarDays className="h-5 w-5 mr-2 text-[var(--rust-primary)]" />
                      Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/90">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {selectedEvent.schedule.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700/90 border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg text-[var(--rust-light)]">
                      <Shirt className="h-5 w-5 mr-2 text-[var(--rust-primary)]" />
                      Dress Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/90">
                    <p className="text-sm">{selectedEvent.dressCode}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700/90 border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg text-[var(--rust-light)]">
                      <Car className="h-5 w-5 mr-2 text-[var(--rust-primary)]" />
                      Parking & Travel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/90">
                    <p className="text-sm">{selectedEvent.parkingTravel}</p>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter className="sm:justify-start pt-4 border-t border-gray-700">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="bg-[var(--rust-primary)] hover:bg-[var(--rust-secondary)] text-white">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
      <div className="bench-container">
        <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
      </div>
    </div>
  );
} 