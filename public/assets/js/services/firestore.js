import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Get user profile
async function getUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Get User Profile Error:', error);
    throw new Error('Failed to fetch user profile: ' + error.message);
  }
}

// Update user profile
async function updateUserProfile(uid, data) {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
  } catch (error) {
    console.error('Update User Profile Error:', error);
    throw new Error('Failed to update user profile: ' + error.message);
  }
}

// Get user bookings
async function getUserBookings(uid) {
  try {
    const bookingsSnapshot = await getDocs(collection(db, `users/${uid}/bookings`));
    const bookings = [];
    bookingsSnapshot.forEach(doc => {
      bookings.push({ id: doc.id, ...doc.data() });
    });
    return bookings;
  } catch (error) {
    console.error('Get User Bookings Error:', error);
    throw new Error('Failed to fetch bookings: ' + error.message);
  }
}

export { getUserProfile, updateUserProfile, getUserBookings };