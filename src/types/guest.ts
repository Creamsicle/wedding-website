export interface Guest {
  name: string;
  partyName: string;
  email?: string;
  dietaryRestrictions?: string;
  mealPreference?: string;
  needsTransportation: boolean;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
} 