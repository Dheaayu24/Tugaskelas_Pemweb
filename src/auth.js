const USERS_KEY = 'edulearn_demo_users';
const SESSION_KEY = 'edulearn_demo_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}
function showMessage(element, message, success = false) {
  if (!element) return;
  element.textContent = message;
  element.className = success ? 'form-message success' : 'form-message';
}

document.querySelectorAll('.toggle-password').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.target);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.textContent = show ? 'Sembunyikan' : 'Lihat';
  });
});

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreed = document.getElementById('agreeTerms').checked;
    const message = document.getElementById('registerMessage');

    if (name.length < 2) return showMessage(message, 'Nama lengkap minimal 2 karakter.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage(message, 'Masukkan alamat email yang valid.');
    if (password.length < 6) return showMessage(message, 'Kata sandi harus terdiri dari minimal 6 karakter.');
    if (password !== confirmPassword) return showMessage(message, 'Konfirmasi kata sandi belum sama.');
    if (!agreed) return showMessage(message, 'Centang persetujuan terlebih dahulu.');

    const users = getUsers();
    if (users.some((user) => user.email === email)) return showMessage(message, 'Email ini sudah terdaftar. Silakan masuk.');
    users.push({ name, email, password });
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
    catch { return showMessage(message, 'Browser tidak dapat menyimpan data. Coba gunakan Live Server.'); }
    showMessage(message, 'Akun berhasil dibuat! Kamu akan diarahkan ke halaman Masuk.', true);
    registerForm.reset();
    setTimeout(() => { window.location.href = 'login.html?registered=1'; }, 1100);
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const message = document.getElementById('loginMessage');
  const params = new URLSearchParams(window.location.search);
  if (params.get('registered') === '1') showMessage(message, 'Pendaftaran berhasil. Silakan masuk dengan akunmu.', true);

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const user = getUsers().find((item) => item.email === email && item.password === password);
    if (!user) return showMessage(message, 'Email atau kata sandi tidak sesuai. Jika belum punya akun, silakan daftar.');
    const session = { name: user.name, email: user.email, signedInAt: new Date().toISOString() };
    try {
      const storage = document.getElementById('rememberMe').checked ? localStorage : sessionStorage;
      storage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch { /* Session demo tetap dapat ditampilkan meskipun penyimpanan dibatasi browser. */ }
    showMessage(message, `Berhasil masuk. Halo, ${user.name}! Kamu akan kembali ke beranda.`, true);
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  });

  document.getElementById('forgotLink').addEventListener('click', (event) => {
    event.preventDefault();
    showMessage(message, 'Fitur lupa kata sandi belum tersedia pada demo frontend ini. Silakan daftar ulang dengan email lain jika diperlukan.');
  });
}
