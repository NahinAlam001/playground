
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Your web app's Firebase configuration (directly provided)
const firebaseConfig = {
  apiKey: "AIzaSyDH6iVSenNbWEgNe3-Vd3ddLCKpC77xpR4",
  authDomain: "profile-forge-ysnoa.firebaseapp.com",
  projectId: "profile-forge-ysnoa",
  storageBucket: "profile-forge-ysnoa.firebasestorage.app",
  messagingSenderId: "1016847199408",
  appId: "1:1016847199408:web:10347fc590a00f49d31f75"
  // measurementId is optional
};

// Initialize Firebase
// Using getApps() to prevent re-initialization if hot-reloading or other mechanisms cause this code to run multiple times.
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth };
