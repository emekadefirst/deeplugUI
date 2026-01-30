import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, Smartphone, Globe, Calendar, Hash, Copy, Check, MessageSquare, Cpu, Key, RefreshCw, X, RotateCcw, Plus, ArrowRight } from 'lucide-react';
import { orderService } from '../../services/order-service';
import type { Order } from '../../types';
import { useToastStore } from '../../stores/toast-store';

export const OrdersPage = () => {
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

    const handleRefreshOrder = async (id: string) => {
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
    };


    const handleCancelOrder = async (id: string) => {
        if (actionLoading[id] || pendingActionsRef.current.has(id)) return;

        // Cancel any existing request for this order
        if (cancelControllersRef.current.has(id)) {
            cancelControllersRef.current.get(id)!.abort();
        }

        // Create new controller
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
            console.error('Cancel error:', err);
            addToast('Failed to cancel order', 'error');
            handleRefreshOrder(id);
        } finally {
            cancelControllersRef.current.delete(id);
            pendingActionsRef.current.delete(id);
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleReactivateOrder = async (id: string) => {
        if (actionLoading[id] || pendingActionsRef.current.has(id)) return;

        // Cancel any existing request for this order
        if (cancelControllersRef.current.has(id)) {
            cancelControllersRef.current.get(id)!.abort();
        }

        // Create new controller
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
    };

    const handleCopyCode = async (code: string, id: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedId(id);
            addToast('SMS Code copied to clipboard', 'success');
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            addToast('Failed to copy code', 'error');
        }
    };

    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        failed: { color: 'bg-red-100 text-red-700', icon: XCircle },
        cancelled: { color: 'bg-gray-100 text-gray-700', icon: XCircle },
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredOrders = orders.filter(order =>
        filter === 'all' ? true : order.status === filter
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c3e5e]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16 text-red-600">
                <p>{error}</p>
                <button
                    onClick={() => fetchOrders(false)}
                    className="mt-4 px-4 py-2 bg-[#2c3e5e] text-white rounded-lg hover:bg-[#1f2d42] transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#2c3e5e]">My Orders</h1>
                    <button
                        onClick={() => fetchOrders(false)}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-[#2c3e5e] hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
                        title="Refresh All Orders"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowNewOrderModal(true)}
                        className="flex items-center gap-2 bg-[#2c3e5e] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#1f2d42] transition-all shadow-lg shadow-[#2c3e5e]/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Order
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(['all', 'pending', 'completed', 'cancelled'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors capitalize ${filter === status
                                ? 'bg-[#2c3e5e] text-white border-[#2c3e5e]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start by choosing a service from the dashboard</p>
                        <a
                            href="/dashboard"
                            className="inline-flex items-center gap-2 bg-[#2c3e5e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1f2d42] transition-all"
                        >
                            Browse Services
                        </a>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No {filter} orders found.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => {
                            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
                            const statusColor = statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-700';
                            const isLoading = actionLoading[order.id];

                            const getOrderIcon = () => {
                                switch (order.order_type) {
                                    case 'sms': return <MessageSquare className="w-6 h-6 text-blue-600" />;
                                    case 'esim': return <Cpu className="w-6 h-6 text-purple-600" />;
                                    case 'rental': return <Key className="w-6 h-6 text-orange-600" />;
                                    default: return <Package className="w-6 h-6 text-gray-600" />;
                                }
                            };

                            const getIconBg = () => {
                                switch (order.order_type) {
                                    case 'sms': return 'bg-blue-50';
                                    case 'esim': return 'bg-purple-50';
                                    case 'rental': return 'bg-orange-50';
                                    default: return 'bg-gray-50';
                                }
                            };

                            return (
                                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-12 h-12 ${getIconBg()} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-black/5`}>
                                                {getOrderIcon()}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-[#2c3e5e]">{order.service_name}</h3>
                                                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200 uppercase font-bold tracking-wider">
                                                        {order.order_type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-mono">ID: {order.order_id}</p>

                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-4 h-4 text-gray-400" />
                                                        <span>{order.country_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone className="w-4 h-4 text-gray-400" />
                                                        <span className="font-medium font-mono text-gray-700">{order.phone_number}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span>{formatDate(order.created_at)}</span>
                                                    </div>
                                                </div>

                                                {order.order_type === 'sms' && (
                                                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${order.sms_code
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                        }`}>
                                                        <Hash className="w-4 h-4" />
                                                        <span className="text-sm font-medium">
                                                            {order.sms_code ? (
                                                                <span className="flex items-center gap-2">
                                                                    Code: <span className="font-bold font-mono">{order.sms_code}</span>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleCopyCode(order.sms_code!, order.id);
                                                                        }}
                                                                        className="p-1 hover:bg-green-100 rounded-full transition-colors"
                                                                        title="Copy Code"
                                                                    >
                                                                        {copiedId === order.id ? (
                                                                            <Check className="w-3.5 h-3.5" />
                                                                        ) : (
                                                                            <Copy className="w-3.5 h-3.5" />
                                                                        )}
                                                                    </button>
                                                                </span>
                                                            ) : 'Waiting for code...'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4 lg:self-start">
                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRefreshOrder(order.id);
                                                    }}
                                                    disabled={isLoading}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all disabled:opacity-50"
                                                    title="Refresh Order"
                                                >
                                                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                                    Refresh
                                                </button>

                                                {order.status === 'pending' && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCancelOrder(order.id);
                                                        }}
                                                        disabled={isLoading}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        {isLoading ? (
                                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <X className="w-3.5 h-3.5" />
                                                        )}
                                                        Cancel
                                                    </button>
                                                )}

                                                {(order.order_type === 'rental' || order.order_type === 'sms') && order.status === 'completed' && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReactivateOrder(order.id);
                                                        }}
                                                        disabled={isLoading}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2c3e5e] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-all disabled:opacity-50"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Reactivate
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5 pl-4 border-l border-gray-100">
                                                <p className="font-bold text-[#2c3e5e] text-lg leading-none">₦{order.amount.toLocaleString()}</p>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusColor}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {order.status}
                                                </span>
                                                {order.expiry_date && (
                                                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                        Exp: {formatDate(order.expiry_date)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* New Order Modal */}
            {showNewOrderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-bold text-[#2c3e5e]">Create New Order</h2>
                            <button
                                onClick={() => setShowNewOrderModal(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* SMS Verification */}
                            <button
                                onClick={() => {
                                    setShowNewOrderModal(false);
                                    navigate('/dashboard/services/verify');
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-[#2c3e5e] hover:bg-gray-50 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <MessageSquare className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-[#2c3e5e]">SMS Verification</p>
                                        <p className="text-xs text-gray-500">Get OTP for your accounts</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#2c3e5e] group-hover:translate-x-1 transition-all" />
                            </button>



                            {/* Virtual SIM */}
                            <button
                                onClick={() => {
                                    setShowNewOrderModal(false);
                                    navigate('/dashboard/services/virtual-sim');
                                }}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-[#2c3e5e] hover:bg-gray-50 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                        <Smartphone className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-[#2c3e5e]">Virtual SIM</p>
                                        <p className="text-xs text-gray-500">Get numbers for calls & SMS</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#2c3e5e] group-hover:translate-x-1 transition-all" />
                            </button>
                            {/* Rental */}
                            <div className="relative group grayscale cursor-not-allowed">
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-200 text-gray-600 px-2 py-1 rounded-md">Coming Soon</span>
                                </div>
                                <div className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                            <Key className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-[#2c3e5e]">Rental</p>
                                            <p className="text-xs text-gray-500">Long-term number rental</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-200" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setShowNewOrderModal(false)}
                                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
