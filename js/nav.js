// js/nav.js
export function injectNavBar() {
    // Topo: menu + seletor (dentro de nav-bar-placeholder)
    const topContainer = document.getElementById('nav-bar-placeholder');
    if (topContainer) {
        const menuHtml = `
            <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin: 1rem 0;">
                <a href="index.html" class="btn-small"> Início</a>
                <a href="futuro.html" class="btn-small"> 1/2&Fim</a>
                <a href="eventos.html" class="btn-small"> Eventos</a>
                <a href="calendario.html" class="btn-small"> Calendário</a>
                <a href="doacoes.html" class="btn-small">💝 Doações</a>
                <a href="israel.html" class="btn-small">🇮🇱 Israel</a>
                <a href="aprender.html" class="btn-small"> Aprender</a>
                <a href="outreach.html" class="btn-small"> Casas de Oração</a>
            </div>
        `;
        const langSelectorHtml = `
            <div style="text-align: center; margin: 0 0 16px 0;">
                <select id="langSelectTop" class="goog-te-combo">
                    <option value="pt">🇧🇷 Português</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="he">🇮🇱 עברית</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="zh-CN">🇨🇳 中文</option>
                </select>
            </div>
        `;
        topContainer.innerHTML = menuHtml + langSelectorHtml;
    }

    // Rodapé: seletor dentro de footer-lang-placeholder
    const footerContainer = document.getElementById('footer-lang-placeholder');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div style="text-align: center; margin: 16px 0;">
                <select id="langSelectFooter" class="goog-te-combo">
                    <option value="pt">🇧🇷 Português</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="he">🇮🇱 עברית</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="ru">🇷🇺 Русский</option>
                    <option value="zh-CN">🇨🇳 中文</option>
                </select>
            </div>
        `;
    }

    // Configura eventos de tradução para ambos os selects
    function handleTranslation(select) {
        const lang = select.value;
        if (lang === 'pt') {
            window.location.reload();
        } else {
            const url = `https://translate.google.com/translate?sl=pt&tl=${lang}&u=${encodeURIComponent(window.location.href)}`;
            window.open(url, '_blank');
        }
    }

    const topSelect = document.getElementById('langSelectTop');
    const footerSelect = document.getElementById('langSelectFooter');
    if (topSelect) topSelect.addEventListener('change', () => handleTranslation(topSelect));
    if (footerSelect) footerSelect.addEventListener('change', () => handleTranslation(footerSelect));
}