// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);