import api from './api';

export interface Country {
    ID: number;
    name: string;
    short_name: string;
    cc: string;
    region: string;
}

export interface Service {
    ID: number;
    name: string;
    favourite: number;
}

export interface PriceRequest {
    country: number; // Country ID
    service: number; // Service ID
    pricing_option: number; // 0 for low, 1 for high
    areacode?: string[]; // Array of area codes
}

export interface PriceResponse {
    price: string;
    high_price: string;
    success_rate: number;
}

export interface RentRequest {
    country: string;
    service: number;
    quantity: number;
    pricing_option: number;
    areacode?: string[];
}

export interface RentResponse {
    id: string;
    number: string;
    status: string;
    // Add other fields as needed
}

export const smsService = {
    getCountries: async () => {
        const response = await api.get<Country[]>('/sms/countries');
        return response.data;
    },

    getServices: async () => {
        const response = await api.get<Service[]>('/sms/services');
        return response.data;
    },

    getPrice: async (params: PriceRequest) => {
        const response = await api.get<PriceResponse>('/sms/price/', { params });
        return response.data;
    },

    rentNumber: async (data: RentRequest) => {
        const response = await api.post<RentResponse>('/sms/', data);
        return response.data;
    },
};
