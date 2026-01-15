import api from './api';

export interface WalletData {
    id: string;
    username: string;
    email: string;
    whatsapp_number: string;
    balance: string;
    wallet_tag: string;
    updated_at: string;
}

export interface WalletResponse {
    page: number;
    page_size: number;
    total: number;
    data: WalletData[];
}

export const walletService = {
    getWallet: async () => {
        const response = await api.get<WalletResponse>('/wallets/whoami');
        return response.data;
    },
};
