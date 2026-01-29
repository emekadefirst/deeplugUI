import { create } from 'zustand';
import { AxiosError } from 'axios';
import { vsimService } from '../services/vsim-service';
import type { 
    VSimCountry, 
    VSimPhoneNumber, 
    VSimSMS, 
    VSimCall, 
    VSimNumberType, 
    VSIMOrder,
    VSimOrderResponse
} from '../services/vsim-service';

interface VSimStore {
    countries: VSimCountry[];
    numbers: VSimPhoneNumber[];
    allNumbers: VSimPhoneNumber[]; 
    loadingDetails: boolean; 
    loadingNumbers: boolean; 
    isPurchasing: boolean; 
    error: string | null;
    purchaseSuccess: string | null;
    purchasedNumbers: VSimOrderResponse[];
    loadingPurchasedNumbers: boolean;

    smsLogs: VSimSMS[];
    callLogs: VSimCall[];
    loadingLogs: boolean;

    hasMore: boolean;
    page: number;

    fetchCountries: () => Promise<void>;
    fetchNumbers: (countryCode: string, type: VSimNumberType) => Promise<void>;
    loadMoreNumbers: () => void;
    purchaseNumber: (orderData: VSIMOrder) => Promise<boolean>;
    fetchSMSLogs: () => Promise<void>;
    sendSMS: (to: string, message: string, fromNumber: string) => Promise<boolean>;
    fetchCallLogs: () => Promise<void>;
    fetchPurchasedNumbers: () => Promise<void>;
    resetNumbers: () => void;
    clearMessages: () => void;
    makeOutboundCall: (toNumber: string, fromNumber: string) => Promise<boolean>;
}

// Define the shape of the error response from your backend
interface ApiErrorResponse {
    detail?: string;
    message?: string;
}

export const useVSimStore = create<VSimStore>((set, get) => ({
    countries: [],
    numbers: [],
    allNumbers: [],
    loadingDetails: false,
    loadingNumbers: false,
    isPurchasing: false,
    error: null,
    purchaseSuccess: null,
    purchasedNumbers: [],
    loadingPurchasedNumbers: false,

    smsLogs: [],
    callLogs: [],
    loadingLogs: false,

    hasMore: false,
    page: 1,

    fetchCountries: async () => {
        set({ loadingDetails: true, error: null });
        try {
            const countries = await vsimService.getCountries();
            set({ countries, loadingDetails: false });
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || err.response?.data?.message || 'Failed to fetch countries',
                loadingDetails: false
            });
        }
    },

    fetchNumbers: async (countryCode: string, type: VSimNumberType) => {
        set({ loadingNumbers: true, error: null, numbers: [], allNumbers: [], page: 1, hasMore: false });
        try {
            const pageSize = 5;
            const response = await vsimService.getNumbers(countryCode, type);
            const allNumbers = response.data;
            const initialNumbers = allNumbers.slice(0, pageSize);

            set({
                allNumbers,
                numbers: initialNumbers,
                loadingNumbers: false,
                hasMore: allNumbers.length > pageSize,
                page: 1
            });
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || `${type} numbers not found`,
                loadingNumbers: false
            });
        }
    },

    loadMoreNumbers: () => {
        const { page, allNumbers, numbers } = get();
        const pageSize = 5;
        const nextPage = page + 1;
        const currentCount = numbers.length;

        const nextBatch = allNumbers.slice(currentCount, currentCount + pageSize);

        if (nextBatch.length > 0) {
            set({
                numbers: [...numbers, ...nextBatch],
                hasMore: allNumbers.length > (currentCount + nextBatch.length),
                page: nextPage
            });
        } else {
            set({ hasMore: false });
        }
    },

    purchaseNumber: async (orderData: VSIMOrder) => {
        set({ isPurchasing: true, error: null, purchaseSuccess: null });
        try {
            await vsimService.purchaseNumber(orderData);
            set({ 
                isPurchasing: false, 
                purchaseSuccess: `Successfully purchased ${orderData.phone_number}` 
            });
            return true;
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                isPurchasing: false,
                error: err.response?.data?.detail || 'Failed to purchase number'
            });
            return false;
        }
    },

    fetchSMSLogs: async () => {
        set({ loadingLogs: true, error: null });
        try {
            const smsLogs = await vsimService.getSMSLogs();
            set({ smsLogs, loadingLogs: false });
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || 'Failed to fetch SMS logs',
                loadingLogs: false
            });
        }
    },

    sendSMS: async (to, message, fromNumber) => {
        set({ error: null });
        try {
            await vsimService.sendSMS(to, message, fromNumber);
            return true;
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || 'Failed to send SMS'
            });
            return false;
        }
    },

    fetchCallLogs: async () => {
        set({ loadingLogs: true, error: null });
        try {
            const callLogs = await vsimService.getCallLogs();
            set({ callLogs, loadingLogs: false });
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || 'Failed to fetch call logs',
                loadingLogs: false
            });
        }
    },

    fetchPurchasedNumbers: async () => {
        set({ loadingPurchasedNumbers: true, error: null });
        try {
            const response = await vsimService.getVSimOrders(1, 100);
            set({ 
                purchasedNumbers: response.data,
                loadingPurchasedNumbers: false 
            });
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || 'Failed to fetch purchased numbers',
                loadingPurchasedNumbers: false
            });
        }
    },

    resetNumbers: () => set({ 
        numbers: [], 
        allNumbers: [], 
        error: null, 
        hasMore: false, 
        page: 1 
    }),
    
    clearMessages: () => set({ error: null, purchaseSuccess: null }),
    makeOutboundCall: async (toNumber: string, fromNumber: string) => {
        set({ error: null });
        try {
            await vsimService.makeOutboundCall(toNumber, fromNumber);
            return true;
        } catch (error: unknown) {
            const err = error as AxiosError<ApiErrorResponse>;
            set({
                error: err.response?.data?.detail || 'Failed to make call'
            });
            return false;
        }
    }
}));