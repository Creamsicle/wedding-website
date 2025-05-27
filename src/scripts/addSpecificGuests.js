import { initializeApp } from 'firebase/app'; // CommonJS
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // CommonJS
import { config as firebaseConfig } from '../config/firebase.js'; // Path from src/scripts/ to src/config/

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const guestsToAdd = [
  { firstName: "Jackie", lastName: "Doe", partyId: "doe-5" },
  { firstName: "Jaqulum", lastName: "Doe", partyId: "doe-5" },
  { firstName: "Johannes", lastName: "Doe", partyId: "doe-5" },
];

async function addSpecificGuests(dryRun = false) { // Removed type annotations
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
// A common way to check if a module is run directly in ESM is to check import.meta.url
const currentFileUrl = import.meta.url;
const mainModuleUrl = process.argv[1] ? new URL(process.argv[1], 'file:///').href : '';

if (currentFileUrl === mainModuleUrl) {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  addSpecificGuests(isDryRun)
    .then(() => console.log(isDryRun ? "Dry run completed." : "Guest addition process completed."))
    .catch(error => {
      console.error('Process failed:', error);
      process.exit(1);
    });
} 