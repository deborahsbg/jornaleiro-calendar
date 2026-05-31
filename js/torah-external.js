// js/torah.js
// Weekly Torah portion data (references only)
// Source: First Fruits of Zion (FFOZ) - ffoz.org/torahportions
const leiturasFFOZ = {
    "2026-05-30": {
        parasha: "Naso",
        torah: "Números 4:21-7:89",
        haftarah: "Juízes 13:2-25",
        gospel: "João 7:53-8:11",
        sefariaTorah: "https://www.sefaria.org/Numbers.4.21-7.89?lang=bi",
        sefariaHaftarah: "https://www.sefaria.org/Judges.13.2-25?lang=bi",
        sefariaGospel: "https://www.sefaria.org/John.7.53-8.11?lang=bi"
    },
    "2026-06-06": {
        parasha: "Beha'alotcha",
        torah: "Números 8:1-12:16",
        haftarah: "Zacarias 2:14-4:7",
        gospel: "Lucas 17:11-18:14",
        sefariaTorah: "https://www.sefaria.org/Numbers.8.1-12.16?lang=bi",
        sefariaHaftarah: "https://www.sefaria.org/Zechariah.2.14-4.7?lang=bi",
        sefariaGospel: "https://www.sefaria.org/Luke.17.11-18.14?lang=bi"
    },
    "2026-06-13": {
        parasha: "Shelach Lecha",
        torah: "Números 13:1-15:41",
        haftarah: "Josué 2:1-24",
        gospel: "Mateus 10:1-14",
        sefariaTorah: "https://www.sefaria.org/Numbers.13.1-15.41?lang=bi",
        sefariaHaftarah: "https://www.sefaria.org/Joshua.2.1-24?lang=bi",
        sefariaGospel: "https://www.sefaria.org/Matthew.10.1-14?lang=bi"
    }
    // Add more weeks as needed
};

export function carregarEstudoFFOZ(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const hoje = new Date();
    let leitura = null;
    for (const [data, l] of Object.entries(leiturasFFOZ)) {
        if (new Date(data) >= hoje) { leitura = l; break; }
    }
    if (!leitura) leitura = Object.values(leiturasFFOZ)[0];
    
    if (leitura) {
        container.innerHTML = `
            <div style="background: #2c3e2f; color: #fef3c7; padding: 6px 16px; border-radius: 40px; display: inline-block; margin-bottom: 16px;">📜 Parashá ${leitura.parasha}</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 12px;">
                <div style="background: #fff7ed; border-radius: 16px; padding: 12px; text-align: center;">
                    <strong>📜 TORAH</strong><br>${leitura.torah}
                    <div><a href="${leitura.sefariaTorah}" target="_blank" style="color: #b45309; font-size: 0.7rem;">Ler na Sefaria →</a></div>
                </div>
                <div style="background: #fff7ed; border-radius: 16px; padding: 12px; text-align: center;">
                    <strong>📖 PROFETAS</strong><br>${leitura.haftarah}
                    <div><a href="${leitura.sefariaHaftarah}" target="_blank" style="color: #b45309; font-size: 0.7rem;">Ler na Sefaria →</a></div>
                </div>
                <div style="background: #fff7ed; border-radius: 16px; padding: 12px; text-align: center;">
                    <strong>✝️ EVANGELHO</strong><br>${leitura.gospel}
                    <div><a href="${leitura.sefariaGospel}" target="_blank" style="color: #b45309; font-size: 0.7rem;">Ler na Sefaria →</a></div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 16px; font-size: 0.7rem; color: #6c6f6b;">
                📚 Plano de leitura: <strong>First Fruits of Zion (FFOZ)</strong>
            </div>
        `;
    } else {
        container.innerHTML = `<div class="aviso">📅 Estudo da semana será carregado em breve.</div>`;
    }
}