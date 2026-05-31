// js/wallet.js
import Web3 from 'https://cdn.jsdelivr.net/npm/web3@4.16.0/dist/web3.min.js';

let web3Modal = null;
let currentProvider = null;

// Inicializa Web3Modal (chame uma vez, antes de usar)
export function initWeb3Modal() {
    if (typeof window.Web3Modal === 'undefined') {
        console.warn('Web3Modal não carregado. Verifique os scripts CDN no <head>.');
        return false;
    }
    const providerOptions = {
        walletconnect: {
            package: window.WalletConnectProvider,
            options: { infuraId: '2a5e6b8f0c8b4f2a9e6d3c7b5a1f8e9d' } // opcional, pode usar vazio
        }
    };
    web3Modal = new window.Web3Modal({ providerOptions });
    return true;
}

// Conecta a carteira e retorna o endereço (string)
export async function conectarCarteira() {
    if (!web3Modal) {
        const ok = initWeb3Modal();
        if (!ok) return null;
    }
    try {
        const provider = await web3Modal.connect();
        currentProvider = provider;
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) throw new Error('Nenhuma conta autorizada');
        return accounts[0];
    } catch (err) {
        console.error('Erro ao conectar carteira:', err);
        alert('Erro ao conectar carteira. Tente novamente.');
        return null;
    }
}

// Desconecta (opcional)
export function desconectarCarteira() {
    if (web3Modal && currentProvider && currentProvider.close) {
        currentProvider.close();
    }
    web3Modal = null;
    currentProvider = null;
}