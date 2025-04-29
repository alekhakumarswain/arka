const dataUrl = '../assets/json/data.json';

async function fetchData() {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data.json:', error);
    return null;
  }
}

// Function to get locations for map page (filter or transform as needed)
async function getMapLocations() {
  const data = await fetchData();
  if (!data) return [];
  // Assuming data has a locations array or similar structure
  // Adjust according to actual data.json structure
  return data.locations || [];
}

// Function to get tourism items for tourism page
async function getTourismItems() {
  const data = await fetchData();
  if (!data) return [];
  // Assuming data has a tourism array or similar structure
  // Adjust according to actual data.json structure
  return data.tourism || [];
}

export { getMapLocations, getTourismItems };
