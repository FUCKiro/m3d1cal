import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, writeBatch } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'europe-west1');