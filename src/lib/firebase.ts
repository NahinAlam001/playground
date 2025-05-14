
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Your web app's Firebase configuration (directly provided)
const firebaseConfig = {
  apiKey: "AIzaSyDH6iVSenNbWEgNe3-Vd3ddLCKpC77xpR4",
  authDomain: "profile-forge-ysnoa.firebaseapp.com",
  projectId: "profile-forge-ysnoa",
  storageBucket: "profile-forge-ysnoa.firebasestorage.app", // Corrected from your .env.local example which had .firebasestorage.app, common mistake is projectid.appspot.com
  messagingSenderId: "1016847199408",
  appId: "1:1016847199408:web:10347fc590a00f49d31f75"
  // measurementId is optional, so it's fine if not present
};

// Log the configuration object that will be used to initialize Firebase
// console.log("Firebase Config being used for initialization:", firebaseConfig); // Kept for your verification, can be removed later

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
