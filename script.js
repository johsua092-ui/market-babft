// ============================================
// ATOMIC MARKET - BABFT MARKETPLACE
// ============================================

// ACCESS CODE (GANTI SESUAI KEINGINAN TUANKU)
const MASTER_CODE = "tuanku123"; // <-- GANTI INI!

// MODERATOR DATA
let moderators = {
    1: { name: "Tuanku", role: "OWNER", avatar: "👑" },
    2: { name: "Mod 2", role: "MODERATOR", avatar: "🛡️" },
    3: { name: "Empty Slot", role: "Available", avatar: "➕", empty: true }
};

// BUILDS DATABASE (disimpan di localStorage)
let builds = [];

// LOAD SAVED BUILDS
function loadBuilds() {
    const saved = localStorage.getItem('atomicBuilds');
    if (saved) {
        builds = JSON.parse(saved);
        displayBuilds();
    }
}

// SAVE BUILDS
function saveBuilds() {
    localStorage.setItem('atomicBuilds', JSON.stringify(builds));
}

// DISPLAY BUILDS
function displayBuilds() {
    const grid = document.getElementById('buildGrid');
    if (!grid) return;
    
    if (builds.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #666;">
                ⚛️ No builds yet. Be the first to upload! ⚛️
            </div>
        `;
        return;
    }
    
    grid.innerHTML = builds.map((build, index) => `
        <div class="build-card" onclick="viewBuild(${index})">
            <div class="build-media">
                ${build.fileType === 'image' ? '🖼️' : build.fileType === 'video' ? '🎥' : '📦'}
            </div>
            <div class="build-info">
                <div class="build-name">${build.name}</div>
                <div class="build-type">${build.type}</div>
                <div class="build-desc">${build.desc.substring(0, 60)}${build.desc.length > 60 ? '...' : ''}</div>
            </div>
        </div>
    `).join('');
}

// CHECK ACCESS CODE
function checkAccess() {
    const code = document.getElementById('accessCode').value;
    
    if (code === MASTER_CODE) {
        document.getElementById('uploadForm').style.display = 'block';
        document.querySelector('.access-box').style.display = 'none';
        addLog('✅ Access granted! You can now upload builds.', 'success');
    } else {
        addLog('❌ Wrong access code!', 'error');
    }
}

// SUBMIT BUILD
function submitBuild() {
    const name = document.getElementById('buildName').value.trim();
    const type = document.getElementById('buildType').value;
    const desc = document.getElementById('buildDesc').value.trim();
    const file = document.getElementById('buildFile').files[0];
    const videoLink = document.getElementById('videoLink').value.trim();
    
    if (!name || !desc) {
        addLog('❌ Please fill all required fields!', 'error');
        return;
    }
    
    // SIMULASI UPLOAD FILE
    let fileType = 'none';
    if (file) {
        if (file.type.startsWith('image/')) fileType = 'image';
        else if (file.type.startsWith('video/')) fileType = 'video';
    }
    
    const newBuild = {
        name: name,
        type: type,
        desc: desc,
        fileType: fileType,
        videoLink: videoLink,
        date: new Date().toLocaleString(),
        author: moderators[1].name // Otomatis atas nama Tuanku
    };
    
    builds.unshift(newBuild); // Tambah di paling atas
    saveBuilds();
    displayBuilds();
    
    // Reset form
    document.getElementById('buildName').value = '';
    document.getElementById('buildDesc').value = '';
    document.getElementById('buildFile').value = '';
    document.getElementById('videoLink').value = '';
    
    addLog('✅ Build published successfully!', 'success');
}

// VIEW BUILD DETAIL
function viewBuild(index) {
    const build = builds[index];
    alert(`
        📦 ${build.name}
        Type: ${build.type}
        By: ${build.author}
        Date: ${build.date}
        
        Description:
        ${build.desc}
        
        ${build.videoLink ? 'Video: ' + build.videoLink : ''}
    `);
}

// CUSTOM MODERATOR
function customMod(modId) {
    document.getElementById('currentModId').value = modId;
    document.getElementById('modCustomName').value = moderators[modId].name || '';
    document.getElementById('modCustomRole').value = moderators[modId].role || '';
    document.getElementById('modCustomAvatar').value = moderators[modId].avatar || '';
    
    document.getElementById('modModal').style.display = 'block';
}

// ADD NEW MOD SLOT
function addMod(slot) {
    if (!moderators[slot]) {
        moderators[slot] = { name: "New Mod", role: "MODERATOR", avatar: "🛡️" };
        updateModDisplay();
    }
}

// SAVE MOD CUSTOMIZATION
function saveModCustom() {
    const modId = document.getElementById('currentModId').value;
    const newName = document.getElementById('modCustomName').value.trim();
    const newRole = document.getElementById('modCustomRole').value.trim();
    const newAvatar = document.getElementById('modCustomAvatar').value.trim();
    
    if (!moderators[modId]) {
        moderators[modId] = {};
    }
    
    if (newName) moderators[modId].name = newName;
    if (newRole) moderators[modId].role = newRole;
    if (newAvatar) moderators[modId].avatar = newAvatar;
    
    // Update display
    const nameElement = document.getElementById(`modName${modId}`);
    if (nameElement) nameElement.textContent = moderators[modId].name;
    
    // Update card
    const card = document.querySelector(`.mod-card[data-mod="${modId}"]`);
    if (card) {
        card.querySelector('.mod-avatar').textContent = moderators[modId].avatar;
        card.querySelector('.mod-role').textContent = moderators[modId].role;
    }
    
    closeModal();
    addLog(`✅ Moderator ${modId} updated!`, 'success');
}

// CLOSE MODAL
function closeModal() {
    document.getElementById('modModal').style.display = 'none';
}

// UPDATE MOD DISPLAY
function updateModDisplay() {
    // Bisa ditambah kalau mau refresh semua mod
}

// LOG FUNCTION
function addLog(message, type) {
    console.log(`[${type}] ${message}`);
    // Bisa ditambah notifikasi kecil kalau mau
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', function() {
    loadBuilds();
    
    // Set default moderators
    updateModDisplay();
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('modModal');
        if (event.target === modal) {
            closeModal();
        }
    };
});
