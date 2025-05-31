document.addEventListener("DOMContentLoaded", () => {
  // Fungsi fetch data dari data/products.json
  function fetchMSDLData() {
    return fetch('data/products.json')
      .then(response => {
        if (!response.ok) {
          return { status: "error", message: "Failed to load products.json" };
        }
        return response.json();
      })
      .then(data => {
        if (data.status !== "success") {
          return { status: "error", message: "Data status not success" };
        }
        return { status: "success", products: data.results };
      })
      .catch(error => {
        return { status: "error", message: error.message };
      });
  }

  // Mode terang/gelap
  const toggleButton = document.getElementById("mode-toggle");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.add("light-mode");
  }

  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
    const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
  });

  // Pencarian Produk
  const searchInput = document.getElementById("search-products");
  const productList = document.getElementById("product-list");

  fetchMSDLData().then((data) => {
    if (data.status === "error") {
      console.error("Error fetching product data:", data.message);
      productList.innerHTML = "<li>Gagal memuat data produk.</li>";
      return;
    }

    const products = data.products || [];
    renderProductList(products);

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );

      if (filtered.length > 0) {
        renderProductList(filtered);
      } else {
        productList.innerHTML = `<li>Produk tidak ditemukan.</li>`;
      }
    });
  });

  // Halaman List Produk
  function renderProductList(products) {
    productList.innerHTML = products
      .map((product) => `<li><a href="detail.html?id=${product.id}">${product.name}</a></li>`)
      .join("");
  }

  // Halaman Detail Produk
  if (window.location.pathname.includes("detail.html")) {
    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    // Tampilkan loader sementara
    const productTitleEl = document.getElementById("product-title");
    const productDescriptionEl = document.getElementById("product-description");
    const downloadButtonEl = document.getElementById("download-button");

    productTitleEl.textContent = "Memuat data produk...";
    productDescriptionEl.textContent = "Silakan tunggu, data sedang dimuat.";
    downloadButtonEl.style.display = "none"; // Sembunyikan tombol unduh sementara

    fetchMSDLData()
      .then((data) => {
        if (data.status === "error") {
          console.error("Error fetching product data:", data.message);
          alert("Terjadi kesalahan saat mengambil data produk.");
          window.location.href = "404.html";
          return;
        }

        const product = data.products.find((p) => p.id === productId);
        if (product) {
          productTitleEl.textContent = product.name;
          productDescriptionEl.textContent = product.description || "Deskripsi tidak tersedia.";
          downloadButtonEl.href = product.url;
          downloadButtonEl.style.display = "inline-block"; // Tampilkan tombol unduh
        } else {
          alert("Produk tidak ditemukan!");
          window.location.href = "404.html";
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert("Gagal memuat data produk. Silakan coba lagi nanti.");
        window.location.href = "404.html";
      });
  }
});