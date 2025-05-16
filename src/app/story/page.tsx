'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu as MenuIcon } from 'lucide-react';
import React, { useState, TouchEvent, useEffect, useRef } from 'react';

// Define the structure for a story item
interface StoryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  details: string;
  originalWidth: number;
  originalHeight: number;
  description: string; // Added for overlay text
}

// Array of story items (carousel slides)
const storyItems: StoryItem[] = [
  {
    id: 'story1',
    src: '/images/placeholder1.webp', // User provided
    alt: 'First story image',
    title: 'Our First Adventure',
    details: 'Artist Name - 2023',
    originalWidth: 800, // Assuming dimensions, replace with actual
    originalHeight: 600,
    description: 'This was a truly memorable adventure. We climbed mountains, crossed rivers, and saw breathtaking views. The air was crisp, and the company was even better. Placeholder text to demonstrate a longer description that might need to scroll within the overlay.',
  },
  {
    id: 'story2',
    src: '/images/placeholder2.jpg', // User provided
    alt: 'Second story image',
    title: 'A Moment in Time',
    details: 'Photographer X - 2024',
    originalWidth: 700, // Assuming dimensions, replace with actual
    originalHeight: 850, 
    description: 'Captured by the talented Photographer X, this moment reflects a serene afternoon. The play of light and shadow was just perfect. This text is a bit shorter, but still serves as a good example for the overlay content.',
  },
  {
    id: 'story3',
    src: 'https://source.unsplash.com/600x800/?romantic,couple,love',
    alt: 'Romantic couple in a tender moment',
    title: 'Whispers of Affection',
    details: 'Captured Memories - 2022',
    originalWidth: 600,
    originalHeight: 800,
    description: 'In the soft glow of the evening sun, their silhouettes merged, a testament to a love that speaks in hushed tones and gentle touches. This quiet scene holds a universe of shared dreams and unspoken understanding. The world around them faded, leaving only the warmth of their connection.',
  },
  {
    id: 'story4',
    src: 'https://source.unsplash.com/1000x700/?love,sunset,romance',
    alt: 'Couple enjoying a vibrant sunset',
    title: 'Golden Hour Serenade',
    details: 'Nature\'s Palette - 2023',
    originalWidth: 1000,
    originalHeight: 700,
    description: 'As the sun dipped below the horizon, painting the sky in hues of orange, pink, and gold, they stood hand in hand, a small part of a grand masterpiece. The air was still, the only sound the distant call of a bird. It was a perfect end to a perfect day, a memory etched in the vibrant colours of the sunset, a beautiful pause in their journey together, appreciating the beauty surrounding them.',
  },
  {
    id: 'story5',
    src: 'https://source.unsplash.com/750x750/?engagement,joy,happiness',
    alt: 'Joyful couple celebrating their engagement',
    title: 'The Promise of Forever',
    details: 'Eternal Vows - 2024',
    originalWidth: 750,
    originalHeight: 750,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. This extended placeholder text is designed to test the scrolling capabilities of the overlay and ensure that longer narratives can be comfortably read by users exploring the story behind each image. It signifies a deep, meaningful moment that requires more than just a few words to describe its essence and impact.',
  },
  {
    id: 'story6',
    src: 'https://source.unsplash.com/900x600/?wedding,celebration,love',
    alt: 'Elegant wedding celebration scene',
    title: 'A Day to Remember',
    details: 'Festivities & Joy - 2025',
    originalWidth: 900,
    originalHeight: 600,
    description: 'The laughter echoed, the music played, and joy filled the air. This was more than an event; it was the beautiful culmination of a journey and the beginning of another, surrounded by cherished friends and family. Every detail was perfect, every smile genuine.',
  },
  {
    id: 'story7',
    src: 'https://source.unsplash.com/500x700/?adventure,couple,travel',
    alt: 'Adventurous couple exploring a new place',
    title: 'Journeying Together',
    details: 'Explorers at Heart - 2023',
    originalWidth: 500,
    originalHeight: 700,
    description: 'With maps in hand and excitement in their eyes, they embarked on another adventure. Each new discovery, each shared experience, wove another thread into the rich tapestry of their life together. The path ahead was unknown, but they faced it with courage and love, eager for what lay beyond the next horizon, always side by side.',
  },
];

