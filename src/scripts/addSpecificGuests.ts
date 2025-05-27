import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
// import fs from 'fs'; // Not needed
// import { parse } from 'csv-parse'; // Not needed
// import path from 'path'; // Not needed

interface NewGuest {
  firstName: string;
  lastName: string;
  partyId: string;
}

const guestsToAdd: NewGuest[] = [
  { firstName: "Jimmy", lastName: "Doe", partyId: "doe-3" },
  { firstName: "James", lastName: "Doe", partyId: "doe-4" },
  { firstName: "Jenny", lastName: "Doe", partyId: "doe-5" },
];

async function addSpecificGuests(dryRun: boolean = false): Promise<void> {
  const guestsRef = collection(db, 'guests');
  
  console.log(dryRun ? "DRY RUN: Guests to be added:" : "Adding specified guests to Firestore:");

  for (const guestData of guestsToAdd) {
    const guestDocument = {
      firstName: guestData.firstName,
      lastName: guestData.lastName,
      partyId: guestData.partyId,
      firstName_lower: guestData.firstName.toLowerCase(),
      lastName_lower: guestData.lastName.toLowerCase(),
      // Add other default fields from your Guest type if necessary
      // email: '',
      // rsvpStatus: 'pending',
    };

    if (dryRun) {
      console.log('Would add guest:', guestDocument);
    } else {
      try {
        const docRef = await addDoc(guestsRef, guestDocument);
        console.log(`✓ Added guest: ${guestDocument.firstName} ${guestDocument.lastName} (ID: ${docRef.id})`);
      } catch (error) {
        console.error(`Failed to add guest: ${guestDocument.firstName} ${guestDocument.lastName}`, error);
      }
    }
  }
}

// If script is run directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  addSpecificGuests(isDryRun)
    .then(() => console.log(isDryRun ? "Dry run completed." : "Guest addition process completed."))
    .catch(error => {
      console.error('Process failed:', error);
      process.exit(1);
    });
} 