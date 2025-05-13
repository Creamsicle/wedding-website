'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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