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
            <AccordionItem value="dress-code" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                What is the dress code?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                [Dress code details]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accommodations" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Are there recommended accommodations?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                [Accommodation details and recommendations]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="registry" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Where can I find your registry?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                [Registry information]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="parking" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Is parking available?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                [Parking information]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="plus-one" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Can I bring a plus one?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                [Plus one policy]
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="children" className="card-hover border-none rounded-lg">
              <AccordionTrigger className="px-6 py-4 text-white hover:text-[var(--rust-light)] transition-colors">
                Are children welcome?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80">
                [Children policy]
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
} 