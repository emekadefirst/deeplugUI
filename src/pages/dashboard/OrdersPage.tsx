/**
 * OrdersPage — Orchestrator for user orders.
 * 
 * Logic handled by useOrders hook.
 * UI decomposed into src/components/orders/.
 */

import { ShoppingBag } from 'lucide-react';
import { useOrders } from '../../hooks/use-orders';
import { OrderHeader, OrderItem, NewOrderModal } from '../../components/orders';
import { SEO } from '../../components/SEO';

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
                <SEO title="Orders" description="Manage your active and past orders." />
                <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 font-medium text-sm">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-24 bg-red-50/50 rounded-3xl border border-red-100 flex flex-col items-center gap-4">
                <p className="text-red-700 font-medium">{error}</p>
                <button
                    onClick={() => fetchOrders(false)}
                    className="px-6 py-2.5 bg-[#2c3e5e] text-white rounded-xl font-medium text-sm hover:bg-[#1a263b] transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const filteredOrders = orders.filter(order =>
        filter === 'all' ? true : order.status === filter
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 px-3 sm:px-4 pb-12">
            <SEO title="Orders" description="Manage your active and past orders." />
            <OrderHeader
                filter={filter}
                loading={loading}
                onFilterChange={setFilter}
                onRefresh={() => fetchOrders(false)}
                onNewOrder={() => setShowNewOrderModal(true)}
            />

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden min-h-[500px]">
                {orders.length === 0 ? (
                    <div className="text-center py-32 px-6 flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200/50">
                            <ShoppingBag className="w-8 h-8 text-zinc-300" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-zinc-500 font-medium max-w-xs mx-auto">You have no orders yet</p>
                        </div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-40 flex flex-col items-center gap-4">
                        <p className="text-zinc-500 font-medium text-sm">No orders found for "{filter}"</p>
                        <button
                            onClick={() => setFilter('all')}
                            className="text-[#2c3e5e] font-medium text-sm hover:underline underline-offset-4"
                        >
                            Clear Filters
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
