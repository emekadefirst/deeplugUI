/**
 * OrdersPage — Orchestrator for user orders.
 * 
 * Logic handled by useOrders hook.
 * UI decomposed into src/components/orders/.
 */

import { ShoppingBag } from 'lucide-react';
import { useOrders } from '../../hooks/use-orders';
import { OrderHeader, OrderItem, NewOrderModal } from '../../components/orders';

export const OrdersPage = () => {
    const {
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
    } = useOrders();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-[#2c3e5e] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Syncing Orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-24 bg-red-50/50 rounded-[2.5rem] border border-red-100 flex flex-col items-center gap-4">
                <p className="text-red-700 font-bold uppercase tracking-tight">{error}</p>
                <button
                    onClick={() => fetchOrders(false)}
                    className="px-8 py-3 bg-[#2c3e5e] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1a263b] transition-all"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const filteredOrders = orders.filter(order =>
        filter === 'all' ? true : order.status === filter
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 px-3 sm:px-4 pb-12">
            <OrderHeader
                filter={filter}
                loading={loading}
                onFilterChange={setFilter}
                onRefresh={() => fetchOrders(false)}
                onNewOrder={() => setShowNewOrderModal(true)}
            />

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                {orders.length === 0 ? (
                    <div className="text-center py-32 px-6 flex flex-col items-center gap-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center shadow-inner">
                            <ShoppingBag className="w-10 h-10 text-gray-200" />
                        </div>
                        <div className="space-y-2">
                    
                            <p className="text-gray-400 font-medium max-w-xs mx-auto">You have no orders yet</p>
                        </div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-40 flex flex-col items-center gap-4">
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No records matching "{filter}"</p>
                        <button
                            onClick={() => setFilter('all')}
                            className="text-[#2c3e5e] font-black text-xs hover:underline decoration-2 underline-offset-4"
                        >
                            Clear View Filters
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredOrders.map((order) => (
                            <OrderItem
                                key={order.id}
                                order={order}
                                isLoading={actionLoading[order.id]}
                                copiedId={copiedId}
                                onRefresh={handleRefreshOrder}
                                onCancel={handleCancelOrder}
                                onReactivate={handleReactivateOrder}
                                onCopy={handleCopyCode}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showNewOrderModal && (
                <NewOrderModal
                    onClose={() => setShowNewOrderModal(false)}
                    onNavigate={(path) => {
                        setShowNewOrderModal(false);
                        navigate(path);
                    }}
                />
            )}
        </div>
    );
};
