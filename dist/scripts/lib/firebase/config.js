"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
// Your web app's Firebase configuration
console.log('Checking Firebase Environment Variables...');
const requiredEnvVars = {
    'Project ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'Auth Domain': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    'API Key': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    'Storage Bucket': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    'Messaging Sender ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    'App ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);
if (missingVars.length > 0) {
    console.error('Missing required Firebase environment variables:', missingVars);
    throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
}
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
console.log('Firebase Config:', Object.assign(Object.assign({}, firebaseConfig), { apiKey: '**********', projectId: firebaseConfig.projectId || 'MISSING PROJECT ID' }));
// Initialize Firebase
if (!firebaseConfig.projectId) {
    throw new Error('Firebase project ID is required but not provided in environment variables');
}
const app = (0, app_1.getApps)().length === 0 ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApps)()[0];
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
