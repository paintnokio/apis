// js/soft.js
async function fetchMSDLData() {
  try {
    // Gunakan path absolut yang sesuai dengan subdomain
    const response = await fetch('/data/products.json');
    
    // Validasi respons
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Periksa content-type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got: ${contentType}. First 100 chars: ${text.substring(0, 100)}`);
    }
    
    const data = await response.json();
    
    // Tambahkan timestamp dinamis
    data.timestamp = new Date().toISOString();
    
    return data;
  } catch (error) {
    console.error('Error in fetchMSDLData:', error);
    return {
      status: "error",
      message: "Failed to load data: " + error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Fungsi untuk menangani endpoint /apis
async function handleMSDLEndpoint() {
  if (window.location.pathname === '/apis') {
    try {
      const data = await fetchMSDLData();
      
      // Set content-type header
      const meta = document.createElement('meta');
      meta.httpEquiv = "Content-Type";
      meta.content = "application/json";
      document.head.innerHTML = ''; // Clear existing head
      document.head.appendChild(meta);
      
      // Set title
      document.title = 'Softaware API - apis.devcomp.fun';
      
      // Tampilkan data
      document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (error) {
      document.body.innerHTML = `<pre>${JSON.stringify({
        status: "error",
        message: "Failed to process request",
        error: error.message
      }, null, 2)}</pre>`;
    }
  }
}

// Ekspos fungsi ke global scope
window.getMSDLData = fetchMSDLData;

// Jalankan handler endpoint saat halaman dimuat
document.addEventListener('DOMContentLoaded', handleMSDLEndpoint);