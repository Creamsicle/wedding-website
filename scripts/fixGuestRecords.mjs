import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const config = {
  apiKey: "AIzaSyD_Mfzlwi_4-lPKyvCFzbZ_2sFaxTFa61w",
  authDomain: "wedding-website-82b88.firebaseapp.com",
  projectId: "wedding-website-82b88",
  storageBucket: "wedding-website-82b88.firebasestorage.app",
  messagingSenderId: "483683771975",
  appId: "1:483683771975:web:748ff9137dc54fbfb53362"
};

const app = initializeApp(config);
const db = getFirestore(app);

function extractNames(fullName) {
  const parts = fullName.trim().split(' ');
  if (parts.length < 2) {
    throw new Error(`Invalid name format: ${fullName}`);
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

function generateId(firstName, lastName) {
  const random4Digits = Math.floor(1000 + Math.random() * 9000);
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${random4Digits}`;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixGuestRecords() {
  const guestsRef = collection(db, 'guests');
  const snapshot = await getDocs(guestsRef);
  
  let fixed = 0;
  let skipped = 0;
  let failed = 0;
  
  console.log(`Found ${snapshot.size} documents to check.`);
  
  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    
    // Skip if record already has all required fields
    if (data.firstName && data.lastName && data.firstName_lower && data.lastName_lower) {
      skipped++;
      continue;
    }
    
    try {
      // Extract first and last name from the name field
      const { firstName, lastName } = extractNames(data.name);
      
      // Generate missing fields
      const updates = {
        firstName,
        lastName,
        firstName_lower: firstName.toLowerCase(),
        lastName_lower: lastName.toLowerCase(),
        id: generateId(firstName, lastName),
        partyId: data.partyName // Use existing partyName as partyId
      };
      
      console.log(`Fixing document ${docSnapshot.id}:`);
      console.log('- Original:', data);
      console.log('- Updates:', updates);
      
      // Update the document
      await updateDoc(doc(db, 'guests', docSnapshot.id), updates);
      console.log('✓ Successfully updated');
      fixed++;
      
      // Add a small delay to prevent overwhelming Firebase
      await sleep(500);
      
    } catch (error) {
      console.error(`Failed to fix document ${docSnapshot.id}:`, error);
      failed++;
    }
  }
  
  console.log('\nFix Summary:');
  console.log(`- Total documents: ${snapshot.size}`);
  console.log(`- Fixed: ${fixed}`);
  console.log(`- Skipped (already correct): ${skipped}`);
  console.log(`- Failed: ${failed}`);
}

// Run the fix
console.log('Starting to fix guest records...\n');
fixGuestRecords()
  .then(() => {
    console.log('\nProcess completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nProcess failed:', error);
    process.exit(1);
  }); 