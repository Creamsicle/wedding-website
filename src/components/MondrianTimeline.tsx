"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  additionalText: string[];
  image: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    date: "October 10, 2025",
    title: "The First Meeting",
    description: "Where our story began",
    additionalText: [
      "A chance encounter that would change our lives forever.",
      "The world seemed to slow down the moment our eyes met.",
      "Little did we know this was just the beginning of our adventure."
    ],
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80"
  },
  {
    date: "December 25, 2025",
    title: "The First Date",
    description: "A magical evening of connection",
    additionalText: [
      "We talked for hours, losing track of time completely.",
      "The chemistry between us was undeniable from the start.",
      "Every laugh and shared story brought us closer together."
    ],
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80"
  },
  {
    date: "March 15, 2026",
    title: "The Proposal",
    description: "A perfect moment of love and commitment",
    additionalText: [
      "Under a sky full of stars, we made our promises.",
      "Hearts racing with excitement for our shared future.",
      "The joy of saying 'yes' to forever together."
    ],
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80"
  },
  {
    date: "June 30, 2026",
    title: "The Engagement",
    description: "Celebrating our commitment with loved ones",
    additionalText: [
      "Surrounded by family and friends who blessed our union.",
      "Two families coming together as one in celebration.",
      "An evening filled with love, laughter, and dreams."
    ],
    image: "https://images.unsplash.com/photo-1529519195486-16945f0fb37f?w=800&q=80"
  },
  {
    date: "September 20, 2026",
    title: "The Planning",
    description: "Creating our perfect day together",
    additionalText: [
      "Every detail chosen with care and meaning.",
      "Weaving our personalities into every element.",
      "Building the foundation for our celebration of love."
    ],
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80"
  },
  {
    date: "October 10, 2026",
    title: "The Ceremony",
    description: "Two hearts becoming one",
    additionalText: [
      "A beautiful blend of traditions and modern touches.",
      "Sacred vows exchanged before our dearest ones.",
      "The moment we've been dreaming of finally arrives."
    ],
    image: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=800&q=80"
  },
  {
    date: "October 11, 2026",
    title: "The Celebration",
    description: "Dancing into our future together",
    additionalText: [
      "A joyous reception filled with music and dance.",
      "Surrounded by love from all who shared our special day.",
      "The perfect beginning to our greatest adventure."
    ],
    image: "https://images.unsplash.com/photo-1511405889574-b01de1da5441?w=800&q=80"
  }
];

export default function MondrianTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const addToEventRefs = (el: HTMLDivElement | null, index: number) => {
    eventRefs.current[index] = el;
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create ScrollTrigger for each event
    eventRefs.current.forEach((event, index) => {
      if (!event) return;

      ScrollTrigger.create({
        trigger: event,
        start: "top center+=100",
        end: "bottom center",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });

      // Initial animation for each event - faster animation
      gsap.from(event, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        scrollTrigger: {
          trigger: event,
          start: "top bottom-=100",
          end: "top center+=100",
          scrub: 0.2,
        },
      });
    });

  }, []);

  return (
    <div className="w-full" ref={containerRef}>
      {/* Mondrian-style container */}
      <div className="relative border-8 border-black p-4 md:p-12">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-black transform -translate-x-1/2" />
        
        {/* Timeline events container */}
        <div className="relative" ref={timelineRef}>
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              ref={(el) => addToEventRefs(el, index)}
              className={`
                relative mb-24 last:mb-0 transition-all duration-500
                flex flex-col items-center w-full px-4
                md:block md:w-full md:flex-none md:items-start
                ${index % 2 === 0 ? 'md:pr-[52%] md:text-right' : 'md:pl-[52%] md:text-left'}
                ${activeIndex === index ? 'scale-105' : 'scale-100'}
              `}
            >
              {/* Event node */}
              <div className={`
                absolute w-16 h-16 border-4 border-black
                left-1/2 -translate-x-1/2 top-0
                md:top-1/2 md:-translate-y-1/2
                ${index % 3 === 0 ? 'bg-[#D42D27]' :
                  index % 3 === 1 ? 'bg-[#FAC901]' :
                  'bg-[#0C50A3]'}
              `} />
              
              {/* Event content */}
              <div className="relative mt-24 md:mt-0 w-full max-w-[26rem] md:max-w-[47%] mx-auto">
                <div className="border-4 border-black bg-white">
                  {/* Image container */}
                  <div className="relative h-80 border-b-4 border-black overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Date container */}
                  <div className={`
                    p-3 border-b-4 border-black
                    ${index % 3 === 1 ? 'bg-[#D42D27]' :
                      index % 3 === 2 ? 'bg-[#FAC901]' :
                      'bg-[#0C50A3]'}
                  `}>
                    <div className="font-bold text-lg text-white text-center md:text-inherit">{event.date}</div>
                  </div>
                  
                  {/* Title container */}
                  <div className="grid grid-cols-5 border-b-4 border-black">
                    <div className="col-span-1 border-r-4 border-black bg-[#FAC901] h-full" />
                    <div className="col-span-4 p-3 bg-white">
                      <div className="text-xl font-bold text-black text-center md:text-inherit !text-black">{event.title}</div>
                    </div>
                  </div>
                  
                  {/* Description container */}
                  <div className="grid grid-cols-5">
                    <div className="col-span-5 p-4 bg-white">
                      <p className="text-sm text-black text-left !text-black mb-4">{event.description}</p>
                      {event.additionalText.map((text, i) => (
                        <p key={i} className="text-sm text-black text-left !text-black mb-2 last:mb-0">
                          {text}
                        </p>
                      ))}
                    </div>
                    <div className={`col-span-1 border-l-4 border-black
                      ${index % 3 === 2 ? 'bg-[#D42D27]' :
                        index % 3 === 0 ? 'bg-[#0C50A3]' :
                        'bg-[#FAC901]'}
                    `} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 