import api from './api';

export interface VSimCountry {
    beta: boolean;
    country: string;
    country_code: string;
    subresource_uris?: {
        local?: string;
        mobile?: string;
        toll_free?: string;
    };
    uri?: string;
}

export interface VSimResponse<T> {
    status: string;
    count?: number;
    data: T;
}

export type VSimNumberType = 'Local' | 'Mobile' | 'TollFree' | 'National';

export interface VSimPhoneNumber {
    friendly_name: string;
    phone_number: string;
    lata?: string;
    locality?: string;
    rate_center?: string;
    latitude?: string;
    longitude?: string;
    region?: string;
    postal_code?: string;
    iso_country: string;
    address_requirements?: string;
    beta: boolean;
    capabilities?: {
        voice: boolean;
        SMS: boolean;
        MMS: boolean;
    };
    price?: number;
    currency?: string;
    exchange_rate?: number;
}

export const vsimService = {
    getCountries: async (): Promise<VSimCountry[]> => {
        const response = await api.get<VSimResponse<VSimCountry[]>>('/vsims/countries');
        return response.data.data;
    },

    getNumbers: async (countryCode: string, type: VSimNumberType, params?: { page?: number; page_size?: number }): Promise<VSimResponse<VSimPhoneNumber[]>> => {
        const response = await api.get<VSimResponse<VSimPhoneNumber[]>>(`/vsims/numbers/${countryCode}`, {
            params: { type, ...params }
        });
        return response.data;
    },

    purchaseNumber: async (phoneNumber: string): Promise<any> => {
        const response = await api.post('/vsims/purchase', { phone_number: phoneNumber });
        return response.data;
    },

    getSMSLogs: async (): Promise<VSimSMS[]> => {
        const response = await api.get<VSimResponse<VSimSMS[]>>('/vsims/sms');
        return response.data.data;
    },

    sendSMS: async (to: string, message: string, fromNumber: string): Promise<any> => {
        const response = await api.post('/vsims/sms', {
            to_number: to,
            message,
            from_number: fromNumber
        });
        return response.data;
    },

    getCallLogs: async (): Promise<VSimCall[]> => {
        const response = await api.get<VSimResponse<VSimCall[]>>('/vsims/calls');
        return response.data.data;
    },

    getVoiceToken: async (userId: string): Promise<{ token: string }> => {
        const response = await api.get<{ token: string }>(`/vsims/voice/token`, {
            params: { user_id: userId }
        });
        return response.data;
    },
};

export interface VSimSMS {
    id: string;
    from: string;
    to: string;
    body: string;
    direction: 'inbound' | 'outbound';
    status: string;
    created_at: string;
}

export interface VSimCall {
    id: string;
    from: string;
    to: string;
    direction: 'inbound' | 'outbound';
    status: string;
    duration: number;
    created_at: string;
}
