// js/badges.js
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getCountryFlag, escapeHtml } from './utils.js';

// Busca as badges de um usuário específico
export async function getBadgesForUser(uid) {
    const userDoc = await getDoc(doc(db, 'usuarios', uid));
    const data = userDoc.data() || {};
    let badges = [];
    if (data.identity) badges.push(`🕯️ ${escapeHtml(data.identity)}`);
    if (data.city) badges.push(`📍 ${escapeHtml(data.city)}`);
    if (data.country) badges.push(`${getCountryFlag(data.country)} ${escapeHtml(data.country)}`);
    return badges;
}

// Inicializa badges no Muro (adiciona badges aos posts existentes)
export function initBadges() {
    console.log('Badges module carregado');
    
    // Observa novos posts adicionados ao DOM e adiciona badges
    const observer = new MutationObserver(() => {
        addBadgesToPosts();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    addBadgesToPosts();
}

// Adiciona badges aos posts do Muro
async function addBadgesToPosts() {
    const posts = document.querySelectorAll('.post-item');
    
    for (const post of posts) {
        // Verifica se o post já tem badges
        if (post.querySelector('.post-badges')?.children.length > 0) continue;
        
        // Extrai o nome do autor do post
        const authorName = post.querySelector('.post-author')?.textContent;
        if (!authorName) continue;
        
        // Busca o usuário pelo nickname (simplificado: precisaria de uma query)
        // Como não temos o UID diretamente, usamos um cache ou buscamos pelo nickname
        // Por ora, vamos apenas simular badges se houver dados no localStorage
        // Para funcionar completamente, você precisa associar badges durante a criação do post
        
        const badgeContainer = post.querySelector('.post-badges');
        if (badgeContainer && !badgeContainer.hasChildNodes()) {
            // Badges serão adicionadas pelo próprio componente de post no muro.js
        }
    }
}