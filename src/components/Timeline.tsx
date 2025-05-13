'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  image?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!timelineRef.current || !containerRef.current) return;

    // Set up horizontal scroll animation
    const horizontalScroll = gsap.to(containerRef.current, {
      x: () => -(containerRef.current!.scrollWidth - window.innerWidth + 32),
      ease: "none",
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top center",
        end: () => `+=${containerRef.current!.scrollWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: "timelineScroll",
      },
    });

    // Set initial state for all items
    gsap.set(timelineItemsRef.current, {
      opacity: 0,
      x: 100,
    });

    // Show first two items immediately
    gsap.to(timelineItemsRef.current.slice(0, 2), {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
      immediateRender: false,
    });

    // Animate remaining items on scroll
    timelineItemsRef.current.slice(2).forEach((item, index) => {
      if (!item) return;

      gsap.to(item, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: item,
          start: "left center+=200",
          end: "right center",
          toggleActions: "play none none reverse",
          containerAnimation: horizontalScroll,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [items]);

  return (
    <div ref={timelineRef} className="relative h-[600px] w-full overflow-hidden subpage-gradient">
      {/* Timeline container */}
      <div 
        ref={containerRef} 
        className="absolute left-0 flex items-center min-w-max gap-8 p-8"
      >
        {/* Center line */}
        <div className="absolute left-8 right-8 top-1/2 h-0.5 -translate-y-1/2 timeline-line" />

        {/* Timeline items */}
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              timelineItemsRef.current[index] = el;
            }}
            className={`relative w-[300px] ${
              index % 2 === 0 ? '-mt-[150px]' : 'mt-[150px]'
            }`}
          >
            {/* Content */}
            <div className="card-hover rounded-lg p-6 shadow-lg">
              {/* Date */}
              <div className="mb-2 text-sm font-semibold text-[var(--rust-light)]">
                {item.date}
              </div>
              
              <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
              {item.image && (
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              )}
              <p className="text-white/80">{item.description}</p>
            </div>

            {/* Dot */}
            <div
              className={`absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full timeline-dot ${
                index % 2 === 0 
                  ? 'bottom-0 translate-y-1/2' 
                  : 'top-0 -translate-y-1/2'
              }`}
            />

            {/* Vertical line to dot */}
            <div
              className={`absolute left-1/2 w-0.5 -translate-x-1/2 timeline-line ${
                index % 2 === 0
                  ? 'bottom-4 h-8'
                  : 'top-4 h-8'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 