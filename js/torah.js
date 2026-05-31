// js/torah.js – com todas as semanas (estático, sem API)
import { falarTexto } from './audio.js';

const leiturasFFOZ = {
    // 2026
    "2026-05-16": { parasha: "Bamidbar", torahRefEN: "Numbers 1.1-4.20", haftarahRefEN: "1 Samuel 20.18-42", gospelRefEN: "Matthew 24.29-36" },
    "2026-05-23": { parasha: "Shavuot", torahRefEN: "Exodus 19.1-20.23", haftarahRefEN: "Ezekiel 1.1-28;3.12", gospelRefEN: "Acts 2.1-21" },
    "2026-05-30": { parasha: "Naso", torahRefEN: "Numbers 4.21-7.89", haftarahRefEN: "Judges 13.2-25", gospelRefEN: "John 7.53-8.11" },
    "2026-06-06": { parasha: "Beha'alotcha", torahRefEN: "Numbers 8.1-12.16", haftarahRefEN: "Zechariah 2.14-4.7", gospelRefEN: "Luke 17.11-18.14" },
    "2026-06-13": { parasha: "Shelach Lecha", torahRefEN: "Numbers 13.1-15.41", haftarahRefEN: "Joshua 2.1-24", gospelRefEN: "Matthew 10.1-14" },
    "2026-06-20": { parasha: "Korach", torahRefEN: "Numbers 16.1-18.32", haftarahRefEN: "1 Samuel 11.14-12.22", gospelRefEN: "Mark 9.38-50" },
    "2026-06-27": { parasha: "Chukat", torahRefEN: "Numbers 19.1-22.1", haftarahRefEN: "Judges 11.1-33", gospelRefEN: "John 3.9-21" },
    "2026-07-04": { parasha: "Balak", torahRefEN: "Numbers 22.2-25.9", haftarahRefEN: "Micah 5.6-6.8", gospelRefEN: "Matthew 21.1-11" },
    "2026-07-11": { parasha: "Pinchas", torahRefEN: "Numbers 25.10-30.1", haftarahRefEN: "1 Kings 18.46-19.21", gospelRefEN: "Mark 12.28-34" },
    "2026-07-18": { parasha: "Mattot-Masei", torahRefEN: "Numbers 30.2-36.13", haftarahRefEN: "Jeremiah 2.4-28;3.4", gospelRefEN: "Matthew 5.33-37" },
    "2026-07-25": { parasha: "Devarim", torahRefEN: "Deuteronomy 1.1-3.22", haftarahRefEN: "Isaiah 1.1-27", gospelRefEN: "Mark 6.1-13" },
    "2026-08-01": { parasha: "Va'etchanan", torahRefEN: "Deuteronomy 3.23-7.11", haftarahRefEN: "Isaiah 40.1-26", gospelRefEN: "Luke 3.2-15" },
    "2026-08-08": { parasha: "Ekev", torahRefEN: "Deuteronomy 7.12-11.25", haftarahRefEN: "Isaiah 49.14-51.3", gospelRefEN: "John 6.35-51" },
    "2026-08-15": { parasha: "Re'eh", torahRefEN: "Deuteronomy 11.26-16.17", haftarahRefEN: "Isaiah 54.11-55.5", gospelRefEN: "Matthew 15.1-20" },
    "2026-08-22": { parasha: "Shoftim", torahRefEN: "Deuteronomy 16.18-21.9", haftarahRefEN: "Isaiah 51.12-52.12", gospelRefEN: "Matthew 18.15-20" },
    "2026-08-29": { parasha: "Ki Teitzei", torahRefEN: "Deuteronomy 21.10-25.19", haftarahRefEN: "Isaiah 54.1-10", gospelRefEN: "Luke 10.25-37" },
    "2026-09-05": { parasha: "Ki Tavo", torahRefEN: "Deuteronomy 26.1-29.8", haftarahRefEN: "Isaiah 60.1-22", gospelRefEN: "John 4.19-26" },
    "2026-09-12": { parasha: "Nitzavim", torahRefEN: "Deuteronomy 29.9-30.20", haftarahRefEN: "Isaiah 61.10-63.9", gospelRefEN: "Matthew 24.29-36" },
    "2026-09-19": { parasha: "Vayelech", torahRefEN: "Deuteronomy 31.1-30", haftarahRefEN: "Isaiah 55.6-56.8", gospelRefEN: "Matthew 18.21-35" },
    "2026-09-26": { parasha: "Ha'azinu", torahRefEN: "Deuteronomy 32.1-52", haftarahRefEN: "2 Samuel 22.1-51", gospelRefEN: "John 5.39-47" },
    "2026-10-03": { parasha: "Sukkot I", torahRefEN: "Leviticus 22.26-23.44", haftarahRefEN: "Zechariah 14.1-21", gospelRefEN: "John 7.1-39" },
    "2026-10-10": { parasha: "Bereshit", torahRefEN: "Genesis 1.1-6.8", haftarahRefEN: "Isaiah 42.5-43.10", gospelRefEN: "John 1.1-18" },
    "2026-10-17": { parasha: "Noach", torahRefEN: "Genesis 6.9-11.32", haftarahRefEN: "Isaiah 54.1-55.5", gospelRefEN: "Luke 17.26-37" },
    "2026-10-24": { parasha: "Lech Lecha", torahRefEN: "Genesis 12.1-17.27", haftarahRefEN: "Isaiah 40.27-41.16", gospelRefEN: "John 8.51-58" },
    "2026-10-31": { parasha: "Vayera", torahRefEN: "Genesis 18.1-22.24", haftarahRefEN: "2 Kings 4.1-37", gospelRefEN: "Luke 17.26-37" },
    "2026-11-07": { parasha: "Chayei Sara", torahRefEN: "Genesis 23.1-25.18", haftarahRefEN: "1 Kings 1.1-31", gospelRefEN: "John 4.3-14" },
    "2026-11-14": { parasha: "Toldot", torahRefEN: "Genesis 25.19-28.9", haftarahRefEN: "Malachi 1.1-2.7", gospelRefEN: "Romans 9.10-13" },
    "2026-11-21": { parasha: "Vayetzei", torahRefEN: "Genesis 28.10-32.3", haftarahRefEN: "Hosea 12.13-14.10", gospelRefEN: "John 1.43-51" },
    "2026-11-28": { parasha: "Vayishlach", torahRefEN: "Genesis 32.4-36.43", haftarahRefEN: "Obadiah 1.1-21", gospelRefEN: "Matthew 26.36-46" },
    "2026-12-05": { parasha: "Vayeshev", torahRefEN: "Genesis 37.1-40.23", haftarahRefEN: "Amos 2.6-3.8", gospelRefEN: "Matthew 1.1-6" },
    "2026-12-12": { parasha: "Miketz", torahRefEN: "Genesis 41.1-44.17", haftarahRefEN: "1 Kings 3.15-4.1", gospelRefEN: "John 10.22-38" },
    "2026-12-19": { parasha: "Vayigash", torahRefEN: "Genesis 44.18-47.27", haftarahRefEN: "Ezekiel 37.15-28", gospelRefEN: "Luke 24.13-32" },
    "2026-12-26": { parasha: "Vayechi", torahRefEN: "Genesis 47.28-50.26", haftarahRefEN: "1 Kings 2.1-12", gospelRefEN: "John 13.1-19" },
    // 2027
    "2027-01-02": { parasha: "Shemot", torahRefEN: "Exodus 1.1-6.1", haftarahRefEN: "Isaiah 27.6-28.13;29.22-23", gospelRefEN: "Matthew 2.1-12" },
    "2027-01-09": { parasha: "Va'era", torahRefEN: "Exodus 6.2-9.35", haftarahRefEN: "Ezekiel 28.25-29.21", gospelRefEN: "Luke 11.14-22" },
    "2027-01-16": { parasha: "Bo", torahRefEN: "Exodus 10.1-13.16", haftarahRefEN: "Jeremiah 46.13-28", gospelRefEN: "Mark 3.7-12" },
    "2027-01-23": { parasha: "Beshalach", torahRefEN: "Exodus 13.17-17.16", haftarahRefEN: "Judges 4.4-5.31", gospelRefEN: "John 6.15-21" },
    "2027-01-30": { parasha: "Yitro", torahRefEN: "Exodus 18.1-20.23", haftarahRefEN: "Isaiah 6.1-7.6;9.5-6", gospelRefEN: "Matthew 5.1-20" },
    "2027-02-06": { parasha: "Mishpatim", torahRefEN: "Exodus 21.1-24.18", haftarahRefEN: "Jeremiah 34.8-22;33.25-26", gospelRefEN: "Matthew 5.38-42" },
    "2027-02-13": { parasha: "Terumah", torahRefEN: "Exodus 25.1-27.19", haftarahRefEN: "1 Kings 5.26-6.13", gospelRefEN: "Mark 6.14-29" },
    "2027-02-20": { parasha: "Tetzaveh", torahRefEN: "Exodus 27.20-30.10", haftarahRefEN: "Ezekiel 43.10-27", gospelRefEN: "Philippians 4.10-20" },
    "2027-02-27": { parasha: "Ki Tisa", torahRefEN: "Exodus 30.11-34.35", haftarahRefEN: "1 Kings 18.1-39", gospelRefEN: "Luke 11.14-20" },
    "2027-03-06": { parasha: "Vayakhel-Pekudei", torahRefEN: "Exodus 35.1-40.38", haftarahRefEN: "1 Kings 7.40-50", gospelRefEN: "Mark 6.14-29" },
    "2027-03-13": { parasha: "Vayikra", torahRefEN: "Leviticus 1.1-5.26", haftarahRefEN: "Isaiah 43.21-44.23", gospelRefEN: "Matthew 5.23-24" },
    "2027-03-20": { parasha: "Tzav", torahRefEN: "Leviticus 6.1-8.36", haftarahRefEN: "Jeremiah 7.21-8.3;9.22-23", gospelRefEN: "Mark 12.28-34" },
    "2027-03-27": { parasha: "Shmini", torahRefEN: "Leviticus 9.1-11.47", haftarahRefEN: "2 Samuel 6.1-7.17", gospelRefEN: "Mark 7.1-23" },
    "2027-04-03": { parasha: "Tazria-Metzora", torahRefEN: "Leviticus 12.1-15.33", haftarahRefEN: "2 Kings 7.3-20", gospelRefEN: "Matthew 8.1-4" },
    "2027-04-10": { parasha: "Acharei Mot-Kedoshim", torahRefEN: "Leviticus 16.1-20.27", haftarahRefEN: "Amos 9.7-15", gospelRefEN: "John 7.1-24" },
    "2027-04-17": { parasha: "Emor", torahRefEN: "Leviticus 21.1-24.23", haftarahRefEN: "Ezekiel 44.15-31", gospelRefEN: "Matthew 5.38-42" },
    "2027-04-24": { parasha: "Behar-Bechukotai", torahRefEN: "Leviticus 25.1-27.34", haftarahRefEN: "Jeremiah 16.19-17.14", gospelRefEN: "Luke 4.16-21" },
    "2027-05-01": { parasha: "Bamidbar", torahRefEN: "Numbers 1.1-4.20", haftarahRefEN: "Hosea 2.1-22", gospelRefEN: "Matthew 24.29-36" },
    "2027-05-08": { parasha: "Naso", torahRefEN: "Numbers 4.21-7.89", haftarahRefEN: "Judges 13.2-25", gospelRefEN: "John 7.53-8.11" },
    "2027-05-15": { parasha: "Beha'alotcha", torahRefEN: "Numbers 8.1-12.16", haftarahRefEN: "Zechariah 2.14-4.7", gospelRefEN: "Luke 17.11-18.14" },
    "2027-05-22": { parasha: "Shelach Lecha", torahRefEN: "Numbers 13.1-15.41", haftarahRefEN: "Joshua 2.1-24", gospelRefEN: "Matthew 10.1-14" },
    "2027-05-29": { parasha: "Korach", torahRefEN: "Numbers 16.1-18.32", haftarahRefEN: "1 Samuel 11.14-12.22", gospelRefEN: "Mark 9.38-50" },
    "2027-06-05": { parasha: "Chukat", torahRefEN: "Numbers 19.1-22.1", haftarahRefEN: "Judges 11.1-33", gospelRefEN: "John 3.9-21" },
    "2027-06-12": { parasha: "Balak", torahRefEN: "Numbers 22.2-25.9", haftarahRefEN: "Micah 5.6-6.8", gospelRefEN: "Matthew 21.1-11" }
};

