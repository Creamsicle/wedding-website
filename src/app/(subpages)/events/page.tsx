'use client';

import Image from 'next/image';
import { Calendar, Clock, MapPin, Car, Shirt } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="min-h-screen subpage-gradient">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif mb-4 text-white">Wedding Events</h1>
          <p className="text-lg font-semibold text-white max-w-2xl mx-auto">
            Join us in celebrating our special day with these memorable events.
          </p>
          <p className="text-lg mb-4">We&apos;re excited to celebrate with you!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Hindu Ceremony */}
          <div className="card-hover rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
            <div className="relative h-96 w-full">
              <Image
                src="/images/events/hindu_ceremony.jpg"
                alt="Hindu Ceremony"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-serif text-white mb-4">Hindu Ceremony</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-[var(--rust-light)]">
                  <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Friday, October 10, 2025</span>
                </div>
                <div className="flex items-center text-[var(--rust-light)]">
                  <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>8:00 AM - 1:00 PM</span>
                </div>
                <div className="flex items-start text-[var(--rust-light)]">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <div>Queen&apos;s Manor Event Centre</div>
                    <div className="text-[var(--rust-light)]/80">2 Auction Lane, Brampton, Ontario L6T 0C4</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-serif text-white mb-3">Schedule</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>8:00 AM: Breakfast</li>
                    <li>9:00 AM - 11:00 AM: Hindu Wedding Ceremony</li>
                    <li>11:00 AM - 1:00 PM: Celebration continues with music and lunch</li>
                  </ul>
                </section>

                <section>
                  <div className="flex items-center mb-3">
                    <Shirt className="w-5 h-5 mr-2 text-white" />
                    <h3 className="text-xl font-serif text-white">Dress Code</h3>
                  </div>
                  <p className="text-white/80">
                    Indian formal wear is encouraged (think shalwars, sarees, kurtas, sherwanis, or lehengas)! 
                    If you don&apos;t have traditional Indian attire, western formal wear is perfectly fine too. 
                    Most importantly, wear whatever makes you feel comfortable. :) We&apos;re just excited to have you there to celebrate with us!
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-3">
                    <Car className="w-5 h-5 mr-2 text-white" />
                    <h3 className="text-xl font-serif text-white">Parking & Travel</h3>
                  </div>
                  <p className="text-white/80">
                    There&apos;s a lot of parking at the Queen&apos;s Manor Event Centre, and bus routes close by. 
                    If you need a ride please let us know!
                  </p>
                </section>

                <section className="mt-8">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2884.3836508229387!2d-79.7892!3d43.7074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b15c3e8c87de7%3A0x84a33f4c3ce07c95!2sQueen&#39;s%20Manor%20Event%20Centre!5e0!3m2!1sen!2sca!4v1710901234567!5m2!1sen!2sca&style=dark"
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: '0.5rem' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="shadow-lg"
                  ></iframe>
                </section>
              </div>
            </div>
          </div>

          {/* Wedding and Reception */}
          <div className="card-hover rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
            <div className="relative h-96 w-full">
              <Image
                src="/images/events/reception.webp"
                alt="Wedding and Reception"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-serif text-white mb-4">Wedding and Reception</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-[var(--rust-light)]">
                  <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>Saturday, October 11, 2025</span>
                </div>
                <div className="flex items-center text-[var(--rust-light)]">
                  <Clock className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>3:30 PM</span>
                </div>
                <div className="flex items-start text-[var(--rust-light)]">
                  <MapPin className="w-5 h-5 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <div>Art Gallery of Hamilton</div>
                    <div className="text-[var(--rust-light)]/80">123 King Street West, Hamilton, Ontario L8P 4S8</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-serif text-white mb-3">Schedule</h3>
                  <ul className="space-y-2 text-white/80">
                    <li>3:30 PM: Arrive and settle in, find a seat!</li>
                    <li>4:00 PM: Ceremony</li>
                    <li>5:00 PM: Cocktail hour & explore the art gallery!</li>
                    <li>6:00 PM - LATE: Dinner, reception, dancing 🎉</li>
                  </ul>
                </section>

                <section>
                  <div className="flex items-center mb-3">
                    <Shirt className="w-5 h-5 mr-2 text-white" />
                    <h3 className="text-xl font-serif text-white">Dress Code</h3>
                  </div>
                  <p className="text-white/80">
                    Formal and vibrant! Think bold colours and festive flair, however vibrant means to you.
                  </p>
                </section>

                <section>
                  <div className="flex items-center mb-3">
                    <Car className="w-5 h-5 mr-2 text-white" />
                    <h3 className="text-xl font-serif text-white">Parking & Travel</h3>
                  </div>
                  <p className="text-white/80">
                    There are many parking lots and some street parking surrounding the Art Gallery of Hamilton, 
                    and multiple bus stops near Jackson Square. Let us know if you need help getting there. ♡
                  </p>
                </section>

                <section className="mt-8">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.0456789012345!2d-79.8712!3d43.2567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9b829379ef31%3A0x1427c4e74cc3c96d!2sArt%20Gallery%20of%20Hamilton!5e0!3m2!1sen!2sca!4v1710901234567!5m2!1sen!2sca&style=dark"
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: '0.5rem' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="shadow-lg"
                  ></iframe>
                </section>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 