// js/eventos.js
import { db, auth } from './firebase-config.js';
import { collection, doc, setDoc, getDocs, getDoc, updateDoc, arrayUnion, arrayRemove, query, orderBy, where, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { carregarTodasEstatisticas } from './stats.js';
import { carregarCalendarPreview, setCalendarUser } from './calendar.js';
import { initTranslate } from './translate.js';

let currentUser = null;
let currentNickname = null;
let map = null;
let marker = null;

// Elementos DOM
const eventosList = document.getElementById('eventosList');
const criarBtnContainer = document.getElementById('criarEventoBtnContainer');
const showFormBtn = document.getElementById('showCreateEventFormBtn');
const createForm = document.getElementById('createEventForm');
const cancelBtn = document.getElementById('cancelCreateEvent');
const eventForm = document.getElementById('eventForm');
const mostrarMapaCheck = document.getElementById('eventMostrarMapa');
const mapContainer = document.getElementById('mapContainer');

// ========== Autenticação ==========
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        const userData = userDoc.data();
        currentNickname = userData?.nickname || user.email.split('@')[0];
        criarBtnContainer.style.display = 'block';
        // Atualizar UI de login (copie do index)
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('userNickname').textContent = currentNickname;
        document.getElementById('userEmail').textContent = user.email;
    } else {
        currentNickname = null;
        criarBtnContainer.style.display = 'none';
        document.getElementById('loginArea').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
    }
    carregarEventos();
    carregarTodasEstatisticas();
    carregarCalendarPreview('calendarPreview', user);
    setCalendarUser(user);
});

// ========== Carregar eventos ==========
async function carregarEventos() {
    const q = query(collection(db, 'eventos'), orderBy('data_inicio', 'asc'));
    const snapshot = await getDocs(q);
    eventosList.innerHTML = '';
    if (snapshot.empty) {
        eventosList.innerHTML = '<div class="aviso">Nenhum evento criado ainda. Seja o primeiro!</div>';
        return;
    }
    for (const docSnap of snapshot.docs) {
        const ev = docSnap.data();
        const evId = docSnap.id;
        const dataInicio = ev.data_inicio ? new Date(ev.data_inicio).toLocaleString() : 'Data não definida';
        const participantes = ev.participantes?.length || 0;
        const max = ev.max_participantes || '∞';
        
        const card = document.createElement('div');
        card.className = 'card-section';
        card.style.padding = '1rem';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <h3 style="color: #b45309;">${escapeHtml(ev.titulo)}</h3>
                <span style="font-size: 0.7rem;">👤 ${escapeHtml(ev.criador_nick)}</span>
            </div>
            <div style="font-size: 0.8rem; margin: 0.5rem 0;">📅 ${dataInicio}</div>
            <div style="font-size: 0.8rem;">📍 ${ev.tipo === 'presencial' ? escapeHtml(ev.local || 'Local não informado') : '🔗 Online'}</div>
            <div class="aviso" style="margin: 0.5rem 0;">${escapeHtml(ev.descricao || 'Sem descrição')}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <span>👥 ${participantes} / ${max} participantes</span>
                ${ev.link_participacao ? `<a href="${ev.link_participacao}" target="_blank" class="btn-small">🎉 Participar</a>` : ''}
            </div>
        `;
        // Se for o criador, mostrar botão de deletar
        if (currentUser && ev.criador_uid === currentUser.uid) {
            const delBtn = document.createElement('button');
            delBtn.textContent = '❌ Excluir evento';
            delBtn.className = 'btn-small';
            delBtn.style.marginTop = '0.5rem';
            delBtn.onclick = () => excluirEvento(evId);
            card.appendChild(delBtn);
        }
        eventosList.appendChild(card);
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

async function excluirEvento(eventId) {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    await deleteDoc(doc(db, 'eventos', eventId));
    carregarEventos();
}

// ========== Criar evento com geolocalização ==========
mostrarMapaCheck.addEventListener('change', () => {
    if (mostrarMapaCheck.checked) {
        mapContainer.style.display = 'block';
        if (!map) {
            map = L.map('mapContainer').setView([-23.5505, -46.6333], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            map.on('click', (e) => {
                if (marker) map.removeLayer(marker);
                marker = L.marker(e.latlng).addTo(map);
            });
        }
    } else {
        mapContainer.style.display = 'none';
        if (marker) {
            map.removeLayer(marker);
            marker = null;
        }
    }
});

eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert('Faça login para criar eventos.');
        return;
    }
    const titulo = document.getElementById('eventTitulo').value.trim();
    if (!titulo) return alert('Título é obrigatório');
    const descricao = document.getElementById('eventDescricao').value.trim();
    const dataInicio = document.getElementById('eventDataInicio').value;
    const dataFim = document.getElementById('eventDataFim').value || null;
    const tipo = document.getElementById('eventTipo').value;
    const local = document.getElementById('eventLocal').value.trim();
    const link = document.getElementById('eventLink').value.trim();
    const max = parseInt(document.getElementById('eventMax').value) || 0;
    let coordenadas = null;
    if (mostrarMapaCheck.checked && marker) {
        coordenadas = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng };
    }
    const eventoData = {
        criador_uid: currentUser.uid,
        criador_nick: currentNickname,
        titulo,
        descricao,
        tipo,
        local: tipo === 'presencial' ? local : '',
        link_participacao: link,
        data_inicio: new Date(dataInicio).toISOString(),
        data_fim: dataFim ? new Date(dataFim).toISOString() : null,
        max_participantes: max || 0,
        participantes: [currentUser.uid],
        coordenadas: coordenadas,
        createdAt: new Date().toISOString(),
        ativo: true
    };
    await addDoc(collection(db, 'eventos'), eventoData);
    alert('Evento criado com sucesso!');
    eventForm.reset();
    createForm.style.display = 'none';
    carregarEventos();
});

showFormBtn.addEventListener('click', () => {
    createForm.style.display = 'block';
});
cancelBtn.addEventListener('click', () => {
    createForm.style.display = 'none';
    if (marker) map.removeLayer(marker);
    mapContainer.style.display = 'none';
    mostrarMapaCheck.checked = false;
});

// Inicializar estatísticas, preview e tradução
carregarTodasEstatisticas();
carregarCalendarPreview('calendarPreview', null);
initTranslate();