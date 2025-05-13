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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">RSVP</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <RSVPForm />
      </Suspense>
    </div>
  );
} 