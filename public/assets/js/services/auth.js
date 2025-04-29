import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

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
    await setDoc(doc(db, 'arka_users', user.uid), {
      name,
      email,
      phone,
      photoURL: user.photoURL || '',
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
    await setDoc(doc(db, 'arka_users', user.uid), {
      name: user.displayName,
      email: user.email,
      phone: user.phoneNumber || '',
      photoURL: user.photoURL || '',
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
