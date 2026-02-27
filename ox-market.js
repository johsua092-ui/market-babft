// ============================================
// OXYX MARKET - FINAL VERSION
// MASTER KEY: oxyx2025
// ============================================

// MASTER KEY (GANTI SESUAI KEINGINAN)
const MASTER_KEY = "oxyx2025";

// DATA MODERATOR
let moderators = {
    2: { name: "MODERATOR 1", role: "MODERATOR", avatar: "🛡️" },
    3: { name: "MODERATOR 2", role: "MODERATOR", avatar: "⚔️" }
};

// BUILDS DATABASE
let builds = JSON.parse(localStorage.getItem('oxyxBuilds')) || [];
let premiumPending = JSON.parse(localStorage.getItem('oxyxPremium')) || [];

// CHAT SYSTEM
let chats = {};

// INIT
document.addEventListener('DOMContentLoaded', function() {
    displayBuilds();
    displayPremiumPending();
    playOxSound();
});

// SOUND AUTO PLAY
function playOxSound() {
    const audio = new Audio('https://www.myinstants.com/media/sounds/ox-sound.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
        // Fallback - tunggu interaksi
        document.addEventListener('click', function once() {
            audio.play();
            document.removeEventListener('click', once);
        }, { once: true });
    });
}

// UNLOCK MOD EDIT
function unlockModEdit() {
    const key = document.getElementById('modKey').value;
    if (key === MASTER_KEY) {
        document.getElementById('modEditPanel').style.display = 'block';
        loadModData();
        showNotification('✅ Moderator panel unlocked!', 'success');
    } else {
        showNotification('❌ Wrong master key!', 'error');
    }
}

// LOAD MOD DATA
function loadModData() {
    document.getElementById('editName2').value = moderators[2].name;
    document.getElementById('editRole2').value = moderators[2].role;
    document.getElementById('editAvatar2').value = moderators[2].avatar;
    document.getElementById('editName3').value = moderators[3].name;
    document.getElementById('editRole3').value = moderators[3].role;
    document.getElementById('editAvatar3').value = moderators[3].avatar;
}

// SAVE MOD CHANGES
function saveModChanges() {
    moderators[2] = {
        name: document.getElementById('editName2').value,
        role: document.getElementById('editRole2').value,
        avatar: document.getElementById('editAvatar2').value
    };
    moderators[3] = {
        name: document.getElementById('editName3').value,
        role: document.getElementById('editRole3').value,
        avatar: document.getElementById('editAvatar3').value
    };
    
    // Update display
    document.getElementById('modName2').textContent = moderators[2].name;
    document.getElementById('modRole2').textContent = moderators[2].role;
    document.getElementById('modPerms2').innerHTML = '✅ ACTIVE';
    
    document.getElementById('modName3').textContent = moderators[3].name;
    document.getElementById('modRole3').textContent = moderators[3].role;
    document.getElementById('modPerms3').innerHTML = '✅ ACTIVE';
    
    showNotification('✅ Moderators updated!', 'success');
}

// UNLOCK UPLOAD
function unlockUpload() {
    const key = document.getElementById('uploadKey').value;
    if (key === MASTER_KEY) {
        document.getElementById('uploadForm').style.display = 'block';
        document.querySelector('.key-access').style.display = 'none';
        showNotification('✅ Upload panel unlocked!', 'success');
    } else {
        showNotification('❌ Wrong upload key!', 'error');
    }
}

