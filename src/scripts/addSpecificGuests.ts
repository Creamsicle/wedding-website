import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from '../lib/firebase/config';
import { collection, doc, setDoc } from 'firebase/firestore';
// import fs from 'fs'; // Not needed
// import { parse } from 'csv-parse'; // Not needed
// import path from 'path'; // Not needed

// Helper functions for ID generation (from scripts/updateDocumentIds.ts)
function generateRandomNumbers(): string {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

function sanitizeName(name: string): string {
  // Remove special characters and spaces, convert to lowercase
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

interface NewGuest {
  firstName: string;
  lastName: string;
  partyId: string;
}

const guestsToAdd: NewGuest[] = [
  { firstName: "Neil", lastName: "Goel", partyId: "vandergoel-1" },
  { firstName: "Peg", lastName: "VanderMeer", partyId: "vandermeer-2" },
  { firstName: "Howard", lastName: "VanderMeer", partyId: "vandermeer-2" },
  { firstName: "Heidi", lastName: "Belisle", partyId: "belisle-1" },
  { firstName: "Louis", lastName: "Belisle", partyId: "belisle-1" },
  { firstName: "Felix", lastName: "Belisle", partyId: "belisle-1" },
  { firstName: "Sophie", lastName: "Belisle", partyId: "belisle-1" },
  { firstName: "Peter", lastName: "VanderMeer", partyId: "vandermeer-3" },
  { firstName: "Rosanna", lastName: "VanderMeer", partyId: "vandermeer-3" },
  { firstName: "Gabriel", lastName: "VanderMeer", partyId: "vandermeer-3" },
  { firstName: "Pheenu", lastName: "Mathew", partyId: "vandermeer-3" },
  { firstName: "Brandon", lastName: "VanderMeer", partyId: "vandermeer-4" },
  { firstName: "Mariah", lastName: "VanderMeer", partyId: "vandermeer-4" },
  { firstName: "Chloe", lastName: "VanderMeer", partyId: "vandermeer-4" },
  { firstName: "Madeline", lastName: "VanderMeer", partyId: "vandermeer-4" },
  { firstName: "Evelyn", lastName: "VanderMeer", partyId: "vandermeer-5" },
  { firstName: "Ted", lastName: "VanderMeer", partyId: "vandermeer-6" },
  { firstName: "Mary", lastName: "VanderMeer", partyId: "vandermeer-6" },
  { firstName: "Steve", lastName: "VanderMeer", partyId: "vandermeer-7" },
  { firstName: "Sarah", lastName: "VanderMeer", partyId: "vandermeer-7" },
  { firstName: "Heather", lastName: "Snippe", partyId: "snippe-1" },
  { firstName: "Mark", lastName: "Snippe", partyId: "snippe-1" },
  { firstName: "Nick", lastName: "VanderMeer", partyId: "vandermeer-8" },
  { firstName: "Cassidy", lastName: "VanderMeer", partyId: "vandermeer-8" },
  { firstName: "Eric", lastName: "VanderMeer", partyId: "vandermeer-9" },
  { firstName: "Mel", lastName: "Hoeksema", partyId: "vandermeer-9" },
  { firstName: "Ada", lastName: "VanderMeer", partyId: "vandermeer-10" },
  { firstName: "Elsa", lastName: "Deyell", partyId: "deyell-1" },
  { firstName: "Rob", lastName: "Deyell", partyId: "deyell-1" },
  { firstName: "Bethany", lastName: "McClinsey", partyId: "mcclinsey-1" },
  { firstName: "Doug", lastName: "McClinsey", partyId: "mcclinsey-1" },
  { firstName: "Raela", lastName: "Newman", partyId: "newman-1" },
  { firstName: "Ryan", lastName: "Newman", partyId: "newman-1" },
  { firstName: "Jolene", lastName: "Deyell", partyId: "deyell-2" },
  { firstName: "Guest", lastName: "Deyell", partyId: "deyell-2" },
  { firstName: "Julie", lastName: "VanderMeer", partyId: "vandermeer-11" },
  { firstName: "Anne", lastName: "Medenblik", partyId: "medenblik-1" },
  { firstName: "Ted", lastName: "Medenblik", partyId: "medenblik-1" },
  { firstName: "Alyssa", lastName: "Medenblik", partyId: "medenblik-2" },
  { firstName: "Kevin", lastName: "Murphy", partyId: "medenblik-2" },
  { firstName: "Jon", lastName: "Medenblik", partyId: "medenblik-3" },
  { firstName: "Andrea", lastName: "Medenblik", partyId: "medenblik-3" },
  { firstName: "Mary Lynn", lastName: "Corr", partyId: "corr-1" },
  { firstName: "Ashley", lastName: "Corr", partyId: "corr-2" }, // Corrected potential trailing space
  { firstName: "Guest", lastName: "Corr", partyId: "corr-2" },
  { firstName: "Karin", lastName: "Perk", partyId: "perk-1" },
  { firstName: "Chris", lastName: "Perk", partyId: "perk-1" },
  { firstName: "Aniek", lastName: "Perk", partyId: "perk-2" },
  { firstName: "Guest", lastName: "Perk", partyId: "perk-2" },
  { firstName: "Eline", lastName: "Perk", partyId: "perk-3" }, // Corrected potential trailing space
  { firstName: "Glenn", lastName: "Perk", partyId: "perk-3" },
  { firstName: "Erick", lastName: "Schuringa", partyId: "schuringa-1" },
  { firstName: "Ruth Ann", lastName: "Schuringa", partyId: "schuringa-1" },
  { firstName: "Christina", lastName: "Low", partyId: "low-1" },
  { firstName: "Peter", lastName: "Kungania", partyId: "low-1" },
  { firstName: "Sherif", lastName: "Darrag", partyId: "darrag-1" },
  { firstName: "Vinayak", lastName: "Mishra", partyId: "mishra-1" },
  { firstName: "Zohra", lastName: "Mishra", partyId: "mishra-1" },
  { firstName: "Sanjay", lastName: "Parker", partyId: "sanjay-1" }, // Corrected potential trailing space
  { firstName: "Renee", lastName: "Bruell", partyId: "sanjay-1" },
  { firstName: "Bryce", lastName: "Lynas", partyId: "lynas-1" }, // Corrected potential trailing space
  { firstName: "Annie", lastName: "Nethery", partyId: "lynas-1" },
  { firstName: "Nick", lastName: "Ioannidis", partyId: "ioannidis-1" }, // Corrected potential trailing space
  { firstName: "Tim Wu", lastName: "Wu", partyId: "wu-1" },
  { firstName: "Jenn", lastName: "Wu", partyId: "wu-1" }, // Corrected potential trailing space
  { firstName: "Rachel", lastName: "Hickey", partyId: "hickey-1" },
  { firstName: "Armando", lastName: "Hickey", partyId: "hickey-1" },
  { firstName: "River", lastName: "Wong", partyId: "river-1" }, // Corrected potential trailing space
  { firstName: "Mary", lastName: "Hu", partyId: "river-1" },
  { firstName: "Kristoff", lastName: "Malejczuk", partyId: "kristoff-1" },
  { firstName: "Guest", lastName: "Malejczuk", partyId: "kristoff-1" },
  { firstName: "Alessandro", lastName: "Cunsolo", partyId: "cunsolo-1" }, // Corrected potential trailing space
  { firstName: "Monanshi", lastName: "Shah", partyId: "cunsolo-1" },
  { firstName: "Rachel", lastName: "Malevich", partyId: "malevich-1" },
  { firstName: "Stefano", lastName: "Mozza", partyId: "malevich-2" },
  { firstName: "Peter", lastName: "Keillor", partyId: "keillor-1" },
  { firstName: "Mel", lastName: "Keillor", partyId: "keillor-1" },
  { firstName: "Sabrina", lastName: "Huston", partyId: "huston-1" },
  { firstName: "Keith", lastName: "Carscadden", partyId: "huston-1" },
  { firstName: "Heather", lastName: "Mantel", partyId: "mantel-1" }
];

async function addSpecificGuests(dryRun: boolean = false): Promise<void> {
  const guestsRef = collection(db, 'guests');
  
  console.log(dryRun ? "DRY RUN: Guests to be added:" : "Adding specified guests to Firestore:");

  for (const guestData of guestsToAdd) {
    const guestId = `${sanitizeName(guestData.firstName)}${sanitizeName(guestData.lastName)}${generateRandomNumbers()}`;
    const guestDocument = {
      id: guestId, // Store the generated ID in the document
      firstName: guestData.firstName,
      lastName: guestData.lastName,
      partyId: guestData.partyId,
      firstName_lower: guestData.firstName.toLowerCase(),
      lastName_lower: guestData.lastName.toLowerCase(),
      // Add other default fields from your Guest type if necessary
      // For example, to align with your `functions/src/index.ts` Guest type:
      // rsvpResponse: undefined, // Or an empty object if you prefer
      // isPlusOne: false, // Default if not specified
    };

    if (dryRun) {
      console.log('Would add guest:', guestDocument);
    } else {
      try {
        // Use setDoc with the generated guestId
        await setDoc(doc(guestsRef, guestId), guestDocument);
        console.log(`✓ Added guest: ${guestDocument.firstName} ${guestDocument.lastName} (ID: ${guestId})`);
      } catch (error) {
        console.error(`Failed to add guest: ${guestDocument.firstName} ${guestDocument.lastName}`, error);
      }
    }
  }
}

// Process command line arguments for dry run
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

// Call the function directly
addSpecificGuests(isDryRun)
  .then(() => {
    console.log(isDryRun ? "Dry run completed." : "Guest addition process completed.");
    // Ensure the process exits cleanly, especially if Firebase connections are open
    process.exit(0);
  })
  .catch(error => {
    console.error('Process failed:', error);
    process.exit(1);
  }); 