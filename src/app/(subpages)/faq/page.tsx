'use client'; // Required for using hooks like useState

import Image from 'next/image';
import Link from 'next/link'; // Added Link import
// No longer need useState for menu open/close, DropdownMenu handles it.
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel, // Optional: for a title inside the menu
  DropdownMenuSeparator, // Optional: for a separator line
} from '@/components/ui/dropdown-menu';
import { Menu as MenuIcon } from 'lucide-react'; // Using Menu from lucide-react
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Added Accordion imports

export default function NewFaqPage() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false); // No longer needed

  return (
    <div className="mobile-gallery-container" style={{ backgroundImage: 'url(/images/faq-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <header className="gallery-header">
        <div className="logo">
          <Link href="/"> {/* Added Link wrapper */}
            <Image src="/logow.png" alt="Logo" width={50} height={50} className="header-logo-image" />
          </Link>
        </div>
        <Link href="/"> {/* Added Link wrapper */}
          <div className="header-title">CHELSEA & NEIL</div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="menu-icon-button">
              <MenuIcon className="h-6 w-6 menu-actual-icon" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mobile-dropdown-menu-content"> {/* align="end" to open towards the left from the icon if icon is on the right */}
            {/* Optional: <DropdownMenuLabel>Navigation</DropdownMenuLabel> */}
            {/* Optional: <DropdownMenuSeparator /> */}
            <DropdownMenuItem asChild>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/events">Events</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/story">Our Story</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/faq">FAQ</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/rsvp">RSVP</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div style={{ height: '170px' }}></div> {/* Increased spacer div height for diagnostics */}
      <main className="gallery-main" style={{ paddingBottom: '15vh', overflowY: 'auto'}}> {/* Added overflowY: auto */}
        <div className="artwork-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Lights image is kept if desired, or can be removed if the FAQ section should be cleaner */}
          {/* <Image src="/images/Lights.png" alt="Gallery lights" width={1000} height={100} className="lights-image" style={{ marginBottom: '5vh'}} /> */}

          <div className="w-full max-w-2xl px-4"> {/* Added container for accordion */} 
            <Accordion type="single" collapsible className="w-full">
              {/* Repeating the question from the image, using the first FAQ item's answer */}
              {Array.from({ length: 4 }).map((_, index) => (
                <AccordionItem value={`item-image-${index}`} key={`item-image-${index}`} className="border-b border-white/50 py-4"> {/* Adjusted styling */} 
                  <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                    What if it rains? Am I allowed to feel it on my skin?
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 text-white/80 text-base">
                    {index === 0 ? "No, while we love your little ones, both wedding celebrations will be adults-only except for our immediate nieces and nephews. We hope that you will understand this decision and that you will still be able to join us to celebrate." : "Placeholder answer, replace with actual content or remove if not needed."}
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Original FAQ items from existing page, adapted to new styling */}
              <AccordionItem value="dress-code" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  What should I wear?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  <p className="mb-4"><strong>Friday:</strong> For the Hindu ceremony at Queen&apos;s Manor Event Centre, the dress code is Indian formal (shalwars, sarees, kurthas, sherwanis, lehengas)! If you do not have any Indian attire, please know that western formal is also alright! What&apos;s most important is that you feel comfortable to come celebrate with us.</p>
                  <p>
                    <strong>Saturday:</strong> For the wedding at the Art Gallery of Hamilton, the dress code is formal and vibrant. We&apos;ll check the weather leading up to the day to adjust if needed, but note that we&apos;re hoping the ceremony can be outside (unless it rains).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="arrival" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  When should I arrive?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  <p className="mb-4"><strong>Friday:</strong> Please arrive at Queen&apos;s Manor Event Centre at least 15 minutes before the ceremony start time to ensure you&apos;re comfortably seated.</p>
                  <p><strong>Saturday:</strong> For the Art Gallery of Hamilton ceremony, we recommend arriving 15-20 minutes early to find parking and make your way to the ceremony location.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="photos" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  Can I take photos during the ceremony?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  We kindly ask that you refrain from taking photos during the ceremonies - we have professional photographers who will capture these special moments. We encourage you to be present with us during the ceremonies and enjoy taking photos during the reception celebrations!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="parking" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  Where should I park?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  <p className="mb-4"><strong>Friday (Queen&apos;s Manor):</strong> There is ample free parking available at the venue.</p>
                  <p><strong>Saturday (Art Gallery):</strong> Parking is available in the Art Gallery of Hamilton parkade and several nearby municipal lots. More detailed parking information can be found on our Travel & Accommodations page.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancel" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  What if I need to cancel?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  We understand that circumstances can change. If you need to cancel your attendance, please let us know as soon as possible through the RSVP form or by contacting us directly. This helps us with our planning and arrangements with the venues and caterers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="registry" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  Gifts Registry
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  <p className="mb-4">Gifts! We do not have a registry, as we have everything we need. ♥ Should you wish to give us a gift, we would gratefully accept contributions to a honeymoon fund, or for dangerous adventures abroad.</p>
                  <p>Since cash can be hard, our e-transfer joint account is here: [ ] or we will have a box at the venues for cards as well.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="one-event" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  Is it ok if I only attend one of the events?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  Of course! We love and appreciate all of you, and totally understand if you can&apos;t come to both. You are all very welcome to come to either event, or both! If you can&apos;t make it, totally understand just let us know.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dietary" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  Allergies / Dietary restrictions
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  We should be able to accommodate for all of your allergies or dietary restrictions (for both events), however please make sure to let us know in your RSVP. You can reach out to us also if you have any other concerns.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="travel" className="border-b border-white/50 py-4">
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  Accommodation / Parking / Travel
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  Check out the &quot;Travel & Accommodations page&quot; :)
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="poem" className="py-4"> {/* Removed border-bottom for the last item for cleaner look if desired, or add border-white/50 */} 
                <AccordionTrigger className="hover:no-underline text-white/90 text-lg justify-between w-full">
                  What&apos;s one of your favourite Mary Oliver poems?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-white/80 text-base">
                  <div className="space-y-4">
                    <p className="font-serif text-xl mb-2">Don&apos;t Hesitate</p>
                    <p className="whitespace-pre-line">
                      If you suddenly and unexpectedly feel joy,
                      don&apos;t hesitate. Give in to it. There are plenty
                      of lives and whole towns destroyed or about
                      to be. We are not wise, and not very often
                      kind. And much can never be redeemed.
                      
                      Still, life has some possibility left. Perhaps this
                      is its way of fighting back, that sometimes
                      something happens better than all the riches
                      or power in the world. It could be anything,
                      but very likely you notice it in the instant
                      when love begins. Anyway, that&apos;s often the
                      case. Anyway, whatever it is, don&apos;t be afraid
                      of its plenty. Joy is not made to be a crumb.
                    </p>
                    <p className="mt-4 italic">BUT ALSO, read &quot;Wild Geese&quot; and &quot;Dogfish&quot; and everything else by Mary Oliver, we love her</p>
                  </div>
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
  );
} 