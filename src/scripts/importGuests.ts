import { db } from '../lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import fs from 'fs';
import { parse } from 'csv-parse';
import path from 'path';

interface GuestImport {
  firstName: string;
  lastName: string;
  partyId: string;
}

interface CSVRow {
  firstName: string;
  lastName: string;
  partyId: string;
  [key: string]: string; // For any additional columns
}

async function importGuests(csvPath: string): Promise<void> {
  const guestsRef = collection(db, 'guests');
  
  // Read and parse CSV file
  const parser = fs
    .createReadStream(csvPath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true
    }));

  for await (const row of parser) {
    const guestData: CSVRow = row;
    
    try {
      // Create guest document
      await addDoc(guestsRef, {
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        partyId: guestData.partyId,
        firstName_lower: guestData.firstName.toLowerCase(),
        lastName_lower: guestData.lastName.toLowerCase()
      });
      
      console.log(`✓ Added guest: ${guestData.firstName} ${guestData.lastName}`);
    } catch (error) {
      console.error(`Failed to add guest: ${guestData.firstName} ${guestData.lastName}`, error);
    }
  }
}

// If script is run directly
if (require.main === module) {
  const csvPath = process.argv[2] || path.join(process.cwd(), 'guests.csv');
  
  importGuests(csvPath)
    .then(() => console.log('Import completed'))
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
} 