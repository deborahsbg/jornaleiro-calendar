// Dados do calendário
const totalDias = 384;
const dataInicio = new Date(2026, 4, 16, 22, 0, 0); // 16/05/2026 22h

// Estrutura dos meses com eventos
const meses = [
    { nome: "MAIO 2026", dias: 31, inicioSemana: 5, eventos: { 19: "✅ Terça", 21: "🕯️ Shavuot", 22: "🕯️ Shavuot", 23: "🕯️ Shavuot ⭐", 26: "✅ Terça" } },
    { nome: "JUNHO 2026", dias: 30, inicioSemana: 1, eventos: { 2: "Terça", 9: "Terça", 16: "Terça", 23: "Terça", 30: "Terça" } },
    { nome: "JULHO 2026", dias: 31, inicioSemana: 3, eventos: { 4: "⭐", 7: "Terça", 11: "⭐", 14: "Terça", 18: "⭐", 21: "Terça", 22: "🕯️ Tisha B'Av", 23: "🕯️ Tisha B'Av", 25: "⭐", 28: "Terça" } },
    { nome: "AGOSTO 2026", dias: 31, inicioSemana: 6, eventos: { 1: "⭐", 4: "Terça", 8: "⭐", 11: "Terça", 15: "⭐", 18: "Terça", 22: "⭐", 25: "Terça", 29: "⭐" } },
    { nome: "SETEMBRO 2026", dias: 30, inicioSemana: 2, eventos: { 1: "Terça", 5: "⭐", 8: "Terça", 11: "🕯️ Rosh Hashaná", 12: "🕯️ Rosh Hashaná ⭐", 13: "🕯️ Rosh Hashaná", 15: "Terça", 19: "⭐", 20: "🕯️ Yom Kippur", 21: "🕯️ Yom Kippur", 22: "Terça", 25: "🕯️ Sucot ⭐", 26: "🕯️ Sucot ⭐", 27: "🕯️ Sucot", 28: "🕯️ Sucot", 29: "Terça", 30: "🕯️ Sucot" } },
    { nome: "OUTUBRO 2026", dias: 31, inicioSemana: 4, eventos: { 1: "🕯️ Sucot", 2: "🕯️ Shemini Atzeret ⭐", 3: "🕯️ Simchat Torá", 4: "⭐", 6: "Terça", 10: "⭐", 13: "Terça", 17: "⭐", 20: "Terça", 24: "⭐", 27: "Terça", 31: "⭐" } },
    { nome: "NOVEMBRO 2026", dias: 30, inicioSemana: 0, eventos: { 3: "Terça", 7: "⭐", 10: "Terça", 14: "⭐", 17: "Terça", 21: "⭐", 24: "Terça", 28: "⭐" } },
    { nome: "DEZEMBRO 2026", dias: 31, inicioSemana: 2, eventos: { 1: "Terça", 4: "🕯️ Chanucá ⭐", 5: "🕯️ Chanucá ⭐", 6: "🕯️ Chanucá", 7: "🕯️ Chanucá", 8: "🕯️ Chanucá + Terça", 9: "🕯️ Chanucá", 10: "🕯️ Chanucá", 11: "🕯️ Chanucá", 12: "🕯️ Chanucá ⭐", 15: "Terça", 19: "⭐", 22: "Terça", 26: "⭐", 29: "Terça" } },
    { nome: "JANEIRO 2027", dias: 31, inicioSemana: 5, eventos: { 2: "⭐", 5: "Terça", 9: "⭐", 12: "Terça", 16: "⭐", 19: "Terça", 22: "🕯️ Tu BiShvat", 23: "🕯️ Tu BiShvat ⭐", 26: "Terça", 30: "⭐" } },
    { nome: "FEVEREIRO 2027", dias: 28, inicioSemana: 1, eventos: { 2: "Terça", 6: "⭐", 9: "Terça", 13: "⭐", 16: "Terça", 20: "⭐", 23: "Terça", 27: "⭐" } },
    { nome: "MARÇO 2027", dias: 31, inicioSemana: 1, eventos: { 2: "Terça", 6: "⭐", 9: "Terça", 13: "⭐", 16: "Terça", 20: "⭐", 22: "🕯️ Purim", 23: "🕯️ Purim + Terça", 27: "⭐", 30: "Terça" } },
    { nome: "ABRIL 2027", dias: 30, inicioSemana: 4, eventos: { 3: "⭐", 6: "Terça", 10: "⭐", 13: "Terça", 17: "⭐", 20: "Terça", 21: "🕯️ Pêssach", 22: "🕯️ Pêssach", 23: "🕯️ Pêssach ⭐", 24: "🕯️ Pêssach", 25: "🕯️ Pêssach", 26: "🕯️ Pêssach", 27: "🕯️ Pêssach + Terça", 28: "🕯️ Pêssach" } },
    { nome: "MAIO 2027", dias: 31, inicioSemana: 6, eventos: { 1: "⭐", 4: "Terça", 8: "⭐", 11: "Terça", 15: "⭐", 18: "Terça", 22: "⭐", 24: "🕯️ Lag BaOmer", 25: "🕯️ Lag BaOmer + Terça", 29: "⭐" } },
    { nome: "JUNHO 2027", dias: 10, inicioSemana: 2, eventos: { 1: "Terça", 5: "⭐", 8: "Terça", 10: "🕯️ Shavuot", 11: "🕯️ Shavuot", 12: "🕯️ Shavuot ⭐" } }
];

