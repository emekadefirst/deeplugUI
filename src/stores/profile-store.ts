import { create } from 'zustand';
import { userService, type WhoAmIResponse } from '../services/user-service';

interface ProfileState {
    profile: WhoAmIResponse | null;
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;

    fetchProfile: () => Promise<void>;
    refresh: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,
    lastFetched: null,

    fetchProfile: async () => {
        const { lastFetched, isLoading } = get();
        const now = Date.now();

        // Check if data is fresh
        if (lastFetched && (now - lastFetched < CACHE_DURATION) && !isLoading) {
            return;
        }

        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
            const profile = await userService.getCurrentUser();

            set({
                profile,
                isLoading: false,
                lastFetched: now,
                error: null
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.detail || 'Failed to fetch profile data'
            });
            console.error('Profile fetch error:', error);
        }
    },

    refresh: async () => {
        set({ lastFetched: null });
        await get().fetchProfile();
    },
}));
