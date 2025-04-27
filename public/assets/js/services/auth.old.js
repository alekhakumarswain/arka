import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase configuration (replace with actual values from .env)
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

// Login with email and password
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Signup with email, password, name, and phone
export async function signupWithEmail(name, email, phone, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await user.updateProfile({ displayName: name });
    
    // Save additional user info to Firestore
    await setDoc(doc(db, 'arka', 'users', user.uid, 'profile'), {
      name,
      email,
      phone,
      join_date: new Date()
    });
    
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Save user info to Firestore if new user
    await setDoc(doc(db, 'arka', 'users', user.uid, 'profile'), {
      name: user.displayName,
      email: user.email,
      phone: user.phoneNumber || '',
      join_date: new Date()
    }, { merge: true });
    
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Monitor auth state
export function onAuthStateChange(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}