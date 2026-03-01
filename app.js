import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [builds, setBuilds] = useState([]);
  const [filteredBuilds, setFilteredBuilds] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [moderators, setModerators] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Form states
  const [loginUsername, setLoginUsername] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  const [buildTitle, setBuildTitle] = useState("");
  const [buildGame, setBuildGame] = useState("Blox Fruits");
  const [buildPrice, setBuildPrice] = useState("");
  const [buildDesc, setBuildDesc] = useState("");
  const [buildFile, setBuildFile] = useState(null);
  
  const [modUsername, setModUsername] = useState("");
  const [modPassword, setModPassword] = useState("");
  
  const [blacklistUsername, setBlacklistUsername] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");

  // Initialize device fingerprint
  useEffect(() => {
    const initFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    initFingerprint();

    // Load user from localStorage
    const savedUser = localStorage.getItem('oxyxUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load builds
    loadBuilds();
  }, []);

  // Auto-refresh chat for moderators
  useEffect(() => {
    if (currentUser && (currentUser.role === 'moderator' || currentUser.role === 'owner')) {
      loadChat();
      const interval = setInterval(loadChat, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && (currentUser.role === 'moderator' || currentUser.role === 'owner')) {
      loadModerators();
      loadBlacklist();
    }
  }, [currentUser]);

  // Filter builds
  useEffect(() => {
    if (currentFilter === "All") {
      setFilteredBuilds(builds);
    } else {
      setFilteredBuilds(builds.filter(b => b.game === currentFilter));
    }
  }, [builds, currentFilter]);

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const loadBuilds = async () => {
    try {
      const response = await axios.get(`${API}/builds`);
      setBuilds(response.data);
    } catch (error) {
      console.error('Error loading builds:', error);
    }
  };

  const loadModerators = async () => {
    try {
      const response = await axios.get(`${API}/moderators`);
      setModerators(response.data);
    } catch (error) {
      console.error('Error loading moderators:', error);
    }
  };

  const loadBlacklist = async () => {
    try {
      const response = await axios.get(`${API}/blacklist`);
      setBlacklist(response.data);
    } catch (error) {
      console.error('Error loading blacklist:', error);
    }
  };

  const loadChat = async () => {
    try {
      const response = await axios.get(`${API}/chat`, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });
      setChatMessages(response.data);
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const login = async () => {
    if (!loginUsername.trim()) {
      showToast('⚠️ Enter username!', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API}/auth/login`, {
        username: loginUsername,
        device_id: deviceId
      });

      if (response.data.success) {
        setCurrentUser(response.data.user);
        localStorage.setItem('oxyxUser', JSON.stringify(response.data.user));
        showToast(`✅ Welcome ${loginUsername}!`, 'success');
        setLoginUsername('');
      }
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Login failed'), 'error');
    }
  };

  const adminLogin = async () => {
    if (!adminUsername.trim() || !adminPassword.trim()) {
      showToast('⚠️ Enter credentials!', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API}/auth/admin-login`, {
        username: adminUsername,
        password: adminPassword,
        device_id: deviceId
      });

      if (response.data.success) {
        setCurrentUser(response.data.user);
        localStorage.setItem('oxyxUser', JSON.stringify(response.data.user));
        showToast(`✅ Welcome ${response.data.user.role.toUpperCase()}!`, 'success');
        setAdminUsername('');
        setAdminPassword('');
      }
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Login failed'), 'error');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('oxyxUser');
    showToast('👋 Logged out', 'info');
  };

  const uploadBuild = async (e) => {
    e.preventDefault();

    if (!buildFile) {
      showToast('⚠️ Select a .build file!', 'error');
      return;
    }

    if (!buildFile.name.endsWith('.build')) {
      showToast('❌ Only .build files allowed!', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', buildTitle);
    formData.append('game', buildGame);
    formData.append('price', buildPrice);
    formData.append('description', buildDesc);
    formData.append('file', buildFile);

    try {
      await axios.post(`${API}/builds`, formData, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId,
          'Content-Type': 'multipart/form-data'
        }
      });

      showToast('✅ Build uploaded!', 'success');
      setBuildTitle('');
      setBuildPrice('');
      setBuildDesc('');
      setBuildFile(null);
      document.getElementById('buildFile').value = '';
      loadBuilds();
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Upload failed'), 'error');
    }
  };

  const deleteBuild = async (buildId) => {
    if (!window.confirm('Delete this build?')) return;

    try {
      await axios.delete(`${API}/builds/${buildId}`, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });

      showToast('✅ Build deleted!', 'success');
      loadBuilds();
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Delete failed'), 'error');
    }
  };

  const downloadBuild = (buildId, filename) => {
    window.open(`${API}/builds/download/${buildId}`, '_blank');
    showToast('📥 Downloading...', 'info');
  };

  const addModerator = async () => {
    if (!modUsername.trim() || !modPassword.trim()) {
      showToast('⚠️ Enter mod credentials!', 'error');
      return;
    }

    try {
      await axios.post(`${API}/moderators`, {
        username: modUsername,
        password: modPassword
      }, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });

      showToast('✅ Moderator added!', 'success');
      setModUsername('');
      setModPassword('');
      loadModerators();
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Failed to add mod'), 'error');
    }
  };

  const removeModerator = async (username) => {
    if (!window.confirm(`Remove moderator ${username}?`)) return;

    try {
      await axios.delete(`${API}/moderators/${username}`, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });

      showToast('✅ Moderator removed!', 'success');
      loadModerators();
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Failed to remove mod'), 'error');
    }
  };

  const addToBlacklist = async () => {
    if (!blacklistUsername.trim() || !blacklistReason.trim()) {
      showToast('⚠️ Enter username and reason!', 'error');
      return;
    }

    try {
      await axios.post(`${API}/blacklist`, {
        username: blacklistUsername,
        reason: blacklistReason
      }, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });

      showToast('✅ User blacklisted!', 'success');
      setBlacklistUsername('');
      setBlacklistReason('');
      loadBlacklist();
      loadBuilds();
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Failed to blacklist'), 'error');
    }
  };

  const removeFromBlacklist = async (username) => {
    if (!window.confirm(`Remove ${username} from blacklist?`)) return;

    try {
      await axios.delete(`${API}/blacklist/${username}`, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });

      showToast('✅ User unblacklisted!', 'success');
      loadBlacklist();
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Failed to unblacklist'), 'error');
    }
  };

  const kickUser = async (username) => {
    if (!window.confirm(`Kick ${username} and delete all their builds?`)) return;

    try {
      await axios.post(`${API}/users/kick/${username}`, {}, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });

      showToast('✅ User kicked!', 'success');
      loadBuilds();
    } catch (error) {
      showToast('❌ ' + (error.response?.data?.detail || 'Failed to kick'), 'error');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${API}/chat`, {
        message: newMessage
      }, {
        headers: {
          'username': currentUser.username,
          'device-id': deviceId
        }
      });

      setNewMessage('');
      loadChat();
    } catch (error) {
      showToast('❌ Failed to send message', 'error');
    }
  };

  const games = ["Blox Fruits", "GPO", "Anime Defenders", "Build A Boat"];

  return (
    <div className="App">
      {/* CHAIN BACKGROUND */}
      <div className="chain-bg"></div>
      <div className="chain-vertical"></div>
      <div className="chain-diagonal"></div>
      <div className="chain-links"></div>
      
      {/* CORNER CHAINS */}
      <div className="corner-chain top-right"></div>
      <div className="corner-chain bottom-left"></div>

      <div className="container">
        {/* HEADER */}
        <div className="header">
          <h1>⚡ OXYX MARKET ⚡</h1>
        </div>

        {/* DISCORD LINKS */}
        <div className="discord-container">
          <a href="https://discord.gg/autobuild" target="_blank" rel="noopener noreferrer" className="discord-btn">🔮 MAIN SERVER</a>
          <a href="https://discord.gg/boatbuilderhub" target="_blank" rel="noopener noreferrer" className="discord-btn">⚡ TRADE SERVER</a>
          <a href="https://discord.gg/builders" target="_blank" rel="noopener noreferrer" className="discord-btn">🎮 BUILDER SERVER</a>
        </div>

        {/* AUTH SECTION */}
        {!currentUser ? (
          <div className="card">
            <h2>🔐 MEMBER ACCESS</h2>
            <div className="auth-section">
              <input
                type="text"
                placeholder="Enter username (any name for member)"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && login()}
              />
              <button className="auth-btn" onClick={login}>LOGIN AS MEMBER</button>
            </div>
            <div className="auth-section">
              <input
                type="text"
                placeholder="Admin username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && adminLogin()}
              />
              <button className="auth-btn" onClick={adminLogin}>ADMIN LOGIN</button>
            </div>
            <div className="member-info">
              👤 Members: Just enter any username to login and start uploading!
            </div>
          </div>
        ) : (
          <div className="card">
            <h2>👤 USER INFO</h2>
            <div className="user-info">
              <span id="displayName">🔥 {currentUser.username}</span>
              <span className="user-role">{currentUser.role.toUpperCase()}</span>
              <button className="auth-btn logout-btn" onClick={logout}>LOGOUT</button>
            </div>
          </div>
        )}

        {/* MODERATOR CHAT */}
        {currentUser && (currentUser.role === 'moderator' || currentUser.role === 'owner') && (
          <div className="card">
            <h2>💬 MODERATOR CHAT</h2>
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="chat-message">
                    <span className={`chat-sender ${msg.role}`}>
                      {msg.role === 'owner' ? '👑' : '🛡️'} {msg.sender}:
                    </span>
                    <span className="chat-text">{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="chat-input"
                />
                <button onClick={sendMessage} className="chat-send-btn">SEND</button>
              </div>
            </div>
          </div>
        )}

        {/* MODERATOR PANEL */}
        {currentUser && currentUser.role === 'owner' && (
          <div className="mod-panel">
            <h3 style={{color: 'gold', marginBottom: '15px'}}>👑 OWNER PANEL</h3>
            <div className="mod-grid">
              <div className="mod-item">
                <label>Add Moderator</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={modUsername}
                  onChange={(e) => setModUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={modPassword}
                  onChange={(e) => setModPassword(e.target.value)}
                />
                <button className="mod-btn" onClick={addModerator}>ADD MOD</button>
              </div>
            </div>

            <h4 style={{color: '#b300ff', marginTop: '20px', marginBottom: '10px'}}>Current Moderators ({moderators.length}/2)</h4>
            <div className="moderator-list">
              {moderators.map((mod) => (
                <div key={mod.id} className="moderator-item">
                  <span>🛡️ {mod.username}</span>
                  <button className="unblacklist-btn" onClick={() => removeModerator(mod.username)}>REMOVE</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLACKLIST PANEL */}
        {currentUser && (currentUser.role === 'moderator' || currentUser.role === 'owner') && (
          <div className="blacklist-panel">
            <h3 style={{color: '#ff4444', marginBottom: '15px'}}>🚫 BLACKLIST MANAGEMENT</h3>
            <div className="mod-grid">
              <div className="mod-item">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username to blacklist"
                  value={blacklistUsername}
                  onChange={(e) => setBlacklistUsername(e.target.value)}
                />
                <label>Reason</label>
                <input
                  type="text"
                  placeholder="Reason"
                  value={blacklistReason}
                  onChange={(e) => setBlacklistReason(e.target.value)}
                />
                <button className="mod-btn" style={{background: '#ff4444'}} onClick={addToBlacklist}>BLACKLIST</button>
              </div>
            </div>

            <h4 style={{color: '#ff4444', marginTop: '20px', marginBottom: '10px'}}>Blacklisted Users ({blacklist.length})</h4>
            <div className="blacklist-grid">
              {blacklist.map((bl) => (
                <div key={bl.id} className="blacklist-item">
                  <div>
                    <div>🚫 {bl.username}</div>
                    <div style={{fontSize: '0.8em', color: '#888'}}>{bl.reason}</div>
                  </div>
                  <button className="unblacklist-btn" onClick={() => removeFromBlacklist(bl.username)}>UNBAN</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPLOAD SECTION */}
        {currentUser && (
          <div className="card">
            <h2>📤 UPLOAD BUILD</h2>
            <form onSubmit={uploadBuild}>
              <div className="form-group">
                <label>Build Title</label>
                <input
                  type="text"
                  placeholder="Epic Build Name"
                  value={buildTitle}
                  onChange={(e) => setBuildTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Game</label>
                <select value={buildGame} onChange={(e) => setBuildGame(e.target.value)}>
                  {games.map((game) => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  placeholder="$5 or Free"
                  value={buildPrice}
                  onChange={(e) => setBuildPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your build..."
                  value={buildDesc}
                  onChange={(e) => setBuildDesc(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Build File (.build only)</label>
                <input
                  id="buildFile"
                  type="file"
                  accept=".build"
                  onChange={(e) => setBuildFile(e.target.files[0])}
                  required
                />
              </div>
              <button type="submit" className="upload-btn">🚀 UPLOAD BUILD</button>
            </form>
          </div>
        )}

        {/* MARKETPLACE */}
        <div className="card">
          <h2>🏪 MARKETPLACE</h2>
          
          <div className="filters">
            <button
              className={`filter-btn ${currentFilter === 'All' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('All')}
            >
              All Games
            </button>
            {games.map((game) => (
              <button
                key={game}
                className={`filter-btn ${currentFilter === game ? 'active' : ''}`}
                onClick={() => setCurrentFilter(game)}
              >
                {game}
              </button>
            ))}
          </div>

          <div className="marketplace">
            {filteredBuilds.length === 0 ? (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#888', padding: '40px'}}>
                No builds found. Be the first to upload!
              </div>
            ) : (
              filteredBuilds.map((build) => (
                <div key={build.id} className="build-card">
                  <div className="build-title">{build.title}</div>
                  <div className="build-info">🎮 {build.game}</div>
                  <div className="build-price">💰 {build.price}</div>
                  <div className="build-desc">{build.description}</div>
                  <div className="build-seller">👤 Seller: {build.uploader}</div>
                  <div className="file-info">📁 {build.filename}</div>
                  
                  <button
                    className="download-btn"
                    onClick={() => downloadBuild(build.id, build.filename)}
                  >
                    📥 DOWNLOAD
                  </button>
                  
                  {currentUser && (build.uploader === currentUser.username || currentUser.role === 'owner' || currentUser.role === 'moderator') && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteBuild(build.id)}
                    >
                      🗑️ DELETE
                    </button>
                  )}
                  
                  {currentUser && (currentUser.role === 'moderator' || currentUser.role === 'owner') && build.uploader !== currentUser.username && (
                    <button
                      className="kick-btn"
                      onClick={() => kickUser(build.uploader)}
                    >
                      ⚠️ KICK USER
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <p>⚡ OXYX MARKET - Ultimate Build Trading Platform ⚡</p>
          <p>Made with 💜 by the OXYX Team</p>
        </div>
      </div>
    </div>
  );
}

export default App;
