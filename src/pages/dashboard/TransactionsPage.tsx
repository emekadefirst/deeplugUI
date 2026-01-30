import { useEffect, useState } from 'react';
import { Receipt, Search, ArrowUpRight, ArrowDownLeft, Loader2, RefreshCw } from 'lucide-react';
import { walletService, type TransactionData } from '../../services/wallet-service';

export const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('all');

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: { type?: string } = {};
            if (filterType !== 'all') {
                params.type = filterType;
            }
            const data = await walletService.getTransactions(params);
            setTransactions(data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch transactions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filterType]);

    const filterOptions = [
        { value: 'all', label: 'All Transactions' },
        { value: 'credit', label: 'Credits' },
        { value: 'debit', label: 'Debits' },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[#2c3e5e]">Transactions</h1>
                <button
                    onClick={fetchTransactions}
                    disabled={isLoading}
                    className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters - Mobile Responsive */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col gap-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 focus:border-[#2c3e5e]"
                        />
                    </div>

                    {/* Filter Buttons - Responsive Grid */}
                    <div className="grid grid-cols-3 gap-2">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilterType(option.value)}
                                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${filterType === option.value
                                        ? 'bg-[#2c3e5e] text-white shadow-lg shadow-[#2c3e5e]/20'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* Transactions List - Mobile Responsive */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {isLoading && transactions.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No transactions yet</h3>
                        <p className="text-gray-500 text-sm">Your transaction history will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {transactions.map((txn) => (
                            <div key={txn.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                {/* Mobile Layout - Stack Vertically */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    {/* Left Section */}
                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {txn.type === 'credit' ? (
                                                <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                            ) : (
                                                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[#2c3e5e] mb-1 text-sm sm:text-base">
                                                {txn.type === 'credit' ? 'Wallet Credit' : 'Wallet Debit'}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{formatDate(txn.created_at)}</p>
                                            <p className="text-xs text-gray-400 mt-1 truncate">Ref: {txn.reference}</p>
                                        </div>
                                    </div>

                                    {/* Right Section - Amount and Status */}
                                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pl-13 sm:pl-0">
                                        <p className={`text-lg sm:text-xl font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {txn.type === 'credit' ? '+' : '-'}₦{Number(txn.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${txn.status === 'completed'
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
