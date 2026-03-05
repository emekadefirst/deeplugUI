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
    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.cancelled;
    const type = typeConfig[order.order_type as keyof typeof typeConfig] || { icon: Package, bg: 'bg-gray-50', text: 'text-gray-600' };
    const Icon = type.icon;
    const StatusIcon = status.icon;

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
        <div className="p-6 sm:p-8 hover:bg-gray-50/50 transition-all border-b border-gray-100 last:border-0 group relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${type.bg}/50 rounded-bl-[100px] transition-transform duration-500 translate-x-32 -translate-y-32 group-hover:translate-x-16 group-hover:-translate-y-16`} />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-5 flex-1">
                    <div className={`w-14 h-14 ${type.bg} rounded-[1.25rem] flex items-center justify-center flex-shrink-0 shadow-sm border border-white transition-transform group-hover:scale-110`}>
                        <Icon className={`w-7 h-7 ${type.text}`} />
                    </div>

                    <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-black text-[#2c3e5e] tracking-tight">{order.service_name}</h3>
                            <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border ${type.bg} ${type.text}`}>
                                {order.order_type}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Sequence: {order.order_id}</p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                            <div className="flex items-center gap-2 group/info">
                                <div className="p-1.5 bg-gray-50 rounded-lg group-hover/info:bg-white transition-colors">
                                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                                </div>
                                <span className="text-xs font-bold text-gray-600">{order.country_name}</span>
                            </div>
                            <div className="flex items-center gap-2 group/info">
                                <div className="p-1.5 bg-gray-50 rounded-lg group-hover/info:bg-white transition-colors">
                                    <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                                </div>
                                <span className="text-xs font-black text-[#2c3e5e] font-mono tracking-tight">{order.phone_number}</span>
                            </div>
                            <div className="flex items-center gap-2 group/info">
                                <div className="p-1.5 bg-gray-50 rounded-lg group-hover/info:bg-white transition-colors">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                </div>
                                <span className="text-xs font-bold text-gray-500">{formatDate(order.created_at)}</span>
                            </div>
                        </div>

                        {order.order_type === 'sms' && (
                            <div className={`mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-2xl border-2 animate-in slide-in-from-left-2 ${order.sms_code
                                ? 'bg-green-50/50 text-green-700 border-green-100'
                                : 'bg-amber-50/50 text-amber-700 border-amber-100'
                                }`}>
                                <Hash className="w-4 h-4 opacity-50" />
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        {order.sms_code ? (
                                            <span className="flex items-center gap-3">
                                                Code: <span className="text-sm font-black font-mono tracking-tighter bg-white px-2 py-0.5 rounded-lg border border-green-200">{order.sms_code}</span>
                                                <button
                                                    onClick={() => onCopy(order.sms_code!, order.id)}
                                                    className="p-1.5 hover:bg-green-100 rounded-xl transition-all active:scale-90"
                                                >
                                                    {copiedId === order.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </span>
                                        ) : 'Establishing link...'}
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
                            className="p-2.5 bg-white hover:bg-gray-50 text-gray-400 hover:text-[#2c3e5e] rounded-xl border border-gray-100 transition-all disabled:opacity-50"
                            title="Synchronize"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>

                        {order.status === 'pending' && (
                            <button
                                onClick={() => onCancel(order.id)}
                                disabled={isLoading}
                                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
                            >
                                <X className="w-3.5 h-3.5" />
                                Terminate
                            </button>
                        )}

                        {(order.order_type === 'rental' || order.order_type === 'sms') && order.status === 'completed' && (
                            <button
                                onClick={() => onReactivate(order.id)}
                                disabled={isLoading}
                                className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-2"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reactivate
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-2.5 pl-8 border-l border-gray-100 min-w-[120px]">
                        <p className="font-black text-[#2c3e5e] text-2xl tracking-tighter">₦{order.amount.toLocaleString()}</p>
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {order.status}
                        </span>
                        {order.expiry_date && (
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
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
