import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { config } from '../src/config/firebase';
import * as fs from 'fs';
import * as csv from 'csv-parse';
import { Guest } from '../src/types/guest';

const app = initializeApp(config);
const db = getFirestore(app);

interface CSVGuest {
  firstName: string;
  lastName: string;
  partyId: string;
}

async function importGuests(filePath: string, dryRun: boolean = false) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const parser = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  for await (const record of parser) {
    // Skip empty records
    if (!record.firstName?.trim() && !record.lastName?.trim()) {
      continue;
    }

    const firstName = record.firstName.trim();
    const lastName = record.lastName.trim();

    const guest = {
      firstName,
      lastName,
      firstName_lower: firstName.toLowerCase(),
      lastName_lower: lastName.toLowerCase(),
      name: `${firstName} ${lastName}`,
      partyId: record.partyId,
      partyName: record.partyId,
      email: '',
      dietaryRestrictions: '',
      mealPreference: '',
      needsTransportation: false,
      rsvpStatus: 'pending'
    };

    if (dryRun) {
      console.log('Would import guest:', guest);
    } else {
      const guestRef = doc(collection(db, 'guests'));
      await setDoc(guestRef, guest);
      console.log(`Imported guest: ${guest.name} (Party: ${guest.partyName})`);
    }
  }
}

const args = process.argv.slice(2);
const filePath = args[0];
const isDryRun = args.includes('--dry-run');

if (!filePath) {
  console.error('Please provide a CSV file path');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('CSV file not found:', filePath);
  process.exit(1);
}

importGuests(filePath, isDryRun)
  .then(() => {
    console.log('Import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during import:', error);
    process.exit(1);
  }); 