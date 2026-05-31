// js/muro.js
import { db } from './firebase-config.js';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, query, orderBy, where, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { escapeHtml, timeAgo, getCountryFlag } from './utils.js';

let currentUser = null;
let currentNickname = null;

export function setmuroUser(user, nickname) {
    currentUser = user;
    currentNickname = nickname;
}

export async function enviarPost(texto) {
    if (!currentUser) { alert('Faça login para postar.'); return false; }
    if (texto.length > 500) { alert('Máximo 500 caracteres.'); return false; }
    if (texto.trim().length < 3) { alert('Mensagem muito curta.'); return false; }
    try {
        await addDoc(collection(db, 'posts'), {
            texto: texto.trim(),
            autor_nick: currentNickname,
            autor_uid: currentUser.uid,
            createdAt: new Date().toISOString(),
            tag: 'oracao', // default, can be changed by UI
            reactions: { pray: 0, fire: 0, flower: 0, bolt: 0, like: 0 }
        });
        return true;
    } catch (error) { alert('Erro ao postar: ' + error.message); return false; }
}

export async function novaResposta(postId, texto) {
    if (!currentUser) { alert('Faça login para responder.'); return false; }
    if (texto.length > 500) { alert('Máximo 500 caracteres.'); return false; }
    try {
        const respostaRef = await addDoc(collection(db, 'respostas'), {
            post_id: postId,
            texto: texto.trim(),
            autor_nick: currentNickname,
            autor_uid: currentUser.uid,
            createdAt: new Date().toISOString(),
            reactions: { pray: 0, fire: 0, flower: 0, bolt: 0, like: 0 }
        });
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, { respostas: arrayUnion(respostaRef.id) });
        return true;
    } catch (error) { alert('Erro ao responder: ' + error.message); return false; }
}

export async function darReaction(colecao, id, reactionType) {
    if (!currentUser) { alert('Faça login para reagir.'); return; }
    const ref = doc(db, colecao, id);
    const docSnap = await getDoc(ref);
    const reactions = docSnap.data()?.reactions || {};
    const currentCount = reactions[reactionType] || 0;
    // Simple toggle for demo – you can implement more sophisticated logic
    await updateDoc(ref, { [`reactions.${reactionType}`]: currentCount + 1 });
}

