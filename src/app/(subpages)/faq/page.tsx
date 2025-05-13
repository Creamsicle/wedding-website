export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 pt-32">
      <h1 className="text-4xl font-serif mb-8 text-center">Frequently Asked Questions</h1>

      {/* Hero Image */}
      <div className="relative h-[300px] mb-16 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-500">FAQ Hero Image</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Wedding Details Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif mb-8">Wedding Details</h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">What time should I arrive?</h3>
              <p>[Arrival time details and recommendations]</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">What should I wear?</h3>
              <p>[Dress code details and suggestions]</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Can I bring a plus one?</h3>
              <p>[Plus one policy details]</p>
            </div>
          </div>
        </section>

        {/* Venue & Accommodation */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif mb-8">Venue & Accommodation</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="relative h-[250px] bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Venue Image</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Where can I park?</h3>
                <p>[Parking information and directions]</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Are there hotels nearby?</h3>
                <p>[Accommodation recommendations and details]</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gifts & Registry */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif mb-8">Gifts & Registry</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Where are you registered?</h3>
                <p>[Registry information and links]</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Do you prefer cash gifts?</h3>
                <p>[Gift preferences and registry details]</p>
              </div>
            </div>
            <div className="relative h-[250px] bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Registry Image</span>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif mb-8">Additional Information</h2>
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Is the venue wheelchair accessible?</h3>
              <p>[Accessibility information]</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Will the ceremony be outdoors?</h3>
              <p>[Ceremony location details and weather contingency plans]</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Are children welcome?</h3>
              <p>[Children policy details]</p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-serif mb-4">Still Have Questions?</h2>
          <p className="mb-4">Please don't hesitate to reach out to us or our wedding coordinator.</p>
          <p className="font-semibold">[Contact Information]</p>
        </section>
      </div>
    </div>
  );
} 