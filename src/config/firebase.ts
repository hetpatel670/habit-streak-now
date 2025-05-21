import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUPz9SgPf1lWkO2o9dteVpa51-YlS92Ng",
  authDomain: "walkie-talkie-8cd3a.firebaseapp.com",
  projectId: "walkie-talkie-8cd3a",
  storageBucket: "walkie-talkie-8cd3a.appspot.com",
  messagingSenderId: "901629172992",
  appId: "1:901629172992:web:905faa33965694430b27e5",
  databaseURL: "https://walkie-talkie-8cd3a-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };