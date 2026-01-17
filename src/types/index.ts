export interface Order {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled' | 'failed';
    order_type: 'rental' | 'sms' | 'esim';
    order_id: string;
    phone_number: string;
    sms_code: string | null;
    service_name: string;
    country_name: string;
    expiry_date: string;
    duration: string | null;
    created_at: string;
    username: string;
}

export interface OrdersResponse {
    total: number;
    page: number;
    page_size: number;
    data: Order[];
}
