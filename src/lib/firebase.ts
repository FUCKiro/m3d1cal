import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBOuR5zzZj4_z4-sUoJeQ0u83tMIxZAAWM",
  authDomain: "healtcare-1c5b7.firebaseapp.com",
  projectId: "healtcare-1c5b7",
  storageBucket: "healtcare-1c5b7.firebasestorage.app",
  messagingSenderId: "212717178377",
  appId: "1:212717178377:web:064c97050d10fb043032d8",
  measurementId: "G-R78L6VJM4M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'europe-west1');

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, {
    forceOwnership: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support all of the
      // features required to enable persistence
      console.warn('The current browser doesn\'t support persistence.');
    }
  });
}

export { auth, db, functions };