import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkYJtwm9mqrq2zFIIr0DXElYG44WIpswI",
    authDomain: "arka-5258.firebaseapp.com",
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

export { app, auth, db, realtimeDb };
