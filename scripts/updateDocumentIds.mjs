import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

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

function generateRandomNumbers() {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

function sanitizeName(name) {
  // Remove special characters and spaces, convert to lowercase
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function migrateDocument(document, retryCount = 0) {
  const data = document.data();
  const firstName = data.firstName?.trim() || '';
  const lastName = data.lastName?.trim() || '';
  
  if (!firstName || !lastName) {
    console.warn(`Skipping document ${document.id} - missing name data`);
    return true; // Consider it "successful" since we're intentionally skipping
  }

  const newId = `${sanitizeName(firstName)}${sanitizeName(lastName)}${generateRandomNumbers()}`;
  console.log(`Migrating ${document.id} to ${newId}`);
  
  try {
    // Create new document with the formatted ID
    await setDoc(doc(db, 'guests', newId), {
      ...data,
      id: newId
    });
    
    // Delete the old document
    await deleteDoc(doc(db, 'guests', document.id));
    
    console.log(`Successfully migrated ${document.id} to ${newId}`);
    return true;
  } catch (error) {
    console.error(`Error migrating document ${document.id}:`, error);
    
    if (retryCount < 3) {
      console.log(`Retrying migration for ${document.id} (attempt ${retryCount + 1})`);
      await sleep(1000 * (retryCount + 1)); // Exponential backoff
      return migrateDocument(document, retryCount + 1);
    }
    
    return false;
  }
}

async function updateDocumentIds() {
  const guestsRef = collection(db, 'guests');
  const snapshot = await getDocs(guestsRef);
  const documents = snapshot.docs;
  
  console.log(`Found ${documents.length} documents to update.`);
  
  const batchSize = 10;
  const failedMigrations = [];
  
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(documents.length/batchSize)}`);
    
    const results = await Promise.all(
      batch.map(async (doc) => {
        const success = await migrateDocument(doc);
        if (!success) failedMigrations.push(doc.id);
        return success;
      })
    );
    
    const successCount = results.filter(Boolean).length;
    console.log(`Batch completed: ${successCount}/${batch.length} successful`);
    
    // Wait a bit between batches to avoid overwhelming Firebase
    if (i + batchSize < documents.length) {
      console.log('Waiting before next batch...');
      await sleep(1000);
    }
  }
  
  console.log('\nMigration Summary:');
  console.log(`Total documents processed: ${documents.length}`);
  console.log(`Failed migrations: ${failedMigrations.length}`);
  
  if (failedMigrations.length > 0) {
    console.log('\nFailed document IDs:');
    failedMigrations.forEach(id => console.log(id));
    throw new Error('Some migrations failed. See above for details.');
  } else {
    console.log('\nAll migrations completed successfully!');
  }
}

// Run the update
console.log('Starting document ID update process...');
updateDocumentIds()
  .then(() => {
    console.log('Process complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Process failed:', error);
    process.exit(1);
  }); 