export async function carregarEstudoFFOZ(containerId) {
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
            <div class="parasha-badge">📜 Parashá ${leitura.parasha}</div>
            <div class="estudo-grid">
                <div class="estudo-card">
                    <strong>📜 TORAH</strong><br>${leitura.torahRefEN.replace(/\./g, ':').replace(/-/g, '–')}
                </div>
                <div class="estudo-card">
                    <strong>📖 PROFETAS</strong><br>${leitura.haftarahRefEN.replace(/\./g, ':')}
                    
                </div>
                <div class="estudo-card">
                    <strong>✝️ EVANGELHO</strong><br>${leitura.gospelRefEN.replace(/\./g, ':')}
                    
                </div>
            </div>
            <div class="text-center" style="margin: 16px 0;">
                <a href="parasha.html?nome=${encodeURIComponent(leitura.parasha)}&ref=${encodeURIComponent(leitura.torahRefEN)}" class="btn-small">📖 Ler texto completo (com áudio) →</a>
            </div>
            <div class="aviso text-center" style="margin-top: 16px;">
                🌍 Todas as congregações messiânicas em Jerusalém estão lendo esta mesma porção da Torá esta semana, seguindo o ciclo anual da FFOZ e o texto da Sefaria.
            </div>
        `;
    } else {
        container.innerHTML = `<div class="aviso">📅 Estudo semanal disponível em breve.</div>`;
    }
}