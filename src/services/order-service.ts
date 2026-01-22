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
        return await api.post('/sms/cancel', null, { params: { order_id: id }, signal });
    },
    reactivateOrder: async (id: string, signal?: AbortSignal) => {
        return await api.post('/sms/reactivate', null, { params: { order_id: id }, signal });
    }
};
