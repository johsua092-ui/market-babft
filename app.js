// Data login tetap sesuai yang Anda berikan
const OWNER = { username: 'znyt', password: 'Root!Delta_7KpZ' };
const MODERATORS = [
  { username: 'helper_tester', password: 'huwydhdjsiqo' },
  { username: 'sigma', password: 'uBwbONeqIwYQ97' }
];

const deviceIdKey = 'device_id';

// Fungsi untuk generate device ID unik dan simpan di localStorage jika belum ada
function getDeviceId() {
  let deviceId = localStorage.getItem(deviceIdKey);
  if (!deviceId) {
    deviceId = 'device-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(deviceIdKey, deviceId);
  }
  return deviceId;
}

// Fungsi login device harus dipanggil di awal
const deviceId = getDeviceId();

let currentUser = null; // global user state

// Fungsi login
function loginMember(username) {
  // Cek device
  const savedDevice = localStorage.getItem('device_id');
  if (savedDevice && savedDevice !== deviceId) {
    alert('Device tidak valid!');
    return;
  } else {
    localStorage.setItem('device_id', deviceId);
  }

  // Login member
  currentUser = { username: username, role: 'member' };
  localStorage.setItem('user', JSON.stringify(currentUser));
  updateUI();
}

// Login admin/moderator
function loginAdmin(username, password) {
  if (username === OWNER.username && password === OWNER.password) {
    currentUser = { username: username, role: 'owner' };
  } else if (MODERATORS.some(m => m.username === username && m.password === password)) {
    currentUser = { username: username, role: 'moderator' };
  } else {
    alert('Invalid credentials!');
    return;
  }
  localStorage.setItem('user', JSON.stringify(currentUser));
  // Set device id
  localStorage.setItem('device_id', deviceId);
  updateUI();
}

// Logout
function logout() {
  localStorage.removeItem('user');
  currentUser = null;
  updateUI();
}

// Load user dari local storage
function loadUser() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    currentUser = JSON.parse(userStr);
  }
}

// Update UI berdasarkan user role
function updateUI() {
  // Implementasi DOM update di sini
  // misal:
  document.getElementById('auth-section').innerHTML = '';
  document.getElementById('user-info').innerHTML = '';

  if (!currentUser) {
    // Tampilkan form login member dan admin
    document.getElementById('auth-section').innerHTML = `
      <h2>Login Member</h2>
      <input type="text" id="member-username" placeholder="Enter username" />
      <button onclick="handleMemberLogin()">Login as Member</button>
      <h2>Admin Login</h2>
      <input type="text" id="admin-username" placeholder="Admin username" />
      <input type="password" id="admin-password" placeholder="Password" />
      <button onclick="handleAdminLogin()">Login as Admin</button>
    `;
  } else {
    // Tampilkan info user
    document.getElementById('user-info').innerHTML = `
      <p>🔥 ${currentUser.username} (${currentUser.role.toUpperCase()})</p>
      <button onclick="logout()">Logout</button>
    `;
    // Tampilkan chat dan panel sesuai role
    if (currentUser.role === 'owner' || currentUser.role === 'moderator') {
      renderModeratorChat();
      renderModeratorPanel();
      renderBlacklistSection();
    }
    renderUploadSection();
  }
}

// Handlers login
window.handleMemberLogin = () => {
  const username = document.getElementById('member-username').value.trim();
  if (username) {
    loginMember(username);
  } else {
    alert('Enter username!');
  }
};
window.handleAdminLogin = () => {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value.trim();
  if (username && password) {
    loginAdmin(username, password);
  } else {
    alert('Enter credentials!');
  }
};

// Render fungsi chat
function renderModeratorChat() {
  document.getElementById('moderator-chat').innerHTML = `
    <h2>💬 Moderator Chat</h2>
    <div style="border:1px solid #555; height:200px; overflow-y:auto; padding:10px" id="chat-messages"></div>
    <input type="text" id="chat-input" placeholder="Type message..." style="width:70%" />
    <button onclick="sendChat()">Send</button>
  `;
  loadChatMessages();
}

// Load chat messages dari server (API placeholder)
function loadChatMessages() {
  // Gantikan ini dengan API real-time
  // contoh: fetch dari backend
  // di sini kita pakai dummy data
  const messages = window.chatMessages || [];
  const container = document.getElementById('chat-messages');
  container.innerHTML = messages.map(m => `<p><b>${m.sender}:</b> ${m.message}</p>`).join('');
}

// Kirim chat
window.sendChat = () => {
  const message = document.getElementById('chat-input').value.trim();
  if (!message) return;
  if (!window.chatMessages) window.chatMessages = [];
  window.chatMessages.push({ sender: currentUser.username, message: message });
  document.getElementById('chat-input').value = '';
  loadChatMessages();
  // Kirim ke server via API jika ada
};

// Render panel moderator dan owner
function renderModeratorPanel() {
  if (currentUser.role !== 'owner') return;
  document.getElementById('moderator-panel').innerHTML = `
    <h3>👑 Owner Panel</h3>
    <button onclick="cleanChat()">Clean Chat</button>
  `;
}

// Fungsi bersihkan chat
window.cleanChat = () => {
  if (confirm('Are you sure to clean chat?')) {
    window.chatMessages = [];
    loadChatMessages();
  }
};

// Render blacklist section
function renderBlacklistSection() {
  if (currentUser.role !== 'owner' && currentUser.role !== 'moderator') return;
  document.getElementById('blacklist-section').innerHTML = `
    <h3>🚫 Blacklist Management</h3>
    <input type="text" id="blacklist-username" placeholder="Username" />
    <input type="text" id="blacklist-reason" placeholder="Reason" />
    <button onclick="addToBlacklist()">Blacklist</button>
    <h4>Blacklisted Users</h4>
    <div id="blacklist-list"></div>
  `;
  loadBlacklist();
}

let blacklist = [];
function loadBlacklist() {
  // dummy data, replace with API
  document.getElementById('blacklist-list').innerHTML = blacklist.map(b => `
    <div>
      🚫 ${b.username} - ${b.reason}
      <button onclick="removeFromBlacklist('${b.username}')">Remove</button>
    </div>
  `).join('');
}

window.addToBlacklist = () => {
  const username = document.getElementById('blacklist-username').value.trim();
  const reason = document.getElementById('blacklist-reason').value.trim();
  if (username && reason) {
    blacklist.push({ username, reason });
    loadBlacklist();
  } else {
    alert('Enter username and reason!');
  }
};

window.removeFromBlacklist = (username) => {
  blacklist = blacklist.filter(b => b.username !== username);
  loadBlacklist();
};

// Render upload build
function renderUploadSection() {
  if (!currentUser) return;
  document.getElementById('upload-section').innerHTML = `
    <h2>📤 Upload Build</h2>
    <input type="text" id="build-title" placeholder="Build Title" /><br/>
    <select id="build-game">
      <option value="Blox Fruits">Blox Fruits</option>
      <option value="GPO">GPO</option>
      <option value="Anime Defenders">Anime Defenders</option>
      <option value="Build A Boat">Build A Boat</option>
    </select><br/>
    <input type="text" id="build-price" placeholder="$5 or Free" /><br/>
    <textarea id="build-desc" placeholder="Describe your build..."></textarea><br/>
    <input type="file" id="build-file" accept=".build" /><br/>
    <button onclick="uploadBuild()">🚀 Upload Build</button>
  `;
}

window.uploadBuild = () => {
  const title = document.getElementById('build-title').value.trim();
  const game = document.getElementById('build-game').value;
  const price = document.getElementById('build-price').value.trim();
  const desc = document.getElementById('build-desc').value.trim();
  const fileInput = document.getElementById('build-file');
  const file = fileInput.files[0];
  if (!title || !price || !desc || !file) {
    alert('Fill all fields and select a file!');
    return;
  }
  if (!file.name.endsWith('.build')) {
    alert('File must be .build');
    return;
  }
  // Upload logic here with API
  alert('Build uploaded!');
};

// Logika real-time chat dan pembersihan otomatis bisa diatur lewat backend atau interval JS

// Saat halaman selesai load
loadUser();
updateUI();
