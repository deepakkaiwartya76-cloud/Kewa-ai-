import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "tumhari_firebase_api_key",
    authDomain: "tumhara_project.firebaseapp.com",
    projectId: "tumhara_firebase_project_id",
    storageBucket: "tumhara_project.appspot.com",
    messagingSenderId: "tumhara_messaging_sender_id",
    appId: "tumhara_app_id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// UI Elements for Login/Logout
const authContainer = document.createElement('div');
authContainer.id = 'auth-container';
authContainer.style.cssText = 'padding: 10px; background: #252525; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333;';

authContainer.innerHTML = `
    <span id="user-info" style="font-size: 0.9rem; color: #aaa;">Not logged in</span>
    <button id="auth-btn" style="background: #007bff; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Sign in with Google</button>
`;

// Insert auth container at the top of the chat container
const chatContainer = document.querySelector('.chat-container');
chatContainer.insertBefore(authContainer, chatContainer.firstChild);

const authBtn = document.getElementById('auth-btn');
const userInfo = document.getElementById('user-info');

authBtn.addEventListener('click', async () => {
    if (auth.currentUser) {
        // Logout
        try {
            await signOut(auth);
            localStorage.removeItem('firebaseToken');
            alert('Logged out successfully');
        } catch (error) {
            console.error('Logout Error:', error);
        }
    } else {
        // Login with Google
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            localStorage.setItem('firebaseToken', token);
        } catch (error) {
            console.error('Login Error:', error);
        }
    }
});

// Track Auth State Changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        userInfo.textContent = `Hello, ${user.displayName || user.email}`;
        authBtn.textContent = 'Logout';
        authBtn.style.background = '#dc3545';
    } else {
        userInfo.textContent = 'Not logged in';
        authBtn.textContent = 'Sign in with Google';
        authBtn.style.background = '#007bff';
    }
});

// Export token helper for script.js to use in API requests
export async function getAuthToken() {
    if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
    }
    return localStorage.getItem('firebaseToken') || null;
}
