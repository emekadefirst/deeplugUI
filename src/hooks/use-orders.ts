import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/order-service';
import type { Order } from '../types';
import { useToastStore } from '../stores/toast-store';

export function useOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { addToast } = useToastStore();
    const prevOrdersRef = useRef<Map<string, Order>>(new Map());
    const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pendingActionsRef = useRef<Set<string>>(new Set());
    const cancelControllersRef = useRef<Map<string, AbortController>>(new Map());
    const smsPollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isSmsPollingRef = useRef(false);
    const ordersRef = useRef<Order[]>([]);

    useEffect(() => {
        ordersRef.current = orders;
    }, [orders]);

    const checkOrdersForUpdates = useCallback((newOrders: Order[]) => {
        newOrders.forEach(order => {
            const prevOrder = prevOrdersRef.current.get(order.id);
            if (prevOrder) {
                if (order.status === 'completed' && order.sms_code && (!prevOrder.sms_code || prevOrder.status !== 'completed')) {
                    addToast(`SMS Code received for ${order.service_name}: ${order.sms_code}`, 'success');
                }
            }
            prevOrdersRef.current.set(order.id, order);
        });
    }, [addToast]);

    const fetchOrders = useCallback(async (isPolling = false) => {
        try {
            if (!isPolling) setLoading(true);
            const response = await orderService.getOrders();
            const newOrders = response.data;

            setOrders(newOrders);
            checkOrdersForUpdates(newOrders);

            const hasPendingOrders = newOrders.some(order => order.status === 'pending');
            if (!hasPendingOrders && pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }

        } catch (err) {
            console.error('Failed to fetch orders:', err);
            if (!isPolling) setError('Failed to load orders. Please try again later.');
        } finally {
            if (!isPolling) setLoading(false);
        }
    }, [checkOrdersForUpdates]);

    useEffect(() => {
        fetchOrders();
        pollingIntervalRef.current = setInterval(() => {
            fetchOrders(true);
        }, 5000);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [fetchOrders]);

    // SMS Status Update Polling (PATCH sms/{id})
    useEffect(() => {
        smsPollingIntervalRef.current = setInterval(async () => {
            if (isSmsPollingRef.current) return;
            
            const pendingOrders = ordersRef.current.filter(
                o => o.order_type === 'sms' && o.status === 'pending'
            );

            if (pendingOrders.length === 0) return;

            isSmsPollingRef.current = true;
            try {
                for (const order of pendingOrders) {
                    try {
                        await orderService.updateSms(order.id);
                        const updatedOrder = await orderService.getOrder(order.id);
                        if (updatedOrder) {
                            setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
                            checkOrdersForUpdates([updatedOrder]);
                        }
                    } catch (err) {
                        console.error(`SMS Poll failed for ${order.id}:`, err);
                    }
                }
            } finally {
                isSmsPollingRef.current = false;
            }
        }, 5000);

        return () => {
            if (smsPollingIntervalRef.current) {
                clearInterval(smsPollingIntervalRef.current);
                smsPollingIntervalRef.current = null;
            }
        };
    }, [checkOrdersForUpdates]);

    const handleRefreshOrder = useCallback(async (id: string) => {
        if (actionLoading[id] || pendingActionsRef.current.has(id)) return;

        pendingActionsRef.current.add(id);
        setActionLoading(prev => ({ ...prev, [id]: true }));
        try {
            const updatedOrder = await orderService.getOrder(id);
            if (updatedOrder) {
                setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
                checkOrdersForUpdates([updatedOrder]);
                addToast('Order refreshed', 'success');
            }
        } catch (err) {
            addToast('Failed to refresh order', 'error');
        } finally {
            pendingActionsRef.current.delete(id);
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    }, [actionLoading, checkOrdersForUpdates, addToast]);

    const handleCancelOrder = useCallback(async (id: string) => {
        if (actionLoading[id] || pendingActionsRef.current.has(id)) return;

        if (cancelControllersRef.current.has(id)) {
            cancelControllersRef.current.get(id)!.abort();
        }

        const controller = new AbortController();
        cancelControllersRef.current.set(id, controller);

        pendingActionsRef.current.add(id);
        setActionLoading(prev => ({ ...prev, [id]: true }));

        try {
            await orderService.cancelOrder(id, controller.signal);
            addToast('Order cancelled successfully', 'success');
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            addToast('Failed to cancel order', 'error');
            handleRefreshOrder(id);
        } finally {
            cancelControllersRef.current.delete(id);
            pendingActionsRef.current.delete(id);
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    }, [actionLoading, addToast, handleRefreshOrder]);

    const handleReactivateOrder = useCallback(async (id: string) => {
        if (actionLoading[id] || pendingActionsRef.current.has(id)) return;

        if (cancelControllersRef.current.has(id)) {
            cancelControllersRef.current.get(id)!.abort();
        }

        const controller = new AbortController();
        cancelControllersRef.current.set(id, controller);

        pendingActionsRef.current.add(id);
        setActionLoading(prev => ({ ...prev, [id]: true }));
        try {
            await orderService.reactivateOrder(id, controller.signal);
            addToast('Order reactivation successful', 'success');
            fetchOrders();
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            addToast('Failed to reactivate', 'error');
        } finally {
            cancelControllersRef.current.delete(id);
            pendingActionsRef.current.delete(id);
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    }, [actionLoading, addToast, fetchOrders]);

    const handleCopyCode = useCallback(async (code: string, id: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);
            addToast('SMS Code copied to clipboard', 'success');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            addToast('Failed to copy code', 'error');
        }
    }, [addToast]);

    return {
        orders,
        loading,
        actionLoading,
        error,
        filter,
        setFilter,
        copiedId,
        showNewOrderModal,
        setShowNewOrderModal,
        fetchOrders,
        handleRefreshOrder,
        handleCancelOrder,
        handleReactivateOrder,
        handleCopyCode,
        navigate,
    };
}
