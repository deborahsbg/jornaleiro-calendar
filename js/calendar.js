// js/calendar.js
import { db } from './firebase-config.js';
import { collection, doc, getDoc, getDocs, query, where, runTransaction } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { formatarDataBr } from './utils.js';
import { carregarTodasEstatisticas } from './stats.js';

let currentUser = null;

export function setCalendarUser(user) {
    currentUser = user;
}

export async function gerarCalendario(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Elemento calendar não encontrado:', containerId);
        return;
    }

    const meses = [
        { nome: "MAIO 2026", dias: 31, inicio: 5, ano: 2026, mesNum: 4, eventos: { 21: "🕯️ Shavuot", 22: "🕯️ Shavuot", 23: "🕯️ Shavuot ⭐" } },
        { nome: "JUNHO 2026", dias: 30, inicio: 1, ano: 2026, mesNum: 5, eventos: {} },
        { nome: "JULHO 2026", dias: 31, inicio: 3, ano: 2026, mesNum: 6, eventos: { 22: "🕯️ Tisha B'Av", 23: "🕯️ Tisha B'Av" } },
        { nome: "AGOSTO 2026", dias: 31, inicio: 6, ano: 2026, mesNum: 7, eventos: {} },
        { nome: "SETEMBRO 2026", dias: 30, inicio: 2, ano: 2026, mesNum: 8, eventos: { 11: "🕯️ Rosh Hashaná", 12: "🕯️ Rosh Hashaná ⭐", 13: "🕯️ Rosh Hashaná", 20: "🕯️ Yom Kippur", 21: "🕯️ Yom Kippur", 25: "🕯️ Sucot ⭐", 26: "🕯️ Sucot ⭐", 27: "🕯️ Sucot", 28: "🕯️ Sucot", 29: "🕯️ Sucot", 30: "🕯️ Sucot" } },
        { nome: "OUTUBRO 2026", dias: 31, inicio: 4, ano: 2026, mesNum: 9, eventos: { 1: "🕯️ Sucot", 2: "🕯️ Shemini Atzeret ⭐", 3: "🕯️ Simchat Torá", 4: "⭐" } },
        { nome: "NOVEMBRO 2026", dias: 30, inicio: 0, ano: 2026, mesNum: 10, eventos: {} },
        { nome: "DEZEMBRO 2026", dias: 31, inicio: 2, ano: 2026, mesNum: 11, eventos: { 4: "🕯️ Chanucá ⭐", 5: "🕯️ Chanucá ⭐", 6: "🕯️ Chanucá", 7: "🕯️ Chanucá", 8: "🕯️ Chanucá", 9: "🕯️ Chanucá", 10: "🕯️ Chanucá", 11: "🕯️ Chanucá", 12: "🕯️ Chanucá ⭐" } },
        { nome: "JANEIRO 2027", dias: 31, inicio: 5, ano: 2027, mesNum: 0, eventos: { 22: "🕯️ Tu BiShvat", 23: "🕯️ Tu BiShvat ⭐" } },
        { nome: "FEVEREIRO 2027", dias: 28, inicio: 1, ano: 2027, mesNum: 1, eventos: {} },
        { nome: "MARÇO 2027", dias: 31, inicio: 1, ano: 2027, mesNum: 2, eventos: { 22: "🕯️ Purim", 23: "🕯️ Purim" } },
        { nome: "ABRIL 2027", dias: 30, inicio: 4, ano: 2027, mesNum: 3, eventos: { 21: "🕯️ Pêssach", 22: "🕯️ Pêssach", 23: "🕯️ Pêssach ⭐", 24: "🕯️ Pêssach", 25: "🕯️ Pêssach", 26: "🕯️ Pêssach", 27: "🕯️ Pêssach", 28: "🕯️ Pêssach" } },
        { nome: "MAIO 2027", dias: 31, inicio: 6, ano: 2027, mesNum: 4, eventos: { 24: "🕯️ Lag BaOmer", 25: "🕯️ Lag BaOmer" } },
        { nome: "JUNHO 2027", dias: 10, inicio: 2, ano: 2027, mesNum: 5, eventos: { 10: "🕯️ Shavuot", 11: "🕯️ Shavuot ⭐" } }
    ];

    let marcacoesUsuario = new Set();
    if (currentUser) {
        const q = query(collection(db, 'marcacoes_usuarios'), where('uid', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => marcacoesUsuario.add(doc.id.split('_')[1]));
    }

    const diasSnapshot = await getDocs(collection(db, 'dias'));
    const contadores = {};
    diasSnapshot.forEach(doc => { contadores[doc.id] = doc.data().total; });

    container.innerHTML = '';

    for (const mes of meses) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-card';
        
        const header = document.createElement('div');
        header.className = 'month-header';
        header.innerHTML = `📅 ${mes.nome} <span style="float:right;">▼</span>`;
        header.onclick = () => monthDiv.classList.toggle('open');
        monthDiv.appendChild(header);
        
        const daysGrid = document.createElement('div');
        daysGrid.className = 'month-days';
        
        const semanaDias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        semanaDias.forEach(dia => {
            const diaSemana = document.createElement('div');
            diaSemana.textContent = dia;
            diaSemana.style.fontWeight = 'bold';
            diaSemana.style.textAlign = 'center';
            diaSemana.style.color = '#b45309';
            diaSemana.style.fontSize = '0.7rem';
            daysGrid.appendChild(diaSemana);
        });
        
        for (let i = 0; i < mes.inicio; i++) {
            const empty = document.createElement('div');
            daysGrid.appendChild(empty);
        }
        
        for (let d = 1; d <= mes.dias; d++) {
            const dataStr = `${mes.ano}-${String(mes.mesNum + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const total = contadores[dataStr] || 0;
            const usuarioMarcou = marcacoesUsuario.has(dataStr);
            const evento = mes.eventos[d] || '';
            
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day-cell';
            if (usuarioMarcou) dayDiv.classList.add('marked');
            if (evento && evento.includes('⭐')) dayDiv.classList.add('shabbat');
            if (evento && evento.includes('🕯️')) dayDiv.classList.add('festa');
            dayDiv.setAttribute('data-date', dataStr);
            
            let bgColor = '#fef9f0';
            let textColor = '#1e2a2e';
            if (usuarioMarcou) { bgColor = '#b45309'; textColor = 'white'; }
            if (evento.includes('🕯️') && !usuarioMarcou) { bgColor = '#d97706'; textColor = 'white'; }
            if (evento.includes('⭐') && !usuarioMarcou) { bgColor = '#4b5563'; textColor = 'white'; }
            
            dayDiv.style.background = bgColor;
            dayDiv.style.color = textColor;
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = d;
            dayDiv.appendChild(dayNumber);
            
            if (evento) {
                const eventSpan = document.createElement('div');
                eventSpan.className = 'day-event';
                eventSpan.textContent = evento;
                dayDiv.appendChild(eventSpan);
            }
            
            // O contador será adicionado por atualizarContadoresCalendario
                        
            dayDiv.onclick = (function(ds, el) {
                return function() { marcarDia(ds, el); };
            })(dataStr, dayDiv);
            
            daysGrid.appendChild(dayDiv);
        }
        
        monthDiv.appendChild(daysGrid);
        container.appendChild(monthDiv);
    }
    
    // Abrir o mês atual
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const monthCards = document.querySelectorAll('.month-card');
    for (let i = 0; i < meses.length; i++) {
        if (meses[i].ano === anoAtual && meses[i].mesNum === mesAtual && monthCards[i]) {
            monthCards[i].classList.add('open');
            break;
        }
    }
    if (monthCards[0] && !document.querySelector('.month-card.open')) {
        monthCards[0].classList.add('open');
    }
    
    // Atualizar contadores após gerar
    await atualizarContadoresCalendario();
}

export async function marcarDia(dataStr, buttonElement) {
    if (!currentUser) {
        alert('🔒 Faça login para marcar dias no calendário.');
        return;
    }
    
    const diaRef = doc(db, 'dias', dataStr);
    const userMarcouRef = doc(db, 'marcacoes_usuarios', `${currentUser.uid}_${dataStr}`);
    const userMarcouSnap = await getDoc(userMarcouRef);
    
    if (userMarcouSnap.exists()) {
        await runTransaction(db, async (transaction) => {
            const diaDoc = await transaction.get(diaRef);
            const novoTotal = (diaDoc.data()?.total || 1) - 1;
            if (novoTotal <= 0) {
                transaction.delete(diaRef);
            } else {
                transaction.set(diaRef, { total: novoTotal, data: dataStr }, { merge: true });
            }
            transaction.delete(userMarcouRef);
        });
        buttonElement.classList.remove('marked');
        buttonElement.style.background = '#fef9f0';
        buttonElement.style.color = '#1e2a2e';
    } else {
        await runTransaction(db, async (transaction) => {
            const diaDoc = await transaction.get(diaRef);
            const novoTotal = (diaDoc.data()?.total || 0) + 1;
            transaction.set(diaRef, { total: novoTotal, data: dataStr }, { merge: true });
            transaction.set(userMarcouRef, { uid: currentUser.uid, data: dataStr });
        });
        buttonElement.classList.add('marked');
        buttonElement.style.background = '#b45309';
        buttonElement.style.color = 'white';
    }
    
    // Atualizar estatísticas e contadores do calendário
    if (typeof carregarTodasEstatisticas !== 'undefined') {
        carregarTodasEstatisticas();
    }
    await atualizarContadoresCalendario();
}

export async function atualizarContadoresCalendario() {
    const diasSnapshot = await getDocs(collection(db, 'dias'));
    const contadores = {};
    diasSnapshot.forEach(doc => { contadores[doc.id] = doc.data().total; });
    
    document.querySelectorAll('.day-cell').forEach(cell => {
        const dataStr = cell.getAttribute('data-date');
        const total = contadores[dataStr] || 0;
        let contadorSpan = cell.querySelector('.contador-dia');
        if (!contadorSpan && total > 0) {
            contadorSpan = document.createElement('div');
            contadorSpan.className = 'contador-dia';
            contadorSpan.style.cssText = 'font-size: 0.55rem; margin-top: 2px;';
            cell.appendChild(contadorSpan);
        }
        if (contadorSpan) {
            contadorSpan.textContent = total > 0 ? `🔥 ${total}` : '';
        }
    });
}

export async function carregarCalendarPreview(containerId, user = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const hoje = new Date();
    const mesAno = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    container.innerHTML = `<div class="aviso">📅 ${mesAno}</div><div class="text-center"><a href="calendario.html" class="btn-small">Ver calendário completo →</a></div>`;
}