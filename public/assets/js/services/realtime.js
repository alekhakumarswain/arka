import { realtimeDb } from './firebase-config.js';
import { ref, onValue, set, update } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

// Subscribe to live bus location
export function subscribeToBusLocation(busId, callback) {
  const busRef = ref(realtimeDb, `arka_realtime/live_buses/${busId}`);
  onValue(busRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || null);
  });
}

// Update bus location (for drivers)
export async function updateBusLocation(busId, location) {
  try {
    await set(ref(realtimeDb, `arka_realtime/live_buses/${busId}`), {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
      status: location.status || 'active'
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

// Subscribe to user location
export function subscribeToUserLocation(userId, callback) {
  const userRef = ref(realtimeDb, `arka_realtime/user_locations/${userId}`);
  onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || null);
  });
}

// Update user location
export async function updateUserLocation(userId, location) {
  try {
    await set(ref(realtimeDb, `arka_realtime/user_locations/${userId}`), {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

// Subscribe to trek live status
export function subscribeToTrekStatus(trekId, callback) {
  const trekRef = ref(realtimeDb, `arka_realtime/trek_live_status/${trekId}`);
  onValue(trekRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || null);
  });
}

// Update trek status
export async function updateTrekStatus(trekId, status) {
  try {
    await update(ref(realtimeDb, `arka_realtime/trek_live_status/${trekId}`), {
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