let diasMarcados = new Set();

// Carregar dados salvos
function loadProgresso() {
    const saved = localStorage.getItem('jornaleiro_marcados');
    if (saved) {
        diasMarcados = new Set(JSON.parse(saved));
    } else {
        // Marcar as terças de 19 e 26 de maio como já passadas
        diasMarcados.add("2026-05-19");
        diasMarcados.add("2026-05-26");
    }
    updateStats();
}

function saveProgresso() {
    localStorage.setItem('jornaleiro_marcados', JSON.stringify([...diasMarcados]));
    updateStats();
}

function updateStats() {
    const contados = diasMarcados.size;
    const faltam = totalDias - contados;
    document.getElementById('contados').textContent = contados;
    document.getElementById('faltam').textContent = faltam;
    const percent = (contados / totalDias) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
}

function toggleDia(dateStr, element) {
    if (diasMarcados.has(dateStr)) {
        diasMarcados.delete(dateStr);
        element.classList.remove('marked');
    } else {
        diasMarcados.add(dateStr);
        element.classList.add('marked');
    }
    saveProgresso();
}

function gerarCalendario() {
    const container = document.getElementById('calendar');
    container.innerHTML = '';
    
    meses.forEach((mes, idx) => {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        
        const header = document.createElement('div');
        header.className = 'month-header';
        header.innerHTML = `📅 ${mes.nome} <span style="float:right; font-size:0.8rem;">▼</span>`;
        header.onclick = () => monthCard.classList.toggle('open');
        
        const daysGrid = document.createElement('div');
        daysGrid.className = 'month-days';
        
        // Dias da semana
        const semanaDias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        semanaDias.forEach(dia => {
            const diaSemana = document.createElement('div');
            diaSemana.textContent = dia;
            diaSemana.style.fontWeight = 'bold';
            diaSemana.style.textAlign = 'center';
            diaSemana.style.color = '#ffd700';
            diaSemana.style.fontSize = '0.7rem';
            daysGrid.appendChild(diaSemana);
        });
        
        // Preencher dias vazios no início
        for (let i = 0; i < mes.inicioSemana; i++) {
            const empty = document.createElement('div');
            daysGrid.appendChild(empty);
        }
        
        // Gerar dias
        for (let dia = 1; dia <= mes.dias; dia++) {
            const dateStr = `2026-${String(idx+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
            const isMarked = diasMarcados.has(dateStr);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            if (isMarked) dayCell.classList.add('marked');
            
            // Verificar eventos
            const evento = mes.eventos[dia];
            if (evento) {
                if (evento.includes('⭐')) dayCell.classList.add('shabbat');
                if (evento.includes('🕯️')) dayCell.classList.add('festa');
                if (evento.includes('Terça')) {
                    dayCell.style.border = '1px solid #ffd700';
                }
            }
            
            const dayNum = document.createElement('span');
            dayNum.className = 'day-number';
            dayNum.textContent = dia;
            dayCell.appendChild(dayNum);
            
            if (evento) {
                const eventSpan = document.createElement('span');
                eventSpan.className = 'day-event';
                eventSpan.textContent = evento.replace('⭐', '').replace('🕯️', '').trim() || evento;
                dayCell.appendChild(eventSpan);
            }
            
            dayCell.onclick = (function(dStr, cell) {
                return () => toggleDia(dStr, cell);
            })(dateStr, dayCell);
            
            daysGrid.appendChild(dayCell);
        }
        
        monthCard.appendChild(header);
        monthCard.appendChild(daysGrid);
        container.appendChild(monthCard);
    });
}

// Reset
document.getElementById('resetBtn').onclick = () => {
    if (confirm('Resetar toda a contagem? Isso desmarcará TODOS os dias.')) {
        diasMarcados.clear();
        // Manter as terças de 19 e 26 de maio? Vamos manter como início
        diasMarcados.add("2026-05-19");
        diasMarcados.add("2026-05-26");
        saveProgresso();
        gerarCalendario(); // Recarregar visual
    }
};

// Exportar
document.getElementById('exportBtn').onclick = () => {
    const marcados = [...diasMarcados].sort();
    const texto = `📊 Progresso Calendário do Jornaleiro\nInício: 16/05/2026 22h\nTotal: ${totalDias} dias\nMarcados: ${diasMarcados.size} dias (${Math.round(diasMarcados.size/totalDias*100)}%)\nFaltam: ${totalDias - diasMarcados.size} dias\n\nDias marcados:\n${marcados.join('\n')}`;
    navigator.clipboard.writeText(texto);
    alert('Progresso copiado! Cole no WhatsApp.');
};

// Inicializar
loadProgresso();
gerarCalendario();
