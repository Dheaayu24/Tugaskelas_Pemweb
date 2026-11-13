const form = document.querySelector("#bookSearchForm");
const searchInput = document.querySelector("#bookSearchInput");
const searchButton = document.querySelector("#searchButton");
const resultsContainer = document.querySelector("#bookResults");
const statusMessage = document.querySelector("#statusMessage");
const resultsHeading = document.querySelector("#resultsHeading");
const resultCount = document.querySelector("#resultCount");
const mobileMenuButton = document.querySelector("#mobileMenuButton");
const mobileMenu = document.querySelector("#mobileMenu");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.toggle("hidden");
    mobileMenuButton.setAttribute("aria-expanded", String(!isHidden));
  });
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.className = isError
    ? "rounded-xl bg-red-50 text-red-700 p-4 mb-6"
    : "rounded-xl bg-blue-50 text-blue-800 p-4 mb-6";
  statusMessage.classList.remove("hidden");
}

function createBookCard(book) {
  const card = document.createElement("article");
  card.className = "book-card overflow-hidden rounded-2xl border border-slate-200 bg-white p-4";

  const cover = document.createElement("img");
  cover.className = "book-cover rounded-xl mb-4";
  cover.alt = book.title ? `Sampul buku ${book.title}` : "Sampul buku";
  cover.loading = "lazy";
  cover.src = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://placehold.co/300x420/e2e8f0/475569?text=No+Cover";

  const title = document.createElement("h3");
  title.className = "font-bold text-slate-900 leading-snug mb-2";
  title.textContent = book.title || "Judul tidak tersedia";

  const author = document.createElement("p");
  author.className = "text-sm text-slate-600 mb-2";
  author.textContent = `Penulis: ${(book.author_name || ["Tidak diketahui"]).slice(0, 2).join(", ")}`;

  const year = document.createElement("p");
  year.className = "text-xs text-slate-500 mb-4";
  year.textContent = `Tahun terbit pertama: ${book.first_publish_year || "Tidak diketahui"}`;

  const link = document.createElement("a");
  link.className = "inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800";
  link.href = book.key ? `https://openlibrary.org${book.key}` : "https://openlibrary.org/";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Lihat detail buku ↗";

  card.append(cover, title, author, year, link);
  return card;
}

async function searchBooks(query = "computer science") {
  resultsContainer.replaceChildren();
  resultCount.textContent = "";
  showStatus("Sedang mengambil data dari Open Library...");
  searchButton.disabled = true;
  searchButton.textContent = "Memuat...";

  try {
    const endpoint = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&fields=key,title,author_name,first_publish_year,cover_i`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("API tidak dapat diakses saat ini.");
    const data = await response.json();
    const books = data.docs || [];

    resultsHeading.textContent = query === "computer science" ? "Rekomendasi buku" : `Hasil pencarian: ${query}`;
    if (books.length === 0) {
      showStatus("Buku tidak ditemukan. Coba kata kunci lain.");
      return;
    }

    statusMessage.classList.add("hidden");
    resultCount.textContent = `${books.length} buku ditampilkan`;
    books.forEach(book => resultsContainer.appendChild(createBookCard(book)));
  } catch (error) {
    showStatus(`${error.message} Periksa koneksi internet, lalu coba lagi.`, true);
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Cari Buku";
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query) searchBooks(query);
});

searchBooks();
