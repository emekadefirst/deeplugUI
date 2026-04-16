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
                    <h1 className="text-2xl font-semibold text-[#2c3e5e] tracking-tight">Orders</h1>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="p-2 text-zinc-400 hover:text-[#2c3e5e] hover:bg-zinc-100 rounded-xl transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => onFilterChange(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f
                                    ? 'bg-white text-[#2c3e5e] shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={onNewOrder}
                className="flex items-center justify-center gap-2 bg-[#2c3e5e] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#1a263b] transition-all shadow-sm"
            >
                <Plus className="w-4 h-4" />
                New Order
            </button>
        </div>
    );
});

OrderHeader.displayName = 'OrderHeader';
