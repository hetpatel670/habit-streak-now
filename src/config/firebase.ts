
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUPz9SgPf1lWkO2o9dteVpa51-YlS92Ng",
  authDomain: "walkie-talkie-8cd3a.firebaseapp.com",
  projectId: "walkie-talkie-8cd3a",
  storageBucket: "walkie-talkie-8cd3a.appspot.com",
  messagingSenderId: "901629172992",
  appId: "1:901629172992:web:905faa33965694430b27e5"
};

// Lazy initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase only when needed
const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};

const getFirebaseAuth = (): Auth => {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
};

const getFirebaseFirestore = (): Firestore => {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
};

export { getFirebaseApp, getFirebaseAuth, getFirebaseFirestore };
