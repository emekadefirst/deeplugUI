import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';

interface Props {
    filter: string;
    loading: boolean;
    onFilterChange: (f: any) => void;
    onRefresh: () => void;
    onNewOrder: () => void;
}

const FILTERS = ['all', 'pending', 'completed', 'cancelled'] as const;

export const OrderHeader = React.memo(({ filter, loading, onFilterChange, onRefresh, onNewOrder }: Props) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-[#2c3e5e] tracking-tight">Orders</h1>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2.5 text-gray-400 hover:text-[#2c3e5e] hover:bg-white rounded-2xl transition-all disabled:opacity-50 border border-transparent hover:border-gray-100"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-fit">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all capitalize ${filter === f
                                    ? 'bg-white text-[#2c3e5e] shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={onNewOrder}
                className="flex items-center justify-center gap-2.5 bg-[#2c3e5e] text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-[#1a263b] transition-all shadow-xl shadow-[#2c3e5e]/20 group"
            >
                <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                New order
            </button>
        </div>
    );
});

OrderHeader.displayName = 'OrderHeader';
