// js/audio.js
let utterance = null;

export async function falarTexto(texto, elementoId) {
    const el = document.getElementById(elementoId);
    if (!el) return;
    if (utterance) window.speechSynthesis.cancel();

    utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;

    utterance.onboundary = (event) => {
        const original = el.innerText;
        const inicio = event.charIndex;
        const fim = inicio + event.charLength;
        const marcado = original.slice(0, inicio) + '<mark>' + original.slice(inicio, fim) + '</mark>' + original.slice(fim);
        el.innerHTML = marcado;
    };
    utterance.onend = () => { el.innerHTML = texto; utterance = null; };
    window.speechSynthesis.speak(utterance);
}