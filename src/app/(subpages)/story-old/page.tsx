'use client';

import MondrianTimeline from '@/components/MondrianTimeline';
import { useEffect, useState } from 'react';

export default function StoryPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

      <div className="gallery-section">
        <h1 className="gallery-heading">Our Story</h1>
        <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto text-lg">
          Every love story is beautiful, but ours is my favorite. Here&apos;s a journey through our most cherished moments together.
        </p>
        <MondrianTimeline />
      </div>
    </div>
  );
} 