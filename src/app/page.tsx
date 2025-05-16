'use client';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        style={{
          backgroundImage: `url('/herobg2.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="min-h-screen flex flex-col items-center"
      >
        <div className="pt-[calc(6rem+50px)]">
          <h1 className="text-4xl md:text-6xl font-serif tracking-wider text-white">
            CHELSEA & NEIL
          </h1>
        </div>
      </section>
    </div>
  );
} 