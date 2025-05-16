'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

// Placeholder images and captions - replace with your actual content
const images = [
  {
    src: '/images/exhibition/placeholder1.jpg',
    alt: 'Exhibition Image 1',
    caption: 'This stunning photograph captures the moment we first met at the local coffee shop. The barista had just misspelled both our names in exactly the same way - destiny has a sense of humor!'
  },
  {
    src: '/images/exhibition/placeholder2.jpg',
    alt: 'Exhibition Image 2',
    caption: 'Our first date was at the Art Gallery of Hamilton. We spent hours discussing art, life, and our shared love of dogs. This photo was taken right after we discovered we both had the same favorite painting.'
  },
  {
    src: '/images/exhibition/placeholder3.jpg',
    alt: 'Exhibition Image 3',
    caption: 'The proposal happened right here, under the stars at Niagara Falls. The mist from the falls created the perfect natural spotlight for our special moment.'
  }
];

export default function ExhibitionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [showInfoHint, setShowInfoHint] = useState(true);

  // Hide info hint after it's been shown once
  useEffect(() => {
    if (showInfoHint) {
      const timer = setTimeout(() => {
        setShowInfoHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setShowCaption(false);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setShowCaption(false);
  };

  const toggleCaption = () => {
    setShowCaption(!showCaption);
    setShowInfoHint(false);
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
      <div className="gallery-spotlight" />

      <div className="gallery-section flex flex-col items-center justify-center min-h-screen">
        <h1 className="gallery-heading mb-16">Our Story in Pictures</h1>
        
        <div className="relative w-full max-w-5xl aspect-[16/9] group">
          {/* Main Image */}
          <div 
            className="relative w-full h-full cursor-pointer"
            onClick={toggleCaption}
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-cover rounded-lg"
              priority
            />
            
            {/* Caption Overlay */}
            <div 
              className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 transition-opacity duration-300 rounded-lg
                ${showCaption ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <p className="text-white text-xl max-w-2xl text-center leading-relaxed">
                {images[currentIndex].caption}
              </p>
            </div>

            {/* Info Hint Animation */}
            {showInfoHint && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 animate-bounce">
                  <Info className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Image Counter */}
        <div className="mt-6 text-white/60">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
} 