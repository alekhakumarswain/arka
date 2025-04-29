import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Get user profile
export async function getUserProfile(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'arka_users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Update user profile
export async function updateUserProfile(userId, data) {
  try {
    await updateDoc(doc(db, 'arka_users', userId), data);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Add a booking
export async function addBooking(userId, bookingData) {
  try {
    const bookingRef = await addDoc(collection(db, 'arka', 'bookings'), {
      userId,
      ...bookingData,
      created_at: new Date()
    });
    return bookingRef.id;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get user bookings
export async function getUserBookings(userId) {
  try {
    const q = query(collection(db, 'arka', 'bookings'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get bus details
export async function getBusDetails(busId) {
  try {
    const busDoc = await getDoc(doc(db, 'arka', 'buses', busId));
    return busDoc.exists() ? busDoc.data() : null;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get route details
export async function getRouteDetails(routeId) {
  try {
    const routeDoc = await getDoc(doc(db, 'arka', 'routes', routeId));
    return routeDoc.exists() ? routeDoc.data() : null;
  } catch (error) {
    throw new Error(error.message);
  }
}
