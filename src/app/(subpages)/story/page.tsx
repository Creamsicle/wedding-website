import MondrianTimeline from '@/components/MondrianTimeline';

export default function StoryPage() {
  return (
    <main 
      className="min-h-screen relative"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(255, 127, 0, 0.85) 0%, transparent 60%),
          radial-gradient(circle at 80% 30%, rgba(0, 140, 255, 0.95) 0%, transparent 60%),
          radial-gradient(circle at 40% 70%, rgba(255, 112, 0, 0.85) 0%, transparent 50%),
          radial-gradient(circle at 70% 60%, rgba(0, 170, 255, 0.95) 0%, transparent 50%),
          linear-gradient(45deg, #ff8000 0%, #00a2ff 100%)
        `
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center py-16">
          <h1 className="text-4xl font-serif mb-4 text-white">Our Story</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Every love story is beautiful, but ours is my favorite. Here&apos;s a journey through our most cherished moments together.
          </p>
          <p className="text-lg mb-4">
            We&apos;re so excited to share our story with you!
          </p>
        </div>
        <MondrianTimeline />
      </div>
    </main>
  );
} 