// js/msdl.js
async function fetchMSDLData() {
  try {
    const response = await fetch('../data/products.json');
    const data = await response.json();
    
    // Tambahkan timestamp dinamis
    data.timestamp = new Date().toISOString();
    
    return data;
  } catch (error) {
    return {
      status: "error",
      message: "Failed to load data",
      timestamp: new Date().toISOString()
    };
  }
}

// Ekspos fungsi ke global scope
window.getMSDLData = fetchMSDLData;