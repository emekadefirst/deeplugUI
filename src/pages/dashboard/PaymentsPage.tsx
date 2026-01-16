import { useEffect, useState } from 'react';
import { History, Search, RefreshCw, Loader2, ArrowUpRight } from 'lucide-react';
import { walletService, type PaymentData } from '../../services/wallet-service';

export const PaymentsPage = () => {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchPayments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: { status?: string } = {};
            if (filterStatus !== 'all') {
                params.status = filterStatus;
            }
            const data = await walletService.getPayments(params);
            setPayments(data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch payment history');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [filterStatus]);

    const filterOptions = [
        { value: 'all', label: 'All Payments' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#2c3e5e]">Payment History</h1>
                <button
                    onClick={fetchPayments}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search payments..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 focus:border-[#2c3e5e]"
                        />
                    </div>
                    <div className="flex gap-2">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilterStatus(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === option.value
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

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* Payments List */}
            <div className="bg-white rounded-2xl border border-gray-200">
                {isLoading && payments.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-16">
                        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No payments yet</h3>
                        <p className="text-gray-500">Your payment history will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <ArrowUpRight className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#2c3e5e] mb-1">
                                                Fund Wallet via {payment.provider}
                                            </h3>
                                            <p className="text-sm text-gray-500">{formatDate(payment.created_at)}</p>
                                            <p className="text-xs text-gray-400 mt-1">Ref: {payment.payment_ref_id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-[#2c3e5e]">
                                            ₦{Number(payment.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${payment.status === 'success' || payment.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : payment.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {payment.status}
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
