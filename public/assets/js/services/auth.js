import { auth, db } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();

// Login with Email and Password
async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login Error:', error);
    throw new Error(getFriendlyErrorMessage(error.code));
  }
}

// Signup with Email, Name, Phone, and Password
async function signupWithEmail(name, email, phone, password) {
  console.log('Starting signup process...');
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Auth created, user:', userCredential.user);
    
    const user = userCredential.user;
    console.log('Saving user profile to Firestore...');
    
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      phone,
      created_at: new Date().toISOString()
    });
    
    console.log('Profile saved successfully');
    return user;
  } catch (error) {
    console.error('Signup Error Details:', error);
    throw new Error(getFriendlyErrorMessage(error.code));
  }
}

// Sign in with Google (using redirect)
async function signInWithGoogle() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw new Error(getFriendlyErrorMessage(error.code));
  }
}

// Handle Google Sign-In redirect result
async function handleGoogleRedirectResult() {
  try {
    const userCredential = await getRedirectResult(auth);
    if (userCredential) {
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'Unknown',
        email: user.email,
        phone: user.phoneNumber || '',
        created_at: new Date().toISOString()
      }, { merge: true });
      return user;
    }
    return null;
  } catch (error) {
    console.error('Google Redirect Error:', error);
    throw new Error(getFriendlyErrorMessage(error.code));
  }
}

// Sign out user
async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Signout Error:', error);
    throw new Error(getFriendlyErrorMessage(error.code));
  }
}

// Monitor auth state changes
function onAuthStateChange(callback) {
  onAuthStateChanged(auth, callback);
}

// Friendly error messages
function getFriendlyErrorMessage(errorCode) {
  console.error('Firebase Auth Error Code:', errorCode);
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in or use a different email.';
    case 'auth/invalid-email':
      return 'Invalid email format. Please check your email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password (at least 6 characters).';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Contact support.';
    case 'auth/invalid-api-key':
      return 'Invalid Firebase configuration. Please contact support.';
    case 'auth/app-not-authorized':
      return 'App not authorized to use Firebase Authentication. Check Firebase Console.';
    case 'invalid-argument':
      return 'Invalid data provided. Please check your inputs.';
    default:
      return 'An error occurred. Please try again later.';
  }
}

export { loginWithEmail, signupWithEmail, signInWithGoogle, handleGoogleRedirectResult, signOutUser, onAuthStateChange };