import { auth, realtimeDb } from '/assets/js/services/firebase-config.js';
import { onAuthStateChange, signInAnonymously, signOutUser } from '/assets/js/services/auth.js';
import { subscribeToBusLocation } from '/assets/js/services/realtime.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// Initialize Leaflet map
const map = L.map('map').setView([20.2961, 85.8245], 10); // Default center (Bhubaneswar)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Markers object to track live updates
const markers = {};

async function initializeAppData() {
  try {
    // Handle authentication state
    onAuthStateChange(async (user) => {
      const signoutLink = document.getElementById('signout-link');
      if (user) {
        console.log('User authenticated with UID:', user.uid);
        signoutLink.style.display = 'block'; // Show sign-out link

        // Fetch user preferences to apply theme
        const userRef = ref(realtimeDb, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData && userData.preferences && userData.preferences.theme) {
            document.body.classList.remove('light', 'dark');
            document.body.classList.add(userData.preferences.theme.toLowerCase());
          } else {
            document.body.classList.add('dark'); // Default to dark theme if no preference
          }
        }, (error) => {
          console.error('Error fetching user preferences:', error);
          document.body.classList.add('dark'); // Default to dark theme on error
        });

        // Fetch and display buses
        await loadBuses();
      } else {
        console.log('No user signed in, signing in anonymously...');
        await signInAnonymously(auth);
        signoutLink.style.display = 'none'; // Hide sign-out link
      }
    });

    // Handle sign-out
    document.getElementById('signout-link').addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await signOutUser();
        console.log('User signed out');
        window.location.href = '/Auth.html'; // Redirect to login page
      } catch (error) {
        console.error('Sign out error:', error);
      }
    });
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

async function loadBuses() {
  // Fetch initial bus data
  const busesRef = ref(realtimeDb, 'buses');
  onValue(busesRef, (snapshot) => {
    const buses = snapshot.val();
    console.log('Buses:', buses);
    if (buses) {
      displayBuses(buses);

      // Subscribe to live updates for each bus
      for (const busId in buses) {
        subscribeToBusLocation(busId, (liveData) => {
          if (liveData) {
            updateLiveBusLocation(busId, liveData);
          }
        });
      }
    }
  }, (error) => {
    console.error('Error fetching buses:', error);
  });

  // Fetch routes (optional, for additional context)
  const routesRef = ref(realtimeDb, 'routes');
  onValue(routesRef, (snapshot) => {
    const routes = snapshot.val();
    console.log('Routes:', routes);
  }, (error) => {
    console.error('Error fetching routes:', error);
  });
}

function displayBuses(buses) {
  const busList = document.getElementById('bus-list');
  busList.innerHTML = ''; // Clear existing content

  // Clear existing markers except those updated by live data
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker && !markers[layer.busId]) {
      map.removeLayer(layer);
    }
  });

  // Iterate over buses
  for (const busId in buses) {
    const bus = buses[busId];
    const { route, live_status, seats_available, total_seats, current_location } = bus;

    // Create bus card
    const busCard = document.createElement('div');
    busCard.className = 'bus-card animate__animated animate__fadeIn';
    busCard.dataset.busId = busId; // Store busId in the DOM for live updates
    busCard.innerHTML = `
      <h3>${route}</h3>
      <p>Status: <span class="status-${live_status.toLowerCase().replace(' ', '-')}">${live_status}</span></p>
      <p>Seats Available: ${seats_available} / ${total_seats}</p>
      <p>Location: (<span class="lat">${current_location.lat}</span>, <span class="lng">${current_location.lng}</span>)</p>
    `;
    busList.appendChild(busCard);

    // Add marker to map
    if (!markers[busId]) {
      const marker = L.marker([current_location.lat, current_location.lng])
        .addTo(map)
        .bindPopup(`<b>${route}</b><br>Status: ${live_status}<br>Seats: ${seats_available}/${total_seats}`);
      marker.busId = busId; // Attach busId to marker for live updates
      markers[busId] = marker;
    }
  }
}

function updateLiveBusLocation(busId, liveData) {
  const { latitude, longitude, status } = liveData;

  // Update marker position
  if (markers[busId]) {
    markers[busId].setLatLng([latitude, longitude]);
    const popupContent = markers[busId].getPopup().getContent().replace(/Status: .*<br>/, `Status: ${status}<br>`);
    markers[busId].setPopupContent(popupContent);
  }

  // Update bus card location and status
  const busCard = document.querySelector(`.bus-card[data-bus-id="${busId}"]`);
  if (busCard) {
    busCard.querySelector('.lat').textContent = latitude;
    busCard.querySelector('.lng').textContent = longitude;
    const statusSpan = busCard.querySelector('span[class^="status-"]');
    statusSpan.className = `status-${status.toLowerCase().replace(' ', '-')}`;
    statusSpan.textContent = status;
  }
}

// Store buses in localStorage for reference in live updates (simplified approach)
onValue(ref(realtimeDb, 'buses'), (snapshot) => {
  localStorage.setItem('buses', JSON.stringify(snapshot.val()));
});

// Initialize the app
initializeAppData();