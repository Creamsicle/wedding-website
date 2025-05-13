export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 pt-32">
      <h1 className="text-4xl font-serif mb-8 text-center">Wedding Events</h1>
      
      {/* Ceremony Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[400px] bg-gray-200 rounded-lg overflow-hidden">
            {/* Image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">Ceremony Venue Image</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-serif mb-4">The Ceremony</h2>
            <p className="text-lg mb-4">Saturday, [Date]</p>
            <p className="text-lg mb-4">[Time]</p>
            <p className="mb-4">[Venue Name]</p>
            <p className="mb-4">[Venue Address]</p>
            <p className="italic">Join us as we exchange vows in an intimate ceremony surrounded by our loved ones.</p>
          </div>
        </div>
      </section>

      {/* Reception Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-serif mb-4">The Reception</h2>
            <p className="text-lg mb-4">Saturday, [Date]</p>
            <p className="text-lg mb-4">[Time]</p>
            <p className="mb-4">[Venue Name]</p>
            <p className="mb-4">[Venue Address]</p>
            <p className="italic">Celebrate with us over dinner, drinks, and dancing into the night.</p>
          </div>
          <div className="relative h-[400px] bg-gray-200 rounded-lg overflow-hidden order-1 md:order-2">
            {/* Image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">Reception Venue Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Events Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-serif mb-8 text-center">Additional Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Welcome Dinner */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[250px] bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Welcome Dinner Image</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-2">Welcome Dinner</h3>
              <p className="mb-2">[Date & Time]</p>
              <p className="mb-2">[Location]</p>
              <p className="italic">Join us for a casual dinner to kick off the wedding weekend.</p>
            </div>
          </div>

          {/* Rehearsal */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[250px] bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Rehearsal Image</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-2">Rehearsal</h3>
              <p className="mb-2">[Date & Time]</p>
              <p className="mb-2">[Location]</p>
              <p className="italic">For wedding party and immediate family only.</p>
            </div>
          </div>

          {/* Day-After Brunch */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-[250px] bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Brunch Image</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif mb-2">Farewell Brunch</h3>
              <p className="mb-2">[Date & Time]</p>
              <p className="mb-2">[Location]</p>
              <p className="italic">Join us for a casual brunch before departing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 