import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { config } from '../src/config/firebase';

const app = initializeApp(config);
const db = getFirestore(app);

function generateRandomNumbers(): string {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

function sanitizeName(name: string): string {
  // Remove special characters and spaces, convert to lowercase
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function updateDocumentIds() {
  const guestsRef = collection(db, 'guests');
  const snapshot = await getDocs(guestsRef);
  
  console.log(`Found ${snapshot.size} documents to update.`);
  
  for (const document of snapshot.docs) {
    const data = document.data();
    const firstName = data.firstName?.trim() || '';
    const lastName = data.lastName?.trim() || '';
    
    if (firstName && lastName) {
      // Create new document ID: firstnamelastname1234
      const newId = `${sanitizeName(firstName)}${sanitizeName(lastName)}${generateRandomNumbers()}`;
      
      console.log(`Migrating ${document.id} to ${newId}`);
      
      try {
        // Create new document with the formatted ID
        await setDoc(doc(db, 'guests', newId), {
          ...data,
          id: newId // Update the ID field in the document data as well
        });
        
        // Delete the old document
        await deleteDoc(doc(db, 'guests', document.id));
        
        console.log(`Successfully migrated ${document.id} to ${newId}`);
      } catch (error) {
        console.error(`Error migrating document ${document.id}:`, error);
      }
    } else {
      console.warn(`Skipping document ${document.id} - missing name data`);
    }
  }
  
  console.log('Document ID update complete!');
}

// Run the update
updateDocumentIds().catch(console.error); 