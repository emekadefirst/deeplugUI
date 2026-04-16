// ... existing imports
import type { ReactNode } from 'react';
import api from './api';

export interface WalletData {
    id: string;
    user_id: string;
    balance: string;
    currency: string;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    wallet_tag: string;
}

export interface PaymentData {
    payment_ref_id: ReactNode;
    id: string;
    amount: number;
    status: string;
    provider: string;
    reference: string;
    created_at: string;
    username: string;
}

export interface PaymentResponse {
    total: number;
    page: number;
    page_size: number;
    data: PaymentData[];
}

export interface TransactionData {
    id: string;
    reference: string;
    type: 'credit' | 'debit';
    status: string;
    amount: number;
    balance_before: number;
    balance_after: number;
    user: string;
    wallet_id: string;
    created_at: string;
    metadata?: any;
}

export interface TransactionResponse {
    total: number;
    page: number;
    page_size: number;
    data: TransactionData[];
}

export const walletService = {
    getWallet: async () => {
        const response = await api.get<WalletData>('/wallets/whoami');
        return response.data;
    },

    fundWallet: async (data: FundInit) => {
        const response = await api.post('/payments/fund', data);
        return response.data;
    },

    getPayments: async (params?: { page?: number; page_size?: number; status?: string; provider?: string }) => {
        const response = await api.get<PaymentResponse>('/payments/whoami', { params });
        return response.data;
    },

    getTransactions: async (params?: { page?: number; page_size?: number; status?: string; type?: string }) => {
        const response = await api.get<TransactionResponse>('/transactions/whoami', { params });
        return response.data;
    }
};

export interface FundInit {
    amount: number;
    dollar_price?: number;
    currency: 'NGN' | 'USD';
}
