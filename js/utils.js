// js/utils.js
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function formatarDataBr(dataStr) {
    const partes = dataStr.split('-');
    if (partes.length !== 3) return dataStr;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export function getCountryFlag(countryCode) {
    const flags = {
        'BR': '🇧🇷', 'US': '🇺🇸', 'IL': '🇮🇱', 'PT': '🇵🇹',
        'ES': '🇪🇸', 'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹',
        'RU': '🇷🇺', 'CN': '🇨🇳', 'JP': '🇯🇵', 'AR': '🇦🇷',
        'MX': '🇲🇽', 'UK': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺'
    };
    return flags[countryCode.toUpperCase()] || '🌍';
}

export function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} anos atrás`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} meses atrás`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} dias atrás`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} horas atrás`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutos atrás`;
    return `${Math.floor(seconds)} segundos atrás`;
}