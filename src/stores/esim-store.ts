import { create } from 'zustand';
import { AxiosError } from 'axios';
import { esimService } from '../services/esim-service';
import type { ESimCountry, ESimOffering, ESimOrderPayload } from '../services/esim-service';

interface ApiErrorResponse {
    detail?: string;
    message?: string;
}

interface ESimStore {
    countries: ESimCountry[];
    offerings: ESimOffering[];
    loadingCountries: boolean;
    loadingOfferings: boolean;
    isPurchasing: boolean;
    error: string | null;
    purchaseSuccess: string | null;

    fetchCountries: () => Promise<void>;
    fetchOfferings: (country_id: string) => Promise<void>;
    purchaseEsim: (payload: ESimOrderPayload) => Promise<boolean>;
    clearMessages: () => void;
}

export const useESimStore = create<ESimStore>((set) => ({
    countries: [],
    offerings: [],
    loadingCountries: false,
    loadingOfferings: false,
    isPurchasing: false,
    error: null,
    purchaseSuccess: null,

    fetchCountries: async () => {
        set({ loadingCountries: true, error: null });
        try {
            const countries = await esimService.getCountries();
            set({ countries, loadingCountries: false });
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch countries',
                loadingCountries: false,
            });
        }
    },

    fetchOfferings: async (country_id: string) => {
        set({ loadingOfferings: true, error: null, offerings: [] });
        try {
            const offerings = await esimService.getOfferings(country_id);
            set({ offerings, loadingOfferings: false });
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch eSIM plans',
                loadingOfferings: false,
            });
        }
    },

    purchaseEsim: async (payload: ESimOrderPayload) => {
        set({ isPurchasing: true, error: null, purchaseSuccess: null });
        try {
            await esimService.purchaseEsim(payload);
            set({
                isPurchasing: false,
                purchaseSuccess: `Successfully purchased ${payload.plan_name}! Check your email for activation instructions.`,
            });
            return true;
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                isPurchasing: false,
                error: err.response?.data?.detail || err.response?.data?.message || 'Failed to purchase eSIM plan',
            });
            return false;
        }
    },

    clearMessages: () => set({ error: null, purchaseSuccess: null }),
}));
