import React from 'react';
import {
    Clock, CheckCircle, XCircle, Package, MessageSquare, Cpu, Key,
    Globe, Smartphone, Calendar, Hash, Check, Copy, RefreshCw, X, RotateCcw
} from 'lucide-react';
import type { Order } from '../../types';

interface Props {
    order: Order;
    isLoading: boolean;
    copiedId: string | null;
    onRefresh: (id: string) => void;
    onCancel: (id: string) => void;
    onReactivate: (id: string) => void;
    onCopy: (code: string, id: string) => void;
}

const statusConfig = {
    pending: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
    completed: { color: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle },
    failed: { color: 'bg-red-50 text-red-600 border-red-100', icon: XCircle },
    cancelled: { color: 'bg-gray-50 text-gray-400 border-gray-100', icon: XCircle },
};

const typeConfig = {
    sms: { icon: MessageSquare, bg: 'bg-blue-50', text: 'text-blue-600' },
    esim: { icon: Cpu, bg: 'bg-purple-50', text: 'text-purple-600' },
    rental: { icon: Key, bg: 'bg-orange-50', text: 'text-orange-600' },
};

export const OrderItem = React.memo(({
    order, isLoading, copiedId, onRefresh, onCancel, onReactivate, onCopy
}: Props) => {
    const [copiedPhone, setCopiedPhone] = React.useState(false);
    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.cancelled;
    const type = typeConfig[order.order_type as keyof typeof typeConfig] || { icon: Package, bg: 'bg-gray-50', text: 'text-gray-600' };
    const Icon = type.icon;
    const StatusIcon = status.icon;

    const handleCopyPhone = React.useCallback(async () => {
        try {
            await navigator.clipboard.writeText(order.phone_number);
            setCopiedPhone(true);
            setTimeout(() => setCopiedPhone(false), 2000);
        } catch (e) {
            console.error('Failed to copy', e);
        }
    }, [order.phone_number]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 sm:p-8 hover:bg-slate-50/50 transition-all border-b border-slate-100 last:border-0 group relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${type.bg}/50 rounded-bl-[100px] transition-transform duration-500 translate-x-32 -translate-y-32 group-hover:translate-x-16 group-hover:-translate-y-16`} />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-5 flex-1">
                    <div className={`w-14 h-14 ${type.bg} rounded-[1.25rem] flex items-center justify-center flex-shrink-0 shadow-sm border border-white transition-transform group-hover:scale-110`}>
                        <Icon className={`w-7 h-7 ${type.text}`} />
                    </div>

                    <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-[#2c3e5e] tracking-tight">{order.service_name}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium uppercase border ${type.bg} ${type.text}`}>
                                {order.order_type}
                            </span>
                        </div>
               

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                            <div className="flex items-center gap-2 group/info">
                                <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-white transition-colors">
                                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <span className="text-xs font-medium text-slate-600">{order.country_name}</span>
                            </div>
                            <div className="flex items-center gap-2 group/info">
                                <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-white transition-colors">
                                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium text-[#2c3e5e]">{order.phone_number}</span>
                                    <button
                                        onClick={handleCopyPhone}
                                        className="p-1 text-slate-400 hover:text-[#2c3e5e] hover:bg-slate-100 rounded-md transition-all duration-200 active:scale-95 opacity-100 sm:opacity-0 group-hover/info:opacity-100"
                                        title="Copy number"
                                        aria-label="Copy phone number"
                                    >
                                        {copiedPhone ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 group/info">
                                <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-white transition-colors">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <span className="text-xs font-medium text-slate-500">{formatDate(order.created_at)}</span>
                            </div>
                        </div>

                        {order.order_type === 'sms' && (order.sms_code || order.status === 'pending') && (
                            <div className={`mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-2xl border ${order.sms_code
                                ? 'bg-green-50/50 text-green-700 border-green-200/50'
                                : 'bg-amber-50/50 text-amber-700 border-amber-200/50'
                                }`}>
                                <Hash className="w-4 h-4 opacity-50" />
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium">
                                        {order.sms_code ? (
                                            <span className="flex items-center gap-3">
                                                Code: <span className="text-sm font-semibold tracking-tight bg-white px-2 py-0.5 rounded-lg border border-green-200">{order.sms_code}</span>
                                                <button
                                                    onClick={() => onCopy(order.sms_code!, order.id)}
                                                    className="p-1.5 hover:bg-green-100 rounded-xl transition-all duration-200 active:scale-95"
                                                    aria-label="Copy SMS code"
                                                >
                                                    {copiedId === order.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </span>
                                        ) : 'Awaiting code...'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 lg:self-start">
                    {/* Action Hub */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onRefresh(order.id)}
                            disabled={isLoading}
                            className="p-2.5 bg-white hover:bg-slate-50 text-slate-500 hover:text-[#2c3e5e] rounded-xl border border-slate-200/50 transition-all duration-200 active:scale-95 disabled:opacity-50 group/refresh"
                            title="Refresh"
                            aria-label="Refresh order status"
                        >
                            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover/refresh:rotate-180'}`} />
                        </button>

                        {order.status === 'pending' && (
                            <button
                                onClick={() => onCancel(order.id)}
                                disabled={isLoading}
                                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100/50 hover:bg-red-100 transition-all duration-200 active:scale-95 flex items-center gap-2 group/btn"
                                aria-label="Cancel Order"
                            >
                                <X className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform duration-200" />
                                Cancel
                            </button>
                        )}

                        {(order.order_type === 'rental' || order.order_type === 'sms') && (order.status === 'completed' || order.status === 'cancelled') && (
                            <button
                                onClick={() => onReactivate(order.id)}
                                disabled={isLoading}
                                className="px-4 py-2.5 bg-slate-50 text-[#2c3e5e] rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-100 transition-all duration-200 active:scale-95 flex items-center gap-2"
                                aria-label="Reactivate Order"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reactivate
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-2.5 pl-8 border-l border-slate-200/50 min-w-[120px]">
                        <p className="font-semibold text-[#2c3e5e] text-2xl tracking-tight">₦{order.amount.toLocaleString()}</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border capitalize ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {order.status}
                        </span>
                        {order.expiry_date && (
                            <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                {formatDate(order.expiry_date)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

OrderItem.displayName = 'OrderItem';
