'use client';

import Image from 'next/image';
import React, { useState, TouchEvent, useEffect, useRef, useCallback } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    src: '/images/story/1.png',
    alt: 'Story image 1',
    title: 'Our First Adventure',
    details: 'Artist Name - 2023',
    originalWidth: 800, // Placeholder - UPDATE MANUALLY
    originalHeight: 600, // Placeholder - UPDATE MANUALLY
    description: 'This was a truly memorable adventure. We climbed mountains, crossed rivers, and saw breathtaking views. The air was crisp, and the company was even better. Placeholder text to demonstrate a longer description that might need to scroll within the overlay.',
  },
  {
    id: 'story2',
    src: '/images/story/2.png',
    alt: 'Story image 2',
    title: 'A Moment in Time',
    details: 'Photographer X - 2024',
    originalWidth: 700, // Placeholder - UPDATE MANUALLY
    originalHeight: 850, // Placeholder - UPDATE MANUALLY
    description: 'Captured by the talented Photographer X, this moment reflects a serene afternoon. The play of light and shadow was just perfect. This text is a bit shorter, but still serves as a good example for the overlay content.',
  },
  {
    id: 'story3',
    src: '/images/story/3.png',
    alt: 'Story image 3',
    title: 'Whispers of Affection',
    details: 'Captured Memories - 2022',
    originalWidth: 600, // Placeholder - UPDATE MANUALLY
    originalHeight: 800, // Placeholder - UPDATE MANUALLY
    description: 'In the soft glow of the evening sun, their silhouettes merged, a testament to a love that speaks in hushed tones and gentle touches. This quiet scene holds a universe of shared dreams and unspoken understanding. The world around them faded, leaving only the warmth of their connection.',
  },
  {
    id: 'story4',
    src: '/images/story/4.png',
    alt: 'Story image 4',
    title: 'Golden Hour Serenade',
    details: 'Nature\'s Palette - 2023',
    originalWidth: 1000, // Placeholder - UPDATE MANUALLY
    originalHeight: 700, // Placeholder - UPDATE MANUALLY
    description: 'As the sun dipped below the horizon, painting the sky in hues of orange, pink, and gold, they stood hand in hand, a small part of a grand masterpiece. The air was still, the only sound the distant call of a bird. It was a perfect end to a perfect day, a memory etched in the vibrant colours of the sunset, a beautiful pause in their journey together, appreciating the beauty surrounding them.',
  },
  {
    id: 'story5',
    src: '/images/story/5.png',
    alt: 'Story image 5',
    title: 'The Promise of Forever',
    details: 'Eternal Vows - 2024',
    originalWidth: 750, // Placeholder - UPDATE MANUALLY
    originalHeight: 750, // Placeholder - UPDATE MANUALLY
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi. This extended placeholder text is designed to test the scrolling capabilities of the overlay and ensure that longer narratives can be comfortably read by users exploring the story behind each image. It signifies a deep, meaningful moment that requires more than just a few words to describe its essence and impact.',
  },
  {
    id: 'story6',
    src: '/images/story/6.png',
    alt: 'Story image 6',
    title: 'A Day to Remember',
    details: 'Festivities & Joy - 2025',
    originalWidth: 900, // Placeholder - UPDATE MANUALLY
    originalHeight: 600, // Placeholder - UPDATE MANUALLY
    description: 'The laughter echoed, the music played, and joy filled the air. This was more than an event; it was the beautiful culmination of a journey and the beginning of another, surrounded by cherished friends and family. Every detail was perfect, every smile genuine.',
  },
  {
    id: 'story7',
    src: '/images/story/7.png',
    alt: 'Story image 7',
    title: 'Journeying Together',
    details: 'Explorers at Heart - 2023',
    originalWidth: 500, // Placeholder - UPDATE MANUALLY
    originalHeight: 700, // Placeholder - UPDATE MANUALLY
    description: 'With maps in hand and excitement in their eyes, they embarked on another adventure. Each new discovery, each shared experience, wove another thread into the rich tapestry of their life together. The path ahead was unknown, but they faced it with courage and love, eager for what lay beyond the next horizon, always side by side.',
  },
  {
    id: 'story8',
    src: '/images/story/8.png',
    alt: 'Story image 8',
    title: 'Another Chapter',
    details: 'Moments - 2023',
    originalWidth: 800, // Placeholder - UPDATE MANUALLY
    originalHeight: 600, // Placeholder - UPDATE MANUALLY
    description: 'Placeholder description for story 8.',
  },
  {
    id: 'story9',
    src: '/images/story/9.png',
    alt: 'Story image 9',
    title: 'Looking Ahead',
    details: 'Future - 2023',
    originalWidth: 800, // Placeholder - UPDATE MANUALLY
    originalHeight: 600, // Placeholder - UPDATE MANUALLY
    description: 'Placeholder description for story 9.',
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
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const overlayRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Preload all story images when the component mounts
    let loadedImagesCount = 0;
    if (storyItems.length === 0) {
      setIsLoading(false);
      return;
    }
    storyItems.forEach(item => {
      const img = new window.Image();
      img.src = item.src;
      img.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === storyItems.length) {
          setIsLoading(false); // All images loaded
        }
      };
      img.onerror = () => {
        loadedImagesCount++; // Count errors as "loaded" to not block forever
        if (loadedImagesCount === storyItems.length) {
          setIsLoading(false);
        }
        // Optionally, handle image loading errors, e.g., log them
        console.error(`Failed to load image: ${item.src}`);
      };
    });
  }, []); // Empty dependency array ensures this runs only once on mount

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

  const nextItem = useCallback(() => {
    setIsOverlayVisible(false); // Hide overlay when navigating
    setCurrentIndex((prevIndex) => (prevIndex + 1) % storyItems.length);
  }, []);

  const prevItem = useCallback(() => {
    setIsOverlayVisible(false); // Hide overlay when navigating
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? storyItems.length - 1 : prevIndex - 1
    );
  }, []);

  // Add global keyboard navigation for arrow keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOverlayVisible) return; // Don't navigate if overlay is visible

      if (event.key === 'ArrowLeft') {
        prevItem();
      } else if (event.key === 'ArrowRight') {
        nextItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOverlayVisible, prevItem, nextItem]);

  const handleImageClick = (description: string) => {
    setSelectedStoryDescription(description);
    setIsOverlayVisible(true);
    // The useEffect for scroll check will run after this state update
  };

  // New function to toggle overlay visibility
  const toggleOverlay = () => {
    if (isOverlayVisible) {
      setIsOverlayVisible(false);
    } else {
      // Ensure currentStory is available before calling handleImageClick
      if (currentStory) {
        handleImageClick(currentStory.description);
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent click from bubbling to framed-artwork-story
    setIsOverlayVisible(false);
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
    <>
      <style jsx>{`
        .artwork-image-story-animated {
          animation: fadeInStoryImage 0.5s ease-in-out;
          width: fit-content; 
          max-width: 100%; 
          height: 100%; 
          display: flex; 
          align-items: center;
          justify-content: center;
          border: 6px solid white !important; 
          padding: 2px !important; /* Default padding for larger screens */
          position: relative; 
          box-sizing: border-box !important; 
          overflow: hidden !important; 
        }
        @media (max-width: 768px) {
          .artwork-image-story-animated {
            padding: 0px !important; /* No padding on mobile */
          }
        }
        @keyframes fadeInStoryImage {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh; /* Full viewport height */
          width: 100%;
          /* font-size: 1.5rem; Removed as we are using a spinner now */
          /* color: white; Removed as spinner will have its own color */
        }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff; /* White color for the spinning part */
          width: 50px;
          height: 50px;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="mobile-gallery-container">
        <SiteHeader />
        
        <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" />

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div> {/* Spinner element */}
          </div>
        ) : (
          <main className="gallery-main-story" 
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove} 
            onTouchEnd={handleTouchEnd}
          >
            <div className="story-content-container">
              <div className="arrow left-arrow" onClick={prevItem}>
                <ChevronLeft size={40} />
              </div>
              <div className="framed-artwork-story" onClick={toggleOverlay}>
                  {currentStory && (
                      <div 
                        key={animationTriggerKey} 
                        className="artwork-image-story-animated story-image-white-frame"
                      >
                          <Image
                              src={currentStory.src}
                              alt={currentStory.alt}
                              width={currentStory.originalWidth}
                              height={currentStory.originalHeight}
                              className="artwork-image-story"
                              priority
                          />
                      </div>
                  )}
                  <Image 
                    key={`hint-${animationTriggerKey}`}
                    src="/click.svg"
                    alt="Click for details" 
                    width={50} 
                    height={50} 
                    className="clickable-image-hint"
                  />
                  {isOverlayVisible && selectedStoryDescription && (
                    <div 
                      ref={overlayRef}
                      className={`image-text-overlay visible ${overlayContentIsScrollable ? 'has-scrollable-content' : ''}`}
                      onClick={handleOverlayClick}
                    >
                      <p ref={paragraphRef}>{selectedStoryDescription}</p>
                    </div>
                  )}
              </div>
              <div className="arrow right-arrow" onClick={nextItem}>
                <ChevronRight size={40} />
              </div>
            </div>

            <div 
              className="plaque-story" 
              onClick={toggleOverlay}
            >
              <h3>{currentStory.title}</h3>
              <p>{currentStory.details}</p>
            </div>
          </main>
        )}

        <div className="bench-container">
          <Image src="/images/bench.png" alt="Gallery bench" width={800} height={200} className="bench-image" />
        </div>
      </div>
    </>
  );
} 