// SUBMIT BUILD
function submitBuild() {
    const name = document.getElementById('buildName').value;
    const type = document.getElementById('buildType').value;
    const desc = document.getElementById('buildDesc').value;
    const downloadLink = document.getElementById('downloadLink').value;
    const youtubeLink = document.getElementById('youtubeLink').value;
    const isPremium = document.getElementById('isPremium').checked;
    
    if (!name || !desc) {
        showNotification('❌ Name and description required!', 'error');
        return;
    }
    
    const build = {
        id: Date.now(),
        name,
        type,
        desc,
        downloadLink,
        youtubeLink,
        isPremium,
        date: new Date().toLocaleString(),
        seller: 'TUANKU',
        approved: !isPremium // Premium perlu approval
    };
    
    if (isPremium) {
        premiumPending.push(build);
        localStorage.setItem('oxyxPremium', JSON.stringify(premiumPending));
        showNotification('💎 Premium build sent for review!', 'info');
    } else {
        builds.push(build);
        localStorage.setItem('oxyxBuilds', JSON.stringify(builds));
        displayBuilds();
        showNotification('✅ Build published!', 'success');
    }
    
    // Reset form
    document.getElementById('buildName').value = '';
    document.getElementById('buildDesc').value = '';
    document.getElementById('downloadLink').value = '';
    document.getElementById('youtubeLink').value = '';
    document.getElementById('isPremium').checked = false;
}

// DISPLAY BUILDS
function displayBuilds() {
    const grid = document.getElementById('buildGrid');
    if (builds.length === 0) {
        grid.innerHTML = '<div class="empty-state">📦 No builds yet</div>';
        return;
    }
    
    grid.innerHTML = builds.filter(b => b.approved).map(build => `
        <div class="build-card">
            <div class="build-media">🖼️</div>
            <div class="build-info">
                <div class="build-name">
                    ${build.name}
                    ${build.isPremium ? '<span class="premium-badge">💎</span>' : ''}
                </div>
                <div class="build-type">${build.type}</div>
                <div class="build-desc">${build.desc.substring(0, 60)}...</div>
                <div class="build-actions">
                    <button onclick="viewBuild(${build.id})">🔍 VIEW</button>
                    <button onclick="chatWithSeller(${build.id})">💬 CHAT</button>
                </div>
            </div>
        </div>
    `).join('');
}

// DISPLAY PREMIUM PENDING (OWNER ONLY)
function displayPremiumPending() {
    const grid = document.getElementById('premiumGrid');
    if (!grid) return;
    
    if (premiumPending.length > 0) {
        document.getElementById('premiumPanel').style.display = 'block';
        grid.innerHTML = premiumPending.map(build => `
            <div class="premium-card">
                <h4>${build.name}</h4>
                <p>${build.desc}</p>
                <button onclick="approvePremium(${build.id})">✅ APPROVE</button>
                <button onclick="rejectPremium(${build.id})">❌ REJECT</button>
            </div>
        `).join('');
    }
}

// APPROVE PREMIUM
function approvePremium(id) {
    const build = premiumPending.find(b => b.id === id);
    build.approved = true;
    builds.push(build);
    premiumPending = premiumPending.filter(b => b.id !== id);
    
    localStorage.setItem('oxyxBuilds', JSON.stringify(builds));
    localStorage.setItem('oxyxPremium', JSON.stringify(premiumPending));
    
    displayBuilds();
    displayPremiumPending();
    showNotification('💎 Premium build approved!', 'success');
}

// VIEW BUILD
function viewBuild(id) {
    const build = builds.find(b => b.id === id);
    alert(`
        📦 ${build.name}
        Type: ${build.type}
        Seller: ${build.seller}
        
        Description:
        ${build.desc}
        
        Download: ${build.downloadLink || 'No link'}
        YouTube: ${build.youtubeLink || 'No video'}
    `);
}

// CHAT WITH SELLER
function chatWithSeller(id) {
    document.getElementById('chatModal').style.display = 'block';
    document.getElementById('chatTitle').textContent = `💬 Chat about build #${id}`;
    // Chat logic here
}

// CLOSE CHAT
function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
}

// SEND MESSAGE
function sendMessage() {
    const msg = document.getElementById('chatInput').value;
    if (msg) {
        const chatBox = document.getElementById('chatMessages');
        chatBox.innerHTML += `<div class="message user">You: ${msg}</div>`;
        document.getElementById('chatInput').value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// NOTIFICATION
function showNotification(msg, type) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00aa00' : type === 'error' ? '#ff0000' : '#b300ff'};
        color: white;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

// UTILS
function generateId() {
    return Date.now() + Math.random();
}
