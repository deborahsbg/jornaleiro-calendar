// js/salmos.js
// Only store minimal data: reference, audio ID, and a short intro line.
const salmosSemana = {
    0: { referencia: "Salmo 24", intro: "Do Eterno é a terra", audioId: "1zuO9EqKnikIl18v8-PZ1CbBnrY1DR2Lb" },
    1: { referencia: "Salmo 48", intro: "Grande é o Eterno", audioId: "1SnFLrHBX6WcGnXZGbiSgH674GSkVOXrV" },
    2: { referencia: "Salmo 82", intro: "Deus preside na assembleia divina", audioId: "1RGUDwv7lE77R-sUFnpuNxru2sIpT92nR" },
    3: { referencia: "Salmos 94:1-95:3", intro: "O Eterno é Deus das vinganças", audioId: "1G1ghCdXlq0IB4AH-d2ypug0vVram8ozg" },
    4: { referencia: "Salmo 81", intro: "Cantai alegremente a Deus", audioId: "1DYQCe4XCVPRCjY2p2epgXF9GQCMZ9KDu" },
    5: { referencia: "Salmo 93", intro: "O Eterno reina!", audioId: "1aE5Ri7KXKiISDtDNO0XfRKEeKDyvugIe" },
    6: { referencia: "Salmo 92", intro: "Bom é louvar ao Eterno", audioId: "1iKdIqmCkzkZE5nQi04HApSGVUMk2boF1" }
};

export function carregarSalmoDia(containerId) {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const salmo = salmosSemana[diaSemana];
    const container = document.getElementById(containerId);
    if (!container || !salmo) return;

    const nomeDia = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Shabat'][diaSemana];

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 16px;">
            <div style="font-size: 1.2rem; font-weight: bold; color: #b45309;">✨ ${salmo.referencia}</div>
            <div style="font-size: 0.7rem; color: #6c6f6b;">${nomeDia}</div>
        </div>
        <div style="font-style: italic; font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">"${salmo.intro}"</div>
        <div class="aviso">📖 Leia o texto completo no Sefaria (link abaixo)</div>
    `;

    if (salmo.audioId) {
        const audioUrl = `https://drive.google.com/uc?export=download&id=${salmo.audioId}`;
        html += `
            <div style="margin-top: 16px; padding: 12px; background: #e7e5e4; border-radius: 20px;">
                <audio controls style="width: 100%;">
                    <source src="${audioUrl}" type="audio/mpeg">
                </audio>
                <div style="font-size: 0.6rem; color: #6c6f6b; margin-top: 8px; text-align: center;">🎶 Salmo musicado</div>
            </div>
        `;
    }

    html += `
        <div style="margin-top: 16px; text-align: right;">
            <a href="https://www.sefaria.org/${salmo.referencia.replace(' ', '.')}" target="_blank" style="color: #b45309; font-size: 0.7rem;">📖 Ler no Sefaria →</a>
        </div>
    `;

    container.innerHTML = html;
}