export function carregarmuro(containerId, user = null, loadMore = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    onSnapshot(q, async (snapshot) => {
        container.innerHTML = '';
        if (snapshot.empty) {
            container.innerHTML = '<div class="aviso">🙏 Nenhuma oração compartilhada ainda. Seja o primeiro.</div>';
            return;
        }
        for (const postDoc of snapshot.docs) {
            const post = postDoc.data();
            const autorSnap = await getDoc(doc(db, 'usuarios', post.autor_uid));
            const autorData = autorSnap.data() || {};
            const country = autorData.country || '';
            const identity = autorData.identity || '';
            const city = autorData.city || '';
            
            let badgeHtml = '';
            if (identity) badgeHtml += `<span class="badge badge-identity">🕯️ ${escapeHtml(identity)}</span>`;
            if (city) badgeHtml += `<span class="badge">📍 ${escapeHtml(city)}</span>`;
            if (country) badgeHtml += `<span class="badge badge-country">${getCountryFlag(country)} ${escapeHtml(country)}</span>`;
            
            const reactions = post.reactions || { pray:0, fire:0, flower:0, bolt:0, like:0 };
            
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';
            postDiv.innerHTML = `
                <div class="post-header">
                    <div class="post-author">${escapeHtml(post.autor_nick)}</div>
                    <div class="post-badges">${badgeHtml}</div>
                    <div style="font-size: 0.6rem; color: #6c6f6b;">${timeAgo(post.createdAt)}</div>
                </div>
                <div class="post-text">${escapeHtml(post.texto)}</div>
                <div class="reactions">
                    <button class="reaction-btn" data-reaction="pray">🙏 ${reactions.pray}</button>
                    <button class="reaction-btn" data-reaction="fire">🔥 ${reactions.fire}</button>
                    <button class="reaction-btn" data-reaction="flower">🌸 ${reactions.flower}</button>
                    <button class="reaction-btn" data-reaction="bolt">⚡ ${reactions.bolt}</button>
                    <button class="reaction-btn" data-reaction="like">❤️ ${reactions.like}</button>
                    <button class="reaction-btn responder-btn">💬 Responder</button>
                    <button class="reaction-btn traduzir-btn" data-texto="${escapeHtml(post.texto)}">🌐 Traduzir</button>
                </div>
                <div id="respostas-${postDoc.id}" class="reply-thread"></div>
                <div id="resposta-form-${postDoc.id}" style="display: none; margin-top: 12px;">
                    <textarea rows="2" maxlength="500" placeholder="Escreva sua resposta..."></textarea>
                    <button class="btn-small enviar-resposta" data-id="${postDoc.id}">Enviar</button>
                </div>
            `;
            container.appendChild(postDiv);
            
            // Load replies for this post
            const respostasQuery = query(collection(db, 'respostas'), where('post_id', '==', postDoc.id), orderBy('createdAt', 'asc'));
            const respostasSnap = await getDocs(respostasQuery);
            const respostasDiv = postDiv.querySelector(`#respostas-${postDoc.id}`);
            for (const respDoc of respostasSnap.docs) {
                const resp = respDoc.data();
                const respAutor = await getDoc(doc(db, 'usuarios', resp.autor_uid));
                const respData = respAutor.data() || {};
                const respReactions = resp.reactions || {};
                const respDiv = document.createElement('div');
                respDiv.className = 'reply-item';
                respDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <strong>${escapeHtml(resp.autor_nick)}</strong>
                        <span style="font-size: 0.6rem;">${timeAgo(resp.createdAt)}</span>
                    </div>
                    <div>${escapeHtml(resp.texto)}</div>
                    <div class="reactions" style="margin-top: 8px;">
                        <button class="reaction-btn" data-colecao="respostas" data-id="${respDoc.id}" data-reaction="pray">🙏 ${respReactions.pray || 0}</button>
                        <button class="reaction-btn" data-colecao="respostas" data-id="${respDoc.id}" data-reaction="fire">🔥 ${respReactions.fire || 0}</button>
                        <button class="reaction-btn" data-colecao="respostas" data-id="${respDoc.id}" data-reaction="flower">🌸 ${respReactions.flower || 0}</button>
                        <button class="reaction-btn" data-colecao="respostas" data-id="${respDoc.id}" data-reaction="bolt">⚡ ${respReactions.bolt || 0}</button>
                        <button class="reaction-btn" data-colecao="respostas" data-id="${respDoc.id}" data-reaction="like">❤️ ${respReactions.like || 0}</button>
                    </div>
                `;
                respostasDiv.appendChild(respDiv);
            }
        }
        attachReactionEvents();
        attachResponderEvents();
        attachTraduzirEvents();
    });
}

function attachReactionEvents() {
    document.querySelectorAll('.reaction-btn[data-reaction]').forEach(btn => {
        btn.removeEventListener('click', reactionHandler);
        btn.addEventListener('click', reactionHandler);
    });
}

async function reactionHandler(e) {
    const btn = e.currentTarget;
    const reaction = btn.dataset.reaction;
    const colecao = btn.dataset.colecao || 'posts';
    let id = btn.closest('.post-item')?.getAttribute('data-id') || btn.dataset.id;
    if (!id && colecao === 'posts') {
        id = btn.closest('.post-item').querySelector('.responder-btn')?.dataset.id;
    }
    if (!id) return;
    await darReaction(colecao, id, reaction);
    // Refresh muro or update UI locally (for demo, we just reload the whole muro)
    carregarmuro('listamuro', currentUser);
}

function attachResponderEvents() {
    document.querySelectorAll('.responder-btn').forEach(btn => {
        btn.removeEventListener('click', responderHandler);
        btn.addEventListener('click', responderHandler);
    });
    document.querySelectorAll('.enviar-resposta').forEach(btn => {
        btn.removeEventListener('click', enviarRespostaHandler);
        btn.addEventListener('click', enviarRespostaHandler);
    });
}

function responderHandler(e) {
    const postId = e.currentTarget.closest('.post-item').querySelector('.responder-btn').dataset.id;
    const form = document.getElementById(`resposta-form-${postId}`);
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function enviarRespostaHandler(e) {
    const postId = e.currentTarget.dataset.id;
    const textarea = document.getElementById(`resposta-form-${postId}`).querySelector('textarea');
    const texto = textarea.value.trim();
    if (await novaResposta(postId, texto)) {
        textarea.value = '';
        document.getElementById(`resposta-form-${postId}`).style.display = 'none';
        carregarmuro('listamuro', currentUser);
    }
}

function attachTraduzirEvents() {
    document.querySelectorAll('.traduzir-btn').forEach(btn => {
        btn.removeEventListener('click', traduzirHandler);
        btn.addEventListener('click', traduzirHandler);
    });
}

async function traduzirHandler(e) {
    const textoOriginal = e.currentTarget.dataset.texto;
    const lang = prompt('Digite o código do idioma (pt, en, es, he, fr, de):', 'en');
    if (!lang) return;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(textoOriginal)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const traducao = data[0][0][0];
        alert(`Tradução (${lang}):\n${traducao}`);
    } catch (error) {
        alert('Erro na tradução. Tente novamente.');
    }
}

export function setupTagButtons() {
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tag = btn.dataset.tag;
            const textarea = document.getElementById('novoPostTexto');
            if (textarea) {
                textarea.value += ` [${tag}] `;
                textarea.focus();
            }
        });
    });
}