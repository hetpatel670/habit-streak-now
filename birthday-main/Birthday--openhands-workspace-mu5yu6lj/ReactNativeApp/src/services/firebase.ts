import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration (same as HTML version)
const firebaseConfig = {
  apiKey: "AIzaSyBJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ",
  authDomain: "birthday-wishes-app-12345.firebaseapp.com",
  databaseURL: "https://birthday-wishes-app-12345-default-rtdb.firebaseio.com",
  projectId: "birthday-wishes-app-12345",
  storageBucket: "birthday-wishes-app-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuvwxyz",
  measurementId: "G-0L7W6M722D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const realtimeDb = getDatabase(app);
export const auth = getAuth(app);

export default app;