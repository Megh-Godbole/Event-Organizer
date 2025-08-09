import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARu66CnQvloC0q7YgsrsKxr70tNhkhkMU",
  authDomain: "event-organizer-app-fb145.firebaseapp.com",
  projectId: "event-organizer-app-fb145",
  storageBucket: "event-organizer-app-fb145.firebasestorage.app",
  messagingSenderId: "419519455280",
  appId: "1:419519455280:web:82fe3432894c7b74744df5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);