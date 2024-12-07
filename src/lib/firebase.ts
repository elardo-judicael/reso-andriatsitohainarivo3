import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDsmHZeVTbFj0sCDAq1pdS6mlR0EJU74Dg",
  authDomain: "nexus-591b2.firebaseapp.com",
  projectId: "nexus-591b2",
  storageBucket: "nexus-591b2.firebasestorage.app",
  messagingSenderId: "237991282730",
  appId: "1:237991282730:web:a7c4245bacaf4b69b9db53",
  measurementId: "G-6FP6GF7M09"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);