export default function StoryNewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedStoryDescription, setSelectedStoryDescription] = useState<string | null>(null);
  const [animationTriggerKey, setAnimationTriggerKey] = useState(0); // For click hint animation
  const [overlayContentIsScrollable, setOverlayContentIsScrollable] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Trigger animation when current index changes, but not on initial load if not desired
    // For this case, we want it on every image, including the first one.
    setAnimationTriggerKey(prevKey => prevKey + 1);
  }, [currentIndex]);

  useEffect(() => {
    if (isOverlayVisible && overlayRef.current && paragraphRef.current) {
      const isScrollable = paragraphRef.current.scrollHeight > overlayRef.current.clientHeight;
      setOverlayContentIsScrollable(isScrollable);
    } else {
      setOverlayContentIsScrollable(false); // Reset when overlay is not visible
    }
  }, [isOverlayVisible, selectedStoryDescription]); // Re-check when description changes too

  const nextItem = () => {
    setIsOverlayVisible(false); // Hide overlay when navigating
    setCurrentIndex((prevIndex) => (prevIndex + 1) % storyItems.length);
  };

  const prevItem = () => {
    setIsOverlayVisible(false); // Hide overlay when navigating
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? storyItems.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = (description: string) => {
    setSelectedStoryDescription(description);
    setIsOverlayVisible(true);
    // The useEffect for scroll check will run after this state update
  };

  const handleOverlayClick = () => {
    setIsOverlayVisible(false);
    // Optionally clear selectedStoryDescription if needed, but not strictly necessary here
    // setSelectedStoryDescription(null);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (isOverlayVisible) return; // Prevent swipe if overlay is visible
    const firstTouch = e.touches[0];
    setTouchStartX(firstTouch.clientX);
    setTouchStartY(firstTouch.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (isOverlayVisible || touchStartX === null || touchStartY === null) {
      return;
    }
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (isOverlayVisible || touchStartX === null || touchStartY === null) {
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const swipeThreshold = 50;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        nextItem();
      } else {
        prevItem();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const currentStory = storyItems[currentIndex];

  return (
    <div className="mobile-gallery-container">
      <header className="gallery-header">
        <div className="logo">
          <Link href="/">
            <Image src="/logow.png" alt="Logo" width={50} height={50} className="header-logo-image" />
          </Link>
        </div>
        <Link href="/">
          <div className="header-title">CHELSEA & NEIL</div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="menu-icon-button">
              <MenuIcon className="h-6 w-6 menu-actual-icon" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mobile-dropdown-menu-content">
            <DropdownMenuItem asChild>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/events">Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/story">Our Story</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/faq">FAQ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/rsvp">RSVP</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="gallery-main-story">
        <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" />

        <div 
          className="story-content-container" 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove} 
          onTouchEnd={handleTouchEnd}
        >
          <div className="arrow left-arrow" onClick={prevItem} role="button" tabIndex={0} 
               onKeyDown={(e) => e.key === 'Enter' && prevItem()}>
            &lt;
          </div>

          <div className="framed-artwork-story" onClick={() => !isOverlayVisible && handleImageClick(currentStory.description)}>
            <Image 
              key={currentStory.id}
              src={currentStory.src} 
              alt={currentStory.alt} 
              width={currentStory.originalWidth} 
              height={currentStory.originalHeight} 
              className="artwork-image-story" 
              priority={currentIndex === 0}
            />
            
            <Image
              key={`click-hint-${animationTriggerKey}`} // Force re-render to restart animation
              src="/click.svg"
              alt="Click hint"
              width={50} // Adjust size as needed
              height={50} // Adjust size as needed
              className="clickable-image-hint"
            />

            {isOverlayVisible && (
              <div 
                ref={overlayRef}
                className={`image-text-overlay ${isOverlayVisible ? 'visible' : ''} ${overlayContentIsScrollable ? 'has-scrollable-content' : ''}`}
                onClick={(e) => { 
                  e.stopPropagation(); // Prevent click from bubbling to framed-artwork-story
                  handleOverlayClick(); 
                }}
                role="dialog" // Good for accessibility
                aria-modal="true"
                aria-labelledby="overlay-title" // Needs an element with this id if used
              >
                {/* <h4 id="overlay-title" className="sr-only">Image Description</h4> */}
                <p ref={paragraphRef}>{selectedStoryDescription}</p>
              </div>
            )}
          </div>

          <div className="arrow right-arrow" onClick={nextItem} role="button" tabIndex={0} 
               onKeyDown={(e) => e.key === 'Enter' && nextItem()}>
            &gt;
          </div>
        </div>

        <div className="plaque-story">
          <h3>{currentStory.title}</h3>
          <p>{currentStory.details}</p>
        </div>

        <div className="bench-container">
          <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
        </div>
      </main>
    </div>
  );
} 