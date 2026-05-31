// js/stats.js
import { db } from './firebase-config.js';
import { collection, getDocs, getDoc, doc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { formatarDataBr } from './utils.js';

const DATA_INICIO = new Date(2026, 4, 16, 22, 0, 0);
const DIAS_TOTAIS = 384;

function calcularDiasJornada() {
    const hoje = new Date();
    const diffTime = hoje - DATA_INICIO;
    const diasDecorridos = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const diasRestantes = Math.max(0, DIAS_TOTAIS - diasDecorridos);
    const percentual = Math.min(100, (diasDecorridos / DIAS_TOTAIS) * 100);
    return { diasDecorridos, diasRestantes, percentual };
}

export async function carregarTodasEstatisticas() {
    try {
        const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
        const totalUsuarios = usuariosSnapshot.size;
        const totalParticipantesEl = document.getElementById('totalParticipantes');
        if (totalParticipantesEl) totalParticipantesEl.textContent = totalUsuarios;
        
        const diasSnapshot = await getDocs(collection(db, 'dias'));
        let totalMarcacoes = 0;
        diasSnapshot.forEach(doc => { totalMarcacoes += doc.data().total || 0; });
        const totalMarcacoesEl = document.getElementById('totalMarcacoes');
        if (totalMarcacoesEl) totalMarcacoesEl.textContent = totalMarcacoes;
        
        const media = totalUsuarios > 0 ? (totalMarcacoes / totalUsuarios).toFixed(1) : 0;
        const mediaEl = document.getElementById('mediaPorPessoa');
        if (mediaEl) mediaEl.textContent = media;
        
        const hoje = new Date().toISOString().split('T')[0];
        const hojeDoc = await getDoc(doc(db, 'dias', hoje));
        const marcaramHoje = hojeDoc.data()?.total || 0;
        const hojeEl = document.getElementById('hojeMarcaram');
        if (hojeEl) hojeEl.textContent = marcaramHoje;
        
        const { diasDecorridos, diasRestantes, percentual } = calcularDiasJornada();
        const diasDecorridosEl = document.getElementById('diasDecorridos');
        const diasRestantesEl = document.getElementById('diasRestantes');
        const percentualEl = document.getElementById('percentualJornada');
        const progressoFill = document.getElementById('progressoJornadaFill');
        if (diasDecorridosEl) diasDecorridosEl.textContent = diasDecorridos;
        if (diasRestantesEl) diasRestantesEl.textContent = diasRestantes;
        if (percentualEl) percentualEl.textContent = Math.floor(percentual);
        if (progressoFill) progressoFill.style.width = percentual + '%';
        
        // Top 5 days
        const q = query(collection(db, 'dias'), orderBy('total', 'desc'), limit(5));
        const topSnapshot = await getDocs(q);
        const topDiasDiv = document.getElementById('topDias');
        if (topDiasDiv) {
            topDiasDiv.innerHTML = '';
            if (topSnapshot.empty) {
                topDiasDiv.innerHTML = '<div style="color: #6c6f6b;">Nenhum dia marcado ainda.</div>';
            } else {
                topSnapshot.forEach(doc => {
                    const data = doc.id;
                    const total = doc.data().total;
                    const div = document.createElement('div');
                    div.className = 'top-dias-item';
                    div.innerHTML = `<span>📅 ${formatarDataBr(data)}</span><span style="font-weight: bold; color: #b45309;">🔥 ${total}</span>`;
                    topDiasDiv.appendChild(div);
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}