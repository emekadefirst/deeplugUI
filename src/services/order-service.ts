import api from './api';
import type { OrdersResponse } from '../types';

export interface GetOrdersParams {
    page?: number;
    page_size?: number;
    status?: string;
    order_type?: string;
    country_name?: string;
    service_name?: string;
    id?: string;
}

export const orderService = {
    getOrders: async (params?: GetOrdersParams) => {
        const response = await api.get<OrdersResponse>('/orders/whoami', { params });
        return response.data;
    },
    getOrder: async (id: string) => {
        const response = await api.get<OrdersResponse>('/orders/whoami', { params: { id } });
        return response.data.data[0];
    },
    cancelOrder: async (id: string, signal?: AbortSignal) => {
        return await api.post(`/sms/cancel/${id}`, null, { signal });
    },
    reactivateOrder: async (id: string, signal?: AbortSignal) => {
        return await api.post(`/sms/reactivate/${id}`, null, { signal });
    },
    updateSms: async (id: string, signal?: AbortSignal) => {
        return await api.patch(`/sms/${id}`, null, { signal });
    }
};
