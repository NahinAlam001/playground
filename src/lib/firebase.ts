
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Check for essential environment variables and throw an error if any are missing.
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('Firebase config error: NEXT_PUBLIC_FIREBASE_API_KEY is not defined. Please set it in your .env.local file and restart the server.');
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  throw new Error('Firebase config error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is not defined. Please set it in your .env.local file and restart the server.');
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error('Firebase config error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined. Please set it in your .env.local file and restart the server.');
}
// Add checks for other required variables if necessary, e.g., APP_ID, SENDER_ID if your app strictly depends on them from the start.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Log the configuration object that will be used to initialize Firebase
console.log("Firebase Config being used for initialization:", firebaseConfig);

let app: FirebaseApp;
let auth: Auth;

// Initialize Firebase
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);

export { app, auth };
