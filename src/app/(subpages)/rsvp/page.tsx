'use client';

import { useState } from 'react';

export default function RSVPPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    numberOfGuests: '1',
    dietaryRestrictions: '',
    songRequests: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 pt-32">
      <h1 className="text-4xl font-serif mb-8 text-center">RSVP</h1>

      {/* Hero Image */}
      <div className="relative h-[300px] mb-16 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-500">RSVP Hero Image</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Introduction */}
        <div className="text-center mb-12">
          <p className="text-lg mb-4">Please respond by [RSVP Deadline]</p>
          <p className="italic">We look forward to celebrating with you!</p>
        </div>

        {/* RSVP Form */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Attending Selection */}
            <div>
              <label htmlFor="attending" className="block text-sm font-medium mb-2">
                Will you be attending?*
              </label>
              <select
                id="attending"
                name="attending"
                value={formData.attending}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="yes">Yes, I will attend</option>
                <option value="no">No, I cannot attend</option>
              </select>
            </div>

            {/* Number of Guests */}
            <div>
              <label htmlFor="numberOfGuests" className="block text-sm font-medium mb-2">
                Number of Guests*
              </label>
              <select
                id="numberOfGuests"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label htmlFor="dietaryRestrictions" className="block text-sm font-medium mb-2">
                Dietary Restrictions
              </label>
              <input
                type="text"
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Please list any dietary restrictions"
              />
            </div>

            {/* Song Requests */}
            <div>
              <label htmlFor="songRequests" className="block text-sm font-medium mb-2">
                Song Requests
              </label>
              <input
                type="text"
                id="songRequests"
                name="songRequests"
                value={formData.songRequests}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="What songs will get you dancing?"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message for the Couple
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Share your wishes or message for the couple"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Submit RSVP
            </button>
          </form>

          {/* Decorative Images */}
          <div className="space-y-6">
            <div className="relative h-[200px] bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Decorative Image 1</span>
              </div>
            </div>
            <div className="relative h-[200px] bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Decorative Image 2</span>
              </div>
            </div>
            <div className="relative h-[200px] bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500">Decorative Image 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-serif mb-4">Additional Information</h2>
          <p className="mb-4">
            If you have any questions about your RSVP, please don't hesitate to contact us.
          </p>
          <p className="font-semibold">[Contact Information]</p>
        </div>
      </div>
    </div>
  );
} 