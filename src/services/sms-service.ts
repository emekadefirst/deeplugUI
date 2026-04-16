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
    country: string;
    service: string;
    areacode?: string;
}
export interface PriceResponse {
    price?: number;
    high_price?: number;
    success_rate?: number;
    message?: string;
}


export interface RentRequest {
    country: string;
    service: string;
    price_found: number;
    pricing_option: number;
    areacode?: string[];
}

export interface RentResponse {
    id?: string;
    number?: string;
    status?: string;
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

    getPrice: async (data: PriceRequest) => {
        const response = await api.post<PriceResponse>('/sms/price', data);
        return response.data;
    },

    rentNumber: async (data: RentRequest) => {
        const response = await api.post<RentResponse>('/sms/rent', data);
        console.log('request data', data);
        return response.data;
    },
};
