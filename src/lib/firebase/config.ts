import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyD_Mfzlwi_4-lPKyvCFzbZ_2sFaxTFa61w",
  
    authDomain: "wedding-website-82b88.firebaseapp.com",
  
    projectId: "wedding-website-82b88",
  
    storageBucket: "wedding-website-82b88.firebasestorage.app",
  
    messagingSenderId: "483683771975",
  
    appId: "1:483683771975:web:748ff9137dc54fbfb53362"
  
  };
  

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db }; 