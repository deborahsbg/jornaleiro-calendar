
// js/salmos.js
import { falarTexto } from './audio.js';

const salmosSemana = {
    0: { referencia: "Salmo 24", audioId: "1zuO9EqKnikIl18v8-PZ1CbBnrY1DR2Lb" },
    1: { referencia: "Salmo 48", audioId: "1SnFLrHBX6WcGnXZGbiSgH674GSkVOXrV" },
    2: { referencia: "Salmo 82", audioId: "1RGUDwv7lE77R-sUFnpuNxru2sIpT92nR" },
    3: { referencia: "Salmos 94:1-95:3", audioId: "1G1ghCdXlq0IB4AH-d2ypug0vVram8ozg" },
    4: { referencia: "Salmo 81", audioId: "1DYQCe4XCVPRCjY2p2epgXF9GQCMZ9KDu" },
    5: { referencia: "Salmo 93", audioId: "1aE5Ri7KXKiISDtDNO0XfRKEeKDyvugIe" },
    6: { referencia: "Salmo 92", audioId: "1iKdIqmCkzkZE5nQi04HApSGVUMk2boF1" }
};

export async function carregarSalmoDia(containerId) {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const salmo = salmosSemana[diaSemana];
    const container = document.getElementById(containerId);
    if (!container || !salmo) return;

    container.innerHTML = '<div class="aviso">✨ Carregando Salmo do dia...</div>';

    try {
        const sefariaRef = `Psalms.${salmo.referencia.split(' ')[1]}`;
        const response = await fetch(`https://www.sefaria.org/api/texts/${sefariaRef}`);
        const data = await response.json();
        const textoCompleto = data.text.join(' ');

        const nomeDia = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Shabat'][diaSemana];

        let html = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary-500);">✨ ${salmo.referencia}</div>
                <div style="font-size: 0.7rem; color: var(--text-500);">${nomeDia}</div>
            </div>
            <div id="textoSalmo" style="background: var(--bg-page); padding: 16px; border-radius: 16px; white-space: pre-wrap;">${textoCompleto}</div>
        `;
        if (salmo.audioId) {
            const audioUrl = `https://drive.google.com/uc?export=download&id=${salmo.audioId}`;
            html += `
                <div style="margin-top: 16px; padding: 12px; background: #fff; border-radius: 20px; border: 1px solid var(--border-light);">
                    <button id="btnOuvirSalmo" class="btn-small">🔊 Ouvir Salmo</button>
                    <div style="font-size: 0.6rem; color: var(--text-500); margin-top: 8px;">🎶 Salmo musicado</div>
                </div>
            `;
        }
        container.innerHTML = html;
        document.getElementById('btnOuvirSalmo')?.addEventListener('click', () => falarTexto(textoCompleto, 'textoSalmo'));
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="aviso">⚠️ Erro ao carregar Salmo. Tente novamente.</div>';
    }
}