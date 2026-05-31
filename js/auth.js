// js/auth.js
import { auth, db } from './firebase-config.js';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const provider = new GoogleAuthProvider();
let currentUser = null;
let currentNickname = null;
let onUserChangeCallback = null;

export function getCurrentUser() { return currentUser; }
export function getCurrentNickname() { return currentNickname; }

export async function login() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userDocRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (!docSnap.exists()) {
            let nickname = prompt('✨ Escolha um NICKNAME público (ex: LeãoDeJudá, Serva, Vigia):', 'Jornaleiro');
            while (!nickname || nickname.trim() === '') {
                nickname = prompt('Nickname não pode ficar vazio:');
            }
            await setDoc(userDocRef, { email: user.email, nickname: nickname, createdAt: new Date().toISOString() });
            // Optional onboarding for badges
            const addBadges = confirm('✨ Quer adicionar sua cidade e país ao seu perfil? (aparece no Muro)');
            if (addBadges) {
                const city = prompt('🏙️ Digite sua cidade (ex: São Paulo, Nova York):');
                const country = prompt('🌍 Digite seu país (código ou nome, ex: BR, US, IL):');
                const identity = prompt('🕯️ Como você se identifica? (ex: Israelita, Messiânica, Gentio, Amigo de Israel) - opcional:');
                await updateDoc(userDocRef, {
                    city: city || '',
                    country: country || '',
                    identity: identity || ''
                });
            }
            alert(`✅ Bem-vindo, ${nickname}!`);
        }
        // The observer will trigger automatically
    } catch (error) {
        if (error.code === 'auth/popup-blocked') {
            alert('⚠️ Permitir pop-ups para este site no navegador.');
        } else {
            alert('Erro: ' + error.message);
        }
    }
}

export async function logout() {
    await signOut(auth);
}

export function initAuth(callback) {
    onUserChangeCallback = callback;
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (user) {
            const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
            const userData = userDoc.data();
            currentNickname = userData?.nickname || user.email.split('@')[0];
            // Attach badge data to user object for convenience
            currentUser.city = userData?.city || '';
            currentUser.country = userData?.country || '';
            currentUser.identity = userData?.identity || '';
        } else {
            currentNickname = null;
        }
        if (callback) callback(currentUser, currentNickname);
    });
}

// Attach login/logout to global buttons (will be called from index.html after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    if (loginBtn) loginBtn.addEventListener('click', login);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
});