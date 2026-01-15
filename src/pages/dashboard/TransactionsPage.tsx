import React, { useState } from 'react';
import { Receipt, Filter, Download, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const TransactionsPage = () => {
    const [filterType, setFilterType] = useState('all');

    const transactions = [
        // Example data - will be populated from API
    ];

    const filterOptions = [
        { value: 'all', label: 'All Transactions' },
        { value: 'credit', label: 'Credits' },
        { value: 'debit', label: 'Debits' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#2c3e5e]">Transactions</h1>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 focus:border-[#2c3e5e]"
                        />
                    </div>
                    <div className="flex gap-2">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilterType(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === option.value
                                    ? 'bg-[#2c3e5e] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-2xl border border-gray-200">
                {transactions.length === 0 ? (
                    <div className="text-center py-16">
                        <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No transactions yet</h3>
                        <p className="text-gray-500">Your transaction history will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {transactions.map((txn: any) => (
                            <div key={txn.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {txn.type === 'credit' ? (
                                                <ArrowDownLeft className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <ArrowUpRight className="w-6 h-6 text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#2c3e5e] mb-1">{txn.description}</h3>
                                            <p className="text-sm text-gray-500">{txn.date} • {txn.time}</p>
                                            {txn.reference && (
                                                <p className="text-xs text-gray-400 mt-1">Ref: {txn.reference}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {txn.type === 'credit' ? '+' : '-'}₦{txn.amount.toFixed(2)}
                                        </p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${txn.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : txn.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
