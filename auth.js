import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA9_FoWPO08VQgPF9xbzMYviKDYh6UhU14",
    authDomain: "kewa-webs-fefe0.firebaseapp.com",
    projectId: "kewa-webs-fefe0",
    storageBucket: "kewa-webs-fefe0.firebasestorage.app",
    messagingSenderId: "109614843107",
    appId: "1:109614843107:web:4792973c9655f2cb1b31d6",
    measurementId: "G-NQRCPDM9BB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const userProfileDiv = document.querySelector('.user-profile');
if (userProfileDiv) {
    userProfileDiv.style.cursor = 'pointer';
    userProfileDiv.title = 'Click to Sign In / Sign Out';
    
    userProfileDiv.addEventListener('click', async () => {
        if (auth.currentUser) {
            try {
                await signOut(auth);
                localStorage.removeItem('firebaseToken');
                alert('Logged out successfully');
            } catch (error) {
                console.error('Logout Error:', error);
            }
        } else {
            try {
                const result = await signInWithPopup(auth, provider);
                const token = await result.user.getIdToken();
                localStorage.setItem('firebaseToken', token);
            } catch (error) {
                console.error('Login Error:', error);
            }
        }
    });
}

onAuthStateChanged(auth, (user) => {
    const usernameSpan = document.querySelector('.username');
    const avatarSpan = document.querySelector('.avatar');
    
    if (user) {
        if (usernameSpan) usernameSpan.textContent = user.displayName || user.email;
        if (avatarSpan && user.photoURL) {
            avatarSpan.innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:50%;">`;
        }
    } else {
        if (usernameSpan) usernameSpan.textContent = 'Deepak';
        if (avatarSpan) avatarSpan.textContent = 'D';
    }
});

export async function getAuthToken() {
    if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
    }
    return localStorage.getItem('firebaseToken') || null;
}
