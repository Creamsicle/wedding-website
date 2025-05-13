'use client';

import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { Suspense } from 'react';

export default function RSVPPage() {
  return (
    <div className="min-h-screen subpage-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Wedding RSVP
          </h1>
          <p className="text-[var(--rust-light)] text-lg">
            Please enter your name to find your invitation and RSVP for your party.
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <RSVPForm />
        </Suspense>
      </div>
    </div>
  );
} 