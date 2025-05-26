'use client'; // Required for using hooks like useState

import Image from 'next/image';
import Head from 'next/head'; // Import Head for preloading
// No longer need useState for menu open/close, DropdownMenu handles it.
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Menu as MenuIcon } from 'lucide-react'; // Using Menu from lucide-react
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Added Accordion imports
import { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, AND useRef
import SiteHeader from '@/components/layout/SiteHeader'; // Import the new SiteHeader

export default function NewFaqPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  // No direct ref for the scrollable element, will use querySelector

  useEffect(() => {
    console.log("Effect for PARENT (.mobile-gallery-container.faq-page) scroll listener runs...");

    const scrollableParentDiv = document.querySelector('.mobile-gallery-container.faq-page') as HTMLElement | null;

    if (!scrollableParentDiv) {
      console.error("FAILED to find .mobile-gallery-container.faq-page element!");
      return; 
    }
    console.log("Found scrollable parent div:", scrollableParentDiv);
    // Ensure this parent div is actually what's scrollable if it wasn't already
    // It should be if window scroll events were targeting it.
    // scrollableParentDiv.style.overflowY = 'auto'; // Might be redundant if already styled
    // scrollableParentDiv.style.height = '100vh'; // Or some other constraint to make IT scrollable


    const handleScroll = () => {
      const currentScrollY = scrollableParentDiv.scrollTop;
      const scrollDifference = lastScrollY.current - currentScrollY;

      if (currentScrollY === 0) {
        if (!isHeaderVisible) setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 30) { // Scrolling Down
        if (isHeaderVisible) setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current && scrollDifference > 10) { // Scrolling Up by a decent amount
        if (!isHeaderVisible) setIsHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    scrollableParentDiv.addEventListener('scroll', handleScroll, { passive: true });
    console.log("Attached handleScroll to .mobile-gallery-container.faq-page.");

    return () => {
      console.log("Cleaning up scroll listener from .mobile-gallery-container.faq-page...");
      if (scrollableParentDiv) { 
        scrollableParentDiv.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isHeaderVisible]); // Dependency on isHeaderVisible is important for the closure

  return (
    <>
      <Head>
        <link rel="preload" href="/images/faq-bg.png" as="image" />
      </Head>
      <style jsx global>{`
        .gallery-header { 
          /* background: rgba(50, 50, 70, 0.8); */ /* Test background REMOVED */
          width: 100%; 
          /* box-shadow: 0 2px 4px rgba(0,0,0,0.1); */ /* Test box-shadow REMOVED */
          will-change: transform;
          /* transform: translateZ(0); */
        }
        .gallery-header.hidden-header {
          transform: translateY(-100%);
          transition-property: transform, visibility;
          transition-duration: 0.15s; /* Faster hide duration */
          transition-timing-function: ease-in-out; /* Adjusted easing */
          transition-delay: 0s, 0.15s; /* Visibility hidden AFTER faster transform */
          visibility: hidden;
          /* border-bottom: 3px solid red; */ /* DEBUG REMOVED */
        }
        .gallery-header.visible-header {
          transform: translateY(0);
          transition-property: transform, visibility;
          transition-duration: 0.25s; /* Kept at 0.25s for showing */
          transition-timing-function: ease-in-out; /* Adjusted easing */
          transition-delay: 0s, 0s; /* Visibility visible immediately */
          visibility: visible;
          /* border-bottom: 3px solid lime; */ /* DEBUG REMOVED */
        }
      `}</style>
      {/* The ref is removed from main, as .mobile-gallery-container is the scroll target */}
      <div className="mobile-gallery-container faq-page pt-8" style={{ backgroundImage: 'url(/images/faq-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <SiteHeader className={isHeaderVisible ? 'visible-header' : 'hidden-header'} />
        <main 
          className="gallery-main" 
          style={{ 
            paddingBottom: '15vh', 
            /* overflowY: 'auto', // This might not be needed if parent scrolls */
            /* maxHeight: 'calc(100vh - 120px)' // Also might not be needed */
          }}
        >
          <div className="artwork-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Lights image is kept if desired, or can be removed if the FAQ section should be cleaner */}
            <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" style={{ marginBottom: '5vh'}} />

            <div className="w-full max-w-2xl px-4"> {/* Added container for accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="kids" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    Can I bring my kids?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    While we love your little ones, both wedding events will be adults-only except for our immediate nieces and nephews. We hope that you will still be able to join us to celebrate!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dress-code" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    What should I wear?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    <p className="mb-4"><b>Friday:</b> For the Hindu ceremony at Queen&apos;s Manor Event Centre, Indian Formal is recommended if you happen to have it! Anything from shalwar kameez to saris, or from sherwanis to kurtas. If you don&apos;t already have any Indian attire any respectful formal attire will be equally well suited to the occasion. What&apos;s most important is that you feel comfortable to come celebrate with us.</p>
                    <p><b>Saturday:</b> For our wedding at the Art Gallery of Hamilton, the dress code is formal and VIBRANT! What &quot;vibrant&quot; means is entirely up to the wearer. Again, no need to purchase anything specific or push your comfort zone. We simply hope that in fitting the art gallery theme, you wear something fun, bold and bright  – anything that makes you feel vivacious! We&apos;ll check the weather leading up to the day to adjust if needed, but note that we&apos;re hoping the daytime ceremony will be outside, reception inside. There will be an inside rain plan if needed.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="registry" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    Do you have a gifts registry?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    <p className="mb-4">Your presence is the greatest gift of all! ♥ Should you wish to give us a gift, we would gratefully accept contributions to a honeymoon fund (or for dangerous adventures abroad.)</p>
                    <p>We will have a box at the venues for cards, and/or if you prefer to be cashless our e-transfer joint account is: neilandchels@gmail.com</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="one-event" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    Is it okay if I only attend one of the events?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    Of course! We love and appreciate all of you, and entirely understand if you can&apos;t make it to both. You are all very welcome to come to either event! Please RSVP accordingly and we look forward to seeing you at what&apos;s feasible for you.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dietary" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    What if I have allergies / dietary restrictions?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    We should be able to accommodate for all of your allergies or dietary restrictions (for both events), however please make sure to let us know in your RSVP. You can reach out to us also if you have any other concerns. Our venues are optimistic they can find something delicious for even the most difficult of allergies!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="stay" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    Where should I stay?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    We&apos;ll be staying at the <a href="https://www.marriott.com/en-us/hotels/yhmsi-sheraton-hamilton-hotel/overview/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Sheraton Hamilton Hotel</a> located steps away from the venue. We&apos;re not doing a fixed block of rooms, but we get a preferred rate through the Art Gallery of Hamilton. If you&apos;d be interested in staying there as well we certainly encourage all efforts to party with us late! Reach out for details.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parking" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    I plan on driving. Where should I park?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    <p className="mb-4"><b>Friday:</b> There&apos;s boundless parking at the venue! Seamless and easy.</p>
                    <p><b>Saturday:</b> For the Art Gallery of Hamilton there&apos;s ample paid lots nearby. The nearest paid lots are around Jackson Square. Street parking is $2/hr at any meter, or the paid lots should have comparable weekend flat rates.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="photos" className="border-b border-white/50 py-4">
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    Can I take photos during the wedding ceremony?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    We kindly ask that you refrain from taking photos during the ceremonies. We have professional photographers who will capture these special moments, ideally without phones in them! We encourage you to be present with us during the ceremonies and enjoy taking tons of photos during the reception.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cancel" className="border-b border-white/50 py-4"> {/* Added border-bottom back */}
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    What if I need to cancel?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    It happens! If you need to cancel after RSVP&apos;ing &quot;yes,&quot; <b>please let us know</b> as soon as possible so that we can accommodate.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="poems" className="py-4"> {/* New last item, no bottom border */}
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    What are some of your favourite poems?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="chelsea-poem" className="border-b border-white/30 py-3">
                        <AccordionTrigger className="hover:no-underline text-white/85 text-md justify-between w-full">
                          Chelsea
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 text-white/75 text-sm">
                          <h4 className="font-semibold text-white/100 mb-2">DON&apos;T HESITATE</h4>
                          <p dangerouslySetInnerHTML={{ __html: `If you suddenly and unexpectedly feel joy,<br />don\'t hesitate. Give in to it. There are plenty<br />of lives and whole towns destroyed<br />or about to be. We are not wise, and not very often<br />kind. And much can never be redeemed.<br />Still, life has some possibility left. Perhaps this<br />is its way of fighting back, that sometimes<br />something happens better than all the riches<br />or power in the world. It could be anything,<br />but very likely you notice it in the instant<br />when love begins. Anyway, that&apos;s often the<br />case. Anyway, whatever it is, don&apos;t be afraid<br />of its plenty. Joy is not made to be a crumb.` }} />
                          <p className="italic text-white/80 mt-2 mb-2"><em>Mary Oliver</em></p>
                          <p className="mt-3 text-white/75">BUT ALSO, read &quot;<a href="http://www.phys.unm.edu/~tw/fas/yits/archive/oliver_wildgeese.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Wild Geese</a>&quot; and &quot;<a href="https://www.poetseers.org/contemporary-poets/mary-oliver/mary-oliver-poems/dogfish/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Dogfish</a>&quot; and everything else by Mary Oliver, we love her</p>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="neil-poem" className="py-3"> {/* Last sub-item */}
                        <AccordionTrigger className="hover:no-underline text-white/85 text-md justify-between w-full">
                          Neil
                        </AccordionTrigger>
                        <AccordionContent className="pt-3 text-white/75 text-sm">
                          <h4 className="font-semibold text-white/100 mb-2">WHAT I DIDN&apos;T KNOW BEFORE</h4>
                          <p dangerouslySetInnerHTML={{ __html: `was how horses simply give birth to other<br />horses. Not a baby by any means, not<br />a creature of liminal spaces, but already<br />a four-legged beast hellbent on walking,<br />scrambling after the mother. A horse gives way<br />to another horse and then suddenly there are<br />two horses, just like that. That&apos;s how I loved you.<br />You, off the long train from Red Bank carrying<br />a coffee as big as your arm, a bag with two<br />computers swinging in it unwieldy at your<br />side. I remember we broke into laughter<br />when we saw each other. What was between<br />us wasn&apos;t a fragile thing to be coddled, cooed<br />over. It came out fully formed, ready to run.` }} />
                          <p className="italic text-white/80 mt-2 mb-2"><em>Ada Limon</em></p>
                          <p className="mt-3 text-white/75">Another personal favourite (that&apos;s slightly less fitting for the occasion) is &quot;<a href="https://www.poetryfoundation.org/poems/47993/famous" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Famous</a>&quot; by Naomi Shihab Nye</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
          {/* Bench container removed as per the visual of the new FAQ page */}
          {/* If a scroll down indicator is needed like in the image, it can be added here */}
          {/* Example: */}
          {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2"> */}
          {/*  <ChevronDown className="h-8 w-8 text-white/70 animate-bounce" /> */}
          {/* </div> */}
        </main>
      </div>
    </>
  );
} 