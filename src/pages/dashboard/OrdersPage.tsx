import React from 'react';
import { ShoppingBag, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export const OrdersPage = () => {
    const orders = [
        // Example data structure - will be empty initially
    ];

    const statusConfig = {
        pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        active: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
        completed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
        cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#2c3e5e]">Orders</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        All Orders
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Active
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Completed
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-2xl border border-gray-200">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
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
                ) : (
                    <div className="divide-y divide-gray-200">
                        {orders.map((order: any) => {
                            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
                            return (
                                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Package className="w-6 h-6 text-[#2c3e5e]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-[#2c3e5e] mb-1">{order.service}</h3>
                                                <p className="text-sm text-gray-500">Order #{order.id}</p>
                                                <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#2c3e5e] mb-2">${order.amount}</p>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status as keyof typeof statusConfig]?.color
                                                }`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    {order.details && (
                                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                                            <p className="text-gray-600">{order.details}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
