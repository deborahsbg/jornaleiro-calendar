// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyADaKwc0YIOKWeP01mgmjkhufqbdeqK3ok",
    authDomain: "calendario-jornaleiro.firebaseapp.com",
    projectId: "calendario-jornaleiro",
    storageBucket: "calendario-jornaleiro.firebasestorage.app",
    messagingSenderId: "583164454011",
    appId: "1:583164454011:web:4e4073c9d50847fcc32ede"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);