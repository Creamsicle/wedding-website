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
    title: 'Opening Theory',
    details: 'Linda Arki\n1/10',
    originalWidth: 1170,
    originalHeight: 1525,
    description: `<b>NG:</b> I wish I was cool enough to claim it was love at first sight. Technically, it was our second but I won't spoil the gallery to come.

We first met on the busiest night my weekly Pub Chess meetup has ever seen (Wednesdays at 7:30 at the Madison Avenue Pub, come by!) Most nights we pull in ~60 players. That night? Over 150. The world\'s #1 chess player was in town and a crowd of hopeful fans were buzzing to see him. 

He dropped by! The evening instantly turned into sloppy, joyful, unbridled chaos. I was darting between tables, barely able to speak to anyone for more than a moment. But meeting one person stood out far more than meeting the chess world champion — not just because she was, quite frankly, the most beautiful person I\'d ever seen — but because in the briefest of exchanges, when she smiled, the world suddenly became a more vibrant place.

Then, just as quickly, the maelstrom pulled me back. I figured I\'d probably never see her again; what a shame!`,
  },
  {
    id: 'story2',
    src: '/images/story/2.png',
    alt: 'Story image 2',
    title: 'Elastic Connection',
    details: 'IG Story Screenshot\n2/10',
    originalWidth: 1170,
    originalHeight: 1540,
    description: `<b>CV:</b> I barely made it to the rave. I was exhausted and had come back from another city, but my friends were (gratefully) persistent, I lived very close, <i>and</i> I had a ticket. Sometimes you don't have a choice. You have to go dance.

Grand Bizarre, if you haven't been there, is the most gorgeous venue in Toronto. Their outdoor space has elegant, secret-garden-like hanging flowers, cute wooden cabana bars with expensive gin & tonics, and POOLS that nobody (but maybe me later) would be swimming in.

My friends had brought an addition to our group: Neil! I was psyched to chat with someone new. He said he ran the chess club which was wild, since I had been a dozen times and had only ran into him <i>once</i>. Dubious, but I entertained that this could be true. 

Immediately Neil was engaging, hilarious, and genuinely so kind, to every person and every stranger. We made sure that every set of selfie-takers could have a photo taken for them as well, with either of our long-armed photo-taking skills. Importantly, Neil supported my critical missions to liberate drinks from the VIP section, and flagged symbols from afar to signify the status of security's trail. We chatted, played word games, imagined hyperbolic situations, and connected on nearly every topic. I had never felt so connected and aligned with someone. 

At one point, Neil put our hands flat against each other to touch fingertips. (They fit so well!) He rolled his earth-toned bead bracelet over his hand, onto mine. He told me to keep it. What! A completely unexpected, heartfelt, and intimate gift… who does that, who gives something so beautiful away to someone that they just met? I was overwhelmed with the feeling of the gesture. More than just the gift, but the ease and freedom in which Neil gave, helped, and laughed with everyone. I knew it then (I know it now), that he… is perfect. 

Before the end of the night, Neil said he had to leave for a birthday party and I was devastated. But I'd find him, I had to.`,
  },
  {
    id: 'story3',
    src: '/images/story/3.png',
    alt: 'Story image 3',
    title: 'Colliding',
    details: 'Michael Sousa\n3/10',
    originalWidth: 1170,
    originalHeight: 880,
    description: `<b>NG:</b> The very next Wednesday after the rave, Chels tracked me down at Pub Chess. Well that's where we'd met, <i>nothing</i> suspicious there. She mentioned she was looking for a job at a tech startup: <i>oddly</i> convenient, because I had just co-founded one with two close friends. We even had a booth at the biggest tech conference in North America the following week. How delightfully serendipitous! No way she could've possibly uncovered that info from, say, my LinkedIn over the past few days. 

Well, if Chels was job hunting, the least I could do was help her network. About 30 minutes before a "networking boat cruise," I texted her saying it was probably too late for this one, but she should come to the evening events after. She instantly replied, "I'll make the boat," jumped in an Uber, read half our pitch deck en route, and snuck on board as "my co-founder who just landed and definitely, totally has a real admission wristband."

From that point on, Chels became an absolute force on our team. I figured she'd work the room a bit, maybe hand out a business card for us, but ultimately focus on finding someone who's hiring. Instead, she started pitching like she was born doing it. That night alone, we made several major connections thanks to her. She kept showing up and dramatically over-delivered. By the end of the week, she wasn't just crashing events. She was a co-founder.

I'm equal parts excited and terrified. I was hopelessly in love with someone I now technically managed: not my finest HR strategy. With no possible clear signals she might feel the same way, I decided the only responsible thing to do was keep it strictly professional.`,
  },
  {
    id: 'story3half',
    src: '/images/story/3half.png',
    alt: 'Story image 3.5',
    title: 'Fallsing for You',
    details: 'Ali Waseem\n4/10',
    originalWidth: 2268,
    originalHeight: 3370,
    description: `<b>CV:</b> After weeks of being strictly professional (driving me insane), Neil calls me at 10pm on a Tuesday.  "Want to go on an adventure right now? I'll pick you up." He offers details if I want them. I don't want them. I tactically don all black and my running shoes (for our likely-needed criminal getaway). 

He picks me up and I'm whisked to Niagara Falls. We're with one of his oldest friends (who sneakily took this picture I didn't know existed until now!!) and we take turns playing songs for each other in the car, learning about each other through vulnerable memories attached to the music. (It's a phenomenal game and date idea. Write that down!) The Falls are beautiful at night and fittingly, ravey. 

I was already in love with Neil, but this was clear progress... and seemingly mutual! More like a date than anything we'd done before! He MUST know that we're meant for each other.`,
  },
  {
    id: 'story4',
    src: '/images/story/4.png',
    alt: 'Story image 4',
    title: 'Love is Real',
    details: "Neil's Lockscreen\n5/10",
    originalWidth: 1170,
    originalHeight: 1360,
    description: `<b>NG:</b> We're at our third rave together in six weeks. Strictly professional business raves, of course. Around 1 AM, Chels leans over and asks, "Do you want to go swimming?" I'm in. Honestly, I would've said yes to just about anything she suggested. She simply nods and says, "Okay great, we'll get back to that."

At 3 AM she turns to me and says "It's time." Delightedly lost, I tell our friends we're leaving. They look at me, and then look at her, and then smile. Man, if only she was into me too. 

We start walking. And running. And talking. And holding hands. Barefoot, no less, through High Park in the middle of the night. Somehow, without quite noticing, I've crossed half of Toronto with my favourite person in the world — ending up at the edge of Lake Ontario. All part of Chels' master plan!

We take a quick dip, and afterwards we're curled up together for warmth as the sun rises. It's… deeply romantic. Look, I'm a firm believer in separating your work and personal life but maybe at this point, somehow, she feels even a fraction of the way that I do about her. I tentatively, hesitantly ask her out; she responds with an enthusiasm that makes me giggle to this day.`,
  },
  {
    id: 'story5',
    src: '/images/story/5.png',
    alt: 'Story image 5',
    title: 'Chasing Rainbows',
    details: 'Unknown CNE Stranger\n6/10',
    originalWidth: 1170,
    originalHeight: 1546,
    description: `<b>CV:</b> Thank god Neil was into me. I had been telling my friends for weeks that we were going to get married.

Spending time with Neil is very special, and I know that anyone who knows him understands this. Time flies peacefully and splendidly because everything can be made silly; every task can be made easy; and every trivia question can be answered.

He meets all of my friends at dances and the CNE, they instantly love him (who wouldn't)! He takes me to his friends' weddings and we laugh about how it seems like we're an early, new couple (and going to weddings, and family events together would be "unwise" so early) but we know how we feel, and the gravity of it. Love is real and it is wonderful. I am so lucky.`,
  },
  {
    id: 'story6',
    src: '/images/story/6.png',
    alt: 'Story image 6',
    title: 'My Favourite Painter',
    details: 'Sherif Darrag\n7/10',
    originalWidth: 1170,
    originalHeight: 1545,
    description: `<b>CV:</b> We've always loved art, individually and together. 

One of Neil's favourite paintings is Sunflowers by Van Gogh. An excellent Dutch painter! A quick project for me using some thrifted clothing, quick arts + crafts, paint on a shirt, one (+1) reddish beard, and minus one (-1) ear brought us back to Vincent's 1888 for Halloween.

For our first anniversary, as an ode to our love for art, we bought passes to the Art Gallery of Ontario (AGO) to explore and look at art together. Definitely recommend checking it out, especially the vibrant modern art floor, the rotating new exhibitions, and the extensively delicate ship models in the basement… ahoy!`,
  },
  {
    id: 'story7',
    src: '/images/story/7.png',
    alt: 'Story image 7',
    title: 'Lost in Lisbon',
    details: 'Chandler Ferry\n8/10',
    originalWidth: 1170,
    originalHeight: 1538,
    description: `<b>CV:</b> Our first trip abroad and it's for the largest tech summit in the world: Web Summit in Lisbon! We expect to mainly work, and explore/enjoy what we can in between conference events. It's camp again, together! 

For the true Lisbon experience we stayed atop a hill with many steps and stairs, for our thighs to enjoy many times a day. Each flight = 1 earned pastel de nata. But mostly we ate pre-prepared grocery store salads to save time for fixing bugs before showtime, akin to regular life. Turns out that with the right people, even the mundane is incredible. 

After Lisbon we were able to sell the company. Closing one chapter, opening a new one.
So, so, psyched that we weren't just coworkers.`,
  },
  {
    id: 'story8',
    src: '/images/story/8.png',
    alt: 'Story image 8',
    title: "You're My Home",
    details: 'NG\n9/10',
    originalWidth: 1170,
    originalHeight: 1540,
    description: `<b>CV:</b> We talked about moving in, and realized — wait, what if we buy it??!! I sat on the floor of Neil's old apartment, in SHOCK after signing the contract for the most money I've ever seen in my life. A mortgage is crazy, and it's hilarious that we can have one (together). 

After signing, Neil convinced me we should paint our walls. A celebration of no longer renting! He started bartering with, <i>oh maybe, one wall</i>. After countless trips to Ikea (where you MUST go as you make a home (because of the $1 hot dogs)), a beautiful, vibrant, warm terracotta on their walls inspired me to decide… let's paint ALL of our walls! Orange! My past experience as a <i>College-Pro</i> painter (shout-out to my boss, my sister Heidi) was serendipitously exercised as we cut allllll those lines and corners. I love our orange home. But also, I love that even if we did not have it, I know who is my home.`,
  },
  {
    id: 'story9',
    src: '/images/story/9.png',
    alt: 'Story image 9',
    title: 'Looking Ahead',
    details: 'Caitlin Baker\n10/10',
    originalWidth: 1170,
    originalHeight: 1525,
    description: `<b>NG:</b> In January 2024, we were chatting about resolutions. Chels immediately made one specific goal clear. Honestly? I was thrilled. Clear expectations <i>and</i> a green light to propose? Sign me up.

    <b>Step 1:</b> Learn everything there is to know about engagement rings. Discover padparadscha sapphires (AKA lotus sapphires) and realize they'd be the perfect fusion of cultures when paired with a Dutch tulip-inspired setting. Find an award-winning lapidary (and learn what a lapidary is) who could cut a custom petal pattern into the stone to tie it all together. 

    <b>Step 2:</b> Convince Chels there's no way a ring could be ready in time. She should definitely, absolutely not be suspicious of the impromptu road trip I planned in November.

    <b>Step 3:</b> I had my heart set on the Falls: the destination of our first spontaneous adventure together. Team up with a local Niagara photographer to find the perfect spot to propose. Surely nothing could go wrong.

    <b>Step 4:</b> Tell Chels to pack her passport, who knows how far we'll go? Drive to Niagara. Walk her to the exact pre-scouted spot… which, currently, is the only place in the entire city where it's raining. Buy time for the photographer while getting soaked for ostensibly no reason. Pop the question, Chels somehow says "yes" (I'm so lucky!)

    <b>Step 5:</b> Today is where our book begins, the rest is still unwritten! Thanks for coming to our special day and being a part of our unfurling story <3 `,
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
  const [isMobileView, setIsMobileView] = useState(false); // State for mobile view

  const overlayRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Determine if it's mobile view on initial load
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 769);
    };
    handleResize(); // Set initial value
    // Note: We are not adding a resize listener to keep the image fixed after initial load
  }, []);

  useEffect(() => {
    // Preload all story images when the component mounts
    if (storyItems.length === 0) {
      setIsLoading(false);
      return;
    }

    let successfulLoads = 0;
    const totalImages = storyItems.length;

    storyItems.forEach(item => {
      const img = new window.Image();
      img.src = item.src;
      img.onload = () => {
        successfulLoads++;
        if (successfulLoads === totalImages) {
          setIsLoading(false); // All images loaded successfully
        }
      };
      img.onerror = () => {
        // If an image fails to load, isLoading remains true,
        // and the spinner continues to show.
        console.error(`Failed to load image: ${item.src}`);
        // Optionally, you could implement a retry mechanism or show a specific error state here.
        // For now, we prevent the gallery from loading if any image fails.
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
          display: flex; 
          align-items: center;
          justify-content: center;
          border: 8px solid white !important; /* Changed to 8px white */
          padding: 0 !important; 
          position: relative; 
          box-sizing: border-box !important; 
          overflow: hidden !important; 
          max-width: 100%; 
          max-height: 100%; 
          border-radius: 2px; /* Changed to 2px */
          box-shadow: 0 0 0 12px black; /* 12px black "outline" for desktop */
        }
        .framed-artwork-story { 
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%; 
          height: 100%; 
          padding: 16px; /* Increased to 16px for new box-shadow */
          box-sizing: border-box;
          border: 1px solid transparent; 
          position: relative; 
        }
        .plaque-story {
          text-align: left; /* Added to align text left */
        }
        @media (max-width: 768px) {
          .artwork-image-story-animated {
            padding: 0 !important; /* No padding on mobile - white border acts as padding */
            /* Ensure width and height allow for aspect ratio scaling */
            /* width: 100%; Let it take full width of parent - Removed, max-width and aspect-ratio handle it */
            /* height will be determined by aspect ratio of image via its child - Handled by aspect-ratio */
            box-shadow: 0 0 0 16px black; /* Restore 16px black "outline" for mobile */
          }
          .framed-artwork-story {
            padding: 0; /* Smaller padding for black frame on mobile -> Changed to 0 */
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
        .image-text-overlay p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.4;
          white-space: pre-line; /* Added to preserve line breaks */
        }
        /* Responsive text size for overlay if needed */
        /* The local .image-text-overlay CSS rules that were here have been removed to use global styles. */
      `}</style>
      <div className="mobile-gallery-container">
        <SiteHeader />
        
        {isMobileView ? (
          <Image src="/images/Lights2.png" alt="Gallery lights mobile" width={1000} height={100} className="lights-image" />
        ) : (
          <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" />
        )}

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
                        style={{ aspectRatio: `${currentStory.originalWidth} / ${currentStory.originalHeight}` }}
                      >
                          <Image
                              src={currentStory.src}
                              alt={currentStory.alt}
                              width={currentStory.originalWidth}
                              height={currentStory.originalHeight}
                              className="artwork-image-story"
                              priority
                              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                          />
                          {isOverlayVisible && selectedStoryDescription && (
                            <div 
                              ref={overlayRef}
                              className={`image-text-overlay visible ${overlayContentIsScrollable ? 'has-scrollable-content' : ''}`}
                              onClick={handleOverlayClick}
                            >
                              <p ref={paragraphRef} dangerouslySetInnerHTML={{ __html: selectedStoryDescription }} />
                            </div>
                          )}
                          <Image 
                            key={`hint-${animationTriggerKey}`}
                            src="/click.svg"
                            alt="Click for details" 
                            width={50} 
                            height={50} 
                            className={"clickable-image-hint"}
                          />
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
              <p>
                {currentStory.details.split('\n').map((line, index, array) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < array.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
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