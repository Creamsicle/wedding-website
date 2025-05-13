import { Timeline } from '@/components/Timeline';

const timelineItems = [
  {
    date: "June 15, 2023",
    title: "Our First Meeting",
    description: "The day our paths crossed and our story began. A chance encounter that would change everything.",
    icon: "heart" as const,
    image: "https://source.unsplash.com/800x600/?couple,meeting"
  },
  {
    date: "July 1, 2023",
    title: "First Official Date",
    description: "A magical evening filled with laughter, deep conversations, and the beginning of something beautiful.",
    icon: "heart" as const,
    image: "https://source.unsplash.com/800x600/?romantic,dinner"
  },
  {
    date: "August 20, 2023",
    title: "Weekend Getaway",
    description: "Our first trip together - a spontaneous adventure that brought us even closer.",
    icon: "photo" as const,
    image: "https://source.unsplash.com/800x600/?travel,couple"
  },
  {
    date: "October 31, 2023",
    title: "Halloween Together",
    description: "Dressed up as each other's favorite characters, creating memories and sharing laughs.",
    icon: "photo" as const,
    image: "https://source.unsplash.com/800x600/?halloween,party"
  },
  {
    date: "December 25, 2023",
    title: "First Christmas",
    description: "Celebrating the holidays together, exchanging gifts, and creating new traditions.",
    icon: "heart" as const,
    image: "https://source.unsplash.com/800x600/?christmas,couple"
  },
  {
    date: "February 14, 2024",
    title: "Valentine's Day",
    description: "A romantic celebration of our love and the journey we've shared so far.",
    icon: "heart" as const,
    image: "https://source.unsplash.com/800x600/?valentines,love"
  }
];

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Story</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every love story is beautiful, but ours is my favorite. Here's a journey through our most cherished moments together.
          </p>
        </div>
        <Timeline items={timelineItems} />
      </div>
    </main>
  );
} 