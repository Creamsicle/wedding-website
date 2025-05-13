import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function removeDuplicates() {
  const guestsRef = collection(db, 'guests');
  const snapshot = await getDocs(guestsRef);
  
  console.log(`Found ${snapshot.size} total guest records.`);
  
  // Map to store unique name combinations
  const nameMap = new Map();
  const duplicates = [];
  
  // First pass: Identify duplicates
  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    
    // Skip if missing required fields
    if (!data.firstName_lower || !data.lastName_lower) {
      console.log(`Skipping record ${docSnapshot.id} - missing name fields`);
      continue;
    }
    
    const nameKey = `${data.firstName_lower}|${data.lastName_lower}`;
    
    if (nameMap.has(nameKey)) {
      // This is a duplicate
      duplicates.push({
        id: docSnapshot.id,
        name: `${data.firstName} ${data.lastName}`
      });
    } else {
      // This is the first occurrence
      nameMap.set(nameKey, {
        id: docSnapshot.id,
        name: `${data.firstName} ${data.lastName}`
      });
    }
  }
  
  console.log(`\nFound ${duplicates.length} duplicate records to remove.`);
  
  if (duplicates.length === 0) {
    console.log('No duplicates found. All records are unique.');
    return;
  }
  
  // Second pass: Delete duplicates
  console.log('\nRemoving duplicate records...');
  let deleted = 0;
  
  for (const duplicate of duplicates) {
    try {
      await deleteDoc(doc(db, 'guests', duplicate.id));
      console.log(`✓ Deleted duplicate record for ${duplicate.name} (ID: ${duplicate.id})`);
      deleted++;
      await sleep(500); // Add small delay between deletions
    } catch (error) {
      console.error(`✗ Failed to delete ${duplicate.name} (ID: ${duplicate.id}):`, error);
    }
  }
  
  console.log('\nDuplicate Removal Summary:');
  console.log(`- Total records processed: ${snapshot.size}`);
  console.log(`- Unique name combinations: ${nameMap.size}`);
  console.log(`- Duplicates found: ${duplicates.length}`);
  console.log(`- Successfully deleted: ${deleted}`);
  console.log(`- Failed to delete: ${duplicates.length - deleted}`);
}

// Run the duplicate removal process
console.log('Starting duplicate record removal process...\n');
removeDuplicates()
  .then(() => {
    console.log('\nProcess completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nProcess failed:', error);
    process.exit(1);
  }); 