import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function compareGuests() {
  // Get a working guest record (using one we saw in the migration output)
  const workingGuestRef = doc(db, 'guests', 'zabidarooplal6587');
  const workingGuestSnap = await getDoc(workingGuestRef);
  
  // Get a non-working guest record (one that was skipped)
  const nonWorkingGuestRef = doc(db, 'guests', 'xOZPvzY55AeSD3SkRTke');
  const nonWorkingGuestSnap = await getDoc(nonWorkingGuestRef);
  
  console.log('Working Guest Data Structure:');
  console.log(JSON.stringify(workingGuestSnap.data(), null, 2));
  
  console.log('\nNon-Working Guest Data Structure:');
  console.log(JSON.stringify(nonWorkingGuestSnap.data(), null, 2));
}

// Run the comparison
console.log('Comparing guest data structures...\n');
compareGuests()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  }); 