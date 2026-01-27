import { create } from 'zustand';
import { vsimService } from '../services/vsim-service';
import type { VSimCountry, VSimPhoneNumber, VSimSMS, VSimCall, VSimNumberType } from '../services/vsim-service';

interface VSimStore {
    countries: VSimCountry[];
    numbers: VSimPhoneNumber[];
    allNumbers: VSimPhoneNumber[]; // Cache all numbers for client-side pagination
    loadingDetails: boolean; // For countries
    loadingNumbers: boolean; // For numbers
    isPurchasing: boolean; // For purchase
    error: string | null;
    purchaseSuccess: string | null;

    smsLogs: VSimSMS[];
    callLogs: VSimCall[];
    loadingLogs: boolean;

    hasMore: boolean;
    page: number;

    fetchCountries: () => Promise<void>;
    fetchNumbers: (countryCode: string, type: VSimNumberType) => Promise<void>;
    loadMoreNumbers: (countryCode: string, type: VSimNumberType) => Promise<void>;
    purchaseNumber: (phoneNumber: string) => Promise<boolean>;
    fetchSMSLogs: () => Promise<void>;
    sendSMS: (to: string, message: string, fromNumber: string) => Promise<boolean>;
    fetchCallLogs: () => Promise<void>;
    resetNumbers: () => void;
    clearMessages: () => void;
}

export const useVSimStore = create<VSimStore>((set) => ({
    countries: [],
    numbers: [],
    allNumbers: [],
    loadingDetails: false,
    loadingNumbers: false,
    isPurchasing: false,
    error: null,
    purchaseSuccess: null,
    hasMore: false,
    page: 1,

    smsLogs: [],
    callLogs: [],
    loadingLogs: false,

    fetchCountries: async () => {
        set({ loadingDetails: true, error: null });
        try {
            const countries = await vsimService.getCountries();
            set({ countries, loadingDetails: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch countries',
                loadingDetails: false
            });
        }
    },

    fetchNumbers: async (countryCode: string, type: VSimNumberType) => {
        set({ loadingNumbers: true, error: null, numbers: [], allNumbers: [], page: 1, hasMore: false });
        try {
            const pageSize = 5;
            // Fetch ALL numbers (no params)
            const response = await vsimService.getNumbers(countryCode, type);
            const allNumbers = response.data;

            const initialNumbers = allNumbers.slice(0, pageSize);

            set({
                allNumbers: allNumbers,
                numbers: initialNumbers,
                loadingNumbers: false,
                hasMore: allNumbers.length > pageSize,
                page: 1
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || `${type} numbers not found`,
                loadingNumbers: false
            });
        }
    },

    loadMoreNumbers: async () => {
        const { page, allNumbers, numbers } = useVSimStore.getState();
        const pageSize = 5;
        const nextPage = page + 1;
        const currentCount = numbers.length;

        // Calculate slice indices
        // We want to append the next batch.
        // Actually, just taking slice(0, nextPage * pageSize) works if we replace 'numbers'.
        // Or slice(currentCount, currentCount + pageSize) if appending.

        const nextBatch = allNumbers.slice(currentCount, currentCount + pageSize);

        if (nextBatch.length > 0) {
            const updatedNumbers = [...numbers, ...nextBatch];
            set({
                numbers: updatedNumbers,
                hasMore: allNumbers.length > updatedNumbers.length,
                page: nextPage
            });
        } else {
            set({ hasMore: false });
        }
    },

    purchaseNumber: async (phoneNumber: string) => {
        set({ isPurchasing: true, error: null, purchaseSuccess: null });
        try {
            await vsimService.purchaseNumber(phoneNumber);
            set({ isPurchasing: false, purchaseSuccess: `Successfully purchased ${phoneNumber}` });
            return true;
        } catch (error: any) {
            set({
                isPurchasing: false,
                error: error.response?.data?.detail || 'Failed to purchase number'
            });
            return false;
        }
    },

    fetchSMSLogs: async () => {
        set({ loadingLogs: true, error: null });
        try {
            const smsLogs = await vsimService.getSMSLogs();
            set({ smsLogs, loadingLogs: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch SMS logs',
                loadingLogs: false
            });
        }
    },

    sendSMS: async (to: string, message: string, fromNumber: string) => {
        set({ error: null });
        try {
            await vsimService.sendSMS(to, message, fromNumber);
            return true;
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to send SMS'
            });
            return false;
        }
    },

    fetchCallLogs: async () => {
        set({ loadingLogs: true, error: null });
        try {
            const callLogs = await vsimService.getCallLogs();
            set({ callLogs, loadingLogs: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.detail || 'Failed to fetch call logs',
                loadingLogs: false
            });
        }
    },

    resetNumbers: () => set({ numbers: [], error: null }),
    clearMessages: () => set({ error: null, purchaseSuccess: null }),
}));
