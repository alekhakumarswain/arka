import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyDkYJtwm9mqrq2zFIIr0DXElYG44WIpswI",
  authDomain: "arka-5258.firebaseapp.com",
  databaseURL: "https://arka-5258-default-rtdb.firebaseio.com",
  projectId: "arka-5258",
  storageBucket: "arka-5258.firebasestorage.app",
  messagingSenderId: "378365125891",
  appId: "1:378365125891:web:43e9ca1df58152d9f8b536",
  measurementId: "G-2V7TSEBWQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

// Set auth persistence to local
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Auth persistence set to local'))
  .catch(error => console.error('Error setting auth persistence:', error));

export { auth, db, realtimeDb };