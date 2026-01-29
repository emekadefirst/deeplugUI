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

export interface VSIMOrder {
    phone_number: string;
    amount: number;
    type: string[];
    detail: string;
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

    purchaseNumber: async (data: VSIMOrder): Promise<void> => {
        const response = await api.post('/vsims/purchase', data);
        return response.data;
    },

    getSMSLogs: async (params?: { search?: string; page?: number; page_size?: number; type?: 'in' | 'out' }): Promise<VSimSMS[]> => {
        const response = await api.get<VSimResponse<VSimSMS[]>>('/vsims/smslogs/whoami', { params });
        return response.data.data;
    },

    sendSMS: async (to: string, message: string, fromNumber: string): Promise<void> => {
        const response = await api.post('/vsims/messages/out', {
            to: to,
            From: fromNumber,
            content: message
        });
        return response.data;
    },

    getCallLogs: async (): Promise<VSimCall[]> => {
        const response = await api.get<VSimResponse<VSimCall[]>>('/vsims/calllogs/whoami');
        return response.data.data;
    },

    getVoiceToken: async (userId: string): Promise<{ token: string }> => {
        const response = await api.get<any>(`/vsims/voice/token`, {
            params: { user_id: userId }
        });

        // Handle different possible response structures
        if (response.data?.token) {
            return { token: response.data.token };
        } else if (response.data?.data?.token) {
            return { token: response.data.data.token };
        } else if (typeof response.data?.data === 'string') {
            return { token: response.data.data };
        }

        return response.data;
    },

    getVSimOrders: async (page: number = 1, pageSize: number = 100): Promise<VSimOrdersResponse> => {
        const response = await api.get<VSimOrdersResponse>('/orders/whoami', {
            params: {
                order_type: 'vsim',
                page,
                page_size: pageSize
            }
        });
        return response.data;
    },

    makeOutboundCall: async (toNumber: string, fromNumber: string): Promise<void> => {
        const response = await api.post('/vsims/voice/outbound-handler', {
            to_num: toNumber,
            phone_number: fromNumber,
            dial_target: toNumber
        });
        return response.data;
    }
};

export interface VSimSMS {
    id: string;
    number: string;
    content: string;
    from_number: string;
    to_number: string;
    type: 'in' | 'out';
    status: string;
    user_id: string;
    username: string;
    created_at: string;
}

export interface VSimCall {
    id: string;
    from_number: string;
    to_number: string;
    type: 'in' | 'out';
    status: string;
    duration: number;
    created_at: string;
}

export interface VSimOrderResponse {
    id: string;
    phone_number: string;
    amount: number;
    status: string;
    order_type: string;
    created_at: string;
    username: string;
}

export interface VSimOrdersResponse {
    total: number;
    page: number;
    page_size: number;
    data: VSimOrderResponse[];
}
