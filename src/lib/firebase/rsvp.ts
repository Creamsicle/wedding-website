import { db } from './config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export interface GuestParty {
  id: string;
  partyMembers: Guest[];
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  partyId: string;
  rsvpResponse?: RSVPResponse;
}

export interface RSVPResponse {
  hinduCeremonyAttending: boolean;
  weddingReceptionAttending: boolean;
  mealPreference: 'Chicken' | 'Steak' | 'Vegetarian Risotto';
  dietaryRestrictions: string;
  needsRideToHinduCeremony: boolean;
  hinduCeremonyRideDetails?: string;
  needsRideToWedding: boolean;
  weddingRideDetails?: string;
  canOfferRide: boolean;
  rideOfferDetails?: string;
  timestamp: Date;
}

export async function searchGuests(searchName: string): Promise<GuestParty[]> {
  const guestsRef = collection(db, 'guests');
  const searchTerms = searchName.toLowerCase().split(' ');
  
  const parties: { [key: string]: GuestParty } = {};
  const foundPartyIds = new Set<string>();
  
  for (const term of searchTerms) {
    const firstNameQuery = query(
      guestsRef,
      where('firstName_lower', '>=', term),
      where('firstName_lower', '<=', term + '\uf8ff')
    );
    
    const lastNameQuery = query(
      guestsRef,
      where('lastName_lower', '>=', term),
      where('lastName_lower', '<=', term + '\uf8ff')
    );
    
    const [firstNameResults, lastNameResults] = await Promise.all([
      getDocs(firstNameQuery),
      getDocs(lastNameQuery)
    ]);

    // Get all party IDs from the search results
    const matchedPartyIds = new Set<string>();
    [...firstNameResults.docs, ...lastNameResults.docs].forEach(doc => {
      const guest = doc.data();
      matchedPartyIds.add(guest.partyId);
    });

    // Fetch all guests from matched parties
    for (const partyId of matchedPartyIds) {
      if (!foundPartyIds.has(partyId)) {
        foundPartyIds.add(partyId);
        const partyQuery = query(guestsRef, where('partyId', '==', partyId));
        const partySnapshot = await getDocs(partyQuery);
        
        partySnapshot.docs.forEach(doc => {
          const guest = { id: doc.id, ...doc.data() } as Guest;
          if (!parties[guest.partyId]) {
            parties[guest.partyId] = {
              id: guest.partyId,
              partyMembers: []
            };
          }
          if (!parties[guest.partyId].partyMembers.find(member => member.id === guest.id)) {
            parties[guest.partyId].partyMembers.push(guest);
          }
        });
      }
    }
  }
  
  return Object.values(parties);
}

export async function submitRSVP(guestId: string, response: RSVPResponse): Promise<void> {
  const guestRef = doc(db, 'guests', guestId);
  await updateDoc(guestRef, {
    rsvpResponse: {
      ...response,
      timestamp: new Date()
    }
  });
}

export async function exportToCSV(): Promise<string> {
  const guestsRef = collection(db, 'guests');
  const snapshot = await getDocs(guestsRef);
  
  const headers = [
    'First Name',
    'Last Name',
    'Hindu Ceremony Attending',
    'Wedding/Reception Attending',
    'Meal Preference',
    'Dietary Restrictions',
    'Needs Ride (Hindu)',
    'Hindu Ride Details',
    'Needs Ride (Wedding)',
    'Wedding Ride Details',
    'Can Offer Ride',
    'Ride Offer Details',
    'RSVP Timestamp'
  ];
  
  const rows = [headers];
  
  snapshot.docs.forEach(doc => {
    const guest = doc.data() as Guest;
    const response = guest.rsvpResponse;
    
    rows.push([
      guest.firstName,
      guest.lastName,
      response?.hinduCeremonyAttending ? 'Yes' : 'No',
      response?.weddingReceptionAttending ? 'Yes' : 'No',
      response?.mealPreference || 'Not Selected',
      response?.dietaryRestrictions || '',
      response?.needsRideToHinduCeremony ? 'Yes' : 'No',
      response?.hinduCeremonyRideDetails || '',
      response?.needsRideToWedding ? 'Yes' : 'No',
      response?.weddingRideDetails || '',
      response?.canOfferRide ? 'Yes' : 'No',
      response?.rideOfferDetails || '',
      response?.timestamp ? response.timestamp.toISOString() : ''
    ]);
  });
  
  return rows.map(row => row.join(',')).join('\n');
} 