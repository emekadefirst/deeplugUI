import { create } from 'zustand';
import { walletService, type WalletData } from '../services/wallet-service';

interface WalletState {
    wallet: WalletData | null;
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;

    fetchWallet: () => Promise<void>;
    refresh: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useWalletStore = create<WalletState>((set, get) => ({
    wallet: null,
    isLoading: false,
    error: null,
    lastFetched: null,

    fetchWallet: async () => {
        const { lastFetched, isLoading } = get();
        const now = Date.now();

        // Check if data is fresh
        if (lastFetched && (now - lastFetched < CACHE_DURATION) && !isLoading) {
            return;
        }

        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const response = await walletService.getWallet();

            // Get the first wallet from the data array
            const walletData = response.data[0] || null;

            set({
                wallet: walletData,
                isLoading: false,
                lastFetched: now,
                error: null
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.detail || 'Failed to fetch wallet data'
            });
            console.error('Wallet fetch error:', error);
        }
    },

    refresh: async () => {
        set({ lastFetched: null });
        await get().fetchWallet();
    },
}));
