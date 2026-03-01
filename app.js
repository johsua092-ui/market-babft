const ownerCredentials = { username: "znyt", password: "Root!Delta_7KpZ" };
const moderatorCredentials = [
    { username: "helper_tester", password: "huwydhdjsiqo" },
    { username: "sigma", password: "uBwbONeqIwYQ97" }
];

let currentUser = null;
let chatMessages = [];
const chatCleanupInterval = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('sendChatBtn').addEventListener('click', sendChat);
document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('clearChatBtn').addEventListener('click', clearChat);

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ownerCredentials.username && password === ownerCredentials.password) {
        currentUser = "owner";
    } else if (moderatorCredentials.some(mod => mod.username === username && mod.password === password)) {
        currentUser = "moderator";
    } else {
        alert('Invalid credentials');
        return;
    }

    localStorage.setItem('currentUser', currentUser);
    document.getElementById('displayName').innerText = `Logged in as: ${username}`;
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('chat-section').classList.remove('hidden');
    
    loadChat();
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('user-info').classList.add('hidden');
    document.getElementById('chat-section').classList.add('hidden');
}

function sendChat() {
    const message = document.getElementById('chat-input').value;
    if (message.trim() === "") return;

    const chatMessage = { sender: currentUser, message };
    chatMessages.push(chatMessage);
    displayChatMessages();
    document.getElementById('chat-input').value = '';
}

function displayChatMessages() {
    const chatBox = document.getElementById('chat-messages');
    chatBox.innerHTML = chatMessages.map(msg => {
        return `<div><strong>${msg.sender}</strong>: ${msg.message}</div>`;
    }).join('');
}

function clearChat() {
    if (currentUser === "owner" || currentUser === "moderator") {
        chatMessages = [];
        displayChatMessages();
    }
}

// Load user on page refresh
function loadChat() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = storedUser;
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('chat-section').classList.remove('hidden');
    }
}

// Clear chat every 2/3 hours
setInterval(() => {
    if (currentUser === "owner" || currentUser === "moderator") {
        clearChat();
    }
}, chatCleanupInterval);
