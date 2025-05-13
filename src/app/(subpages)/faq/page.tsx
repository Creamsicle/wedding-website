import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="min-h-screen subpage-gradient">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif mb-4 text-white">Frequently Asked Questions</h1>
          <p className="text-lg text-[var(--rust-light)] max-w-2xl mx-auto">
            Find answers to common questions about our wedding celebration.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="children" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Can I bring my kids?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                No, while we love your little ones, both wedding celebrations will be adults-only except for our immediate nieces and nephews. We hope that you will understand this decision and that you will still be able to join us to celebrate.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dress-code" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                What should I wear?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                <p className="mb-4"><strong>Friday:</strong> For the Hindu ceremony at Queen&apos;s Manor Event Centre, the dress code is Indian formal (shalwars, sarees, kurthas, sherwanis, lehengas)! If you do not have any Indian attire, please know that western formal is also alright! What&apos;s most important is that you feel comfortable to come celebrate with us.</p>
                <p>
                  <strong>Saturday:</strong> For the wedding at the Art Gallery of Hamilton, the dress code is formal and vibrant. We&apos;ll check the weather leading up to the day to adjust if needed, but note that we&apos;re hoping the ceremony can be outside (unless it rains).
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="registry" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Gifts Registry
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                <p className="mb-4">Gifts! We do not have a registry, as we have everything we need. ♥ Should you wish to give us a gift, we would gratefully accept contributions to a honeymoon fund, or for dangerous adventures abroad.</p>
                <p>Since cash can be hard, our e-transfer joint account is here: [ ] or we will have a box at the venues for cards as well.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="one-event" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Is it ok if I only attend one of the events?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                Of course! We love and appreciate all of you, and totally understand if you can&apos;t come to both. You are all very welcome to come to either event, or both! If you can&apos;t make it, totally understand just let us know.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dietary" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Allergies / Dietary restrictions
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                We should be able to accommodate for all of your allergies or dietary restrictions (for both events), however please make sure to let us know in your RSVP. You can reach out to us also if you have any other concerns.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="travel" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Accommodation / Parking / Travel
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                Check out the &quot;Travel & Accommodations page&quot; :)
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="poem" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                What&apos;s one of your favourite Mary Oliver poems?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
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
    </div>
  );
} 