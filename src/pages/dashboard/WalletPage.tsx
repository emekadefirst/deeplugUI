import { useEffect } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, RefreshCw } from 'lucide-react';
import { useWalletStore } from '../../stores/wallet-store';

export const WalletPage = () => {
    const { wallet, isLoading, error, fetchWallet, refresh } = useWalletStore();

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet]);

    const transactions: any[] = [
        // Example data - will be populated from API
    ];

    const formatBalance = (balance: string) => {
        const num = parseFloat(balance);
        return num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#2c3e5e]">Wallet</h1>
                <div className="flex gap-2">
                    <button
                        onClick={refresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 bg-[#2c3e5e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1f2d42] transition-all">
                        <Plus className="w-5 h-5" />
                        Add Funds
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#2c3e5e] to-[#1f2d42] rounded-2xl p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                    <WalletIcon className="w-6 h-6" />
                    <span className="text-sm opacity-90">Available Balance</span>
                </div>

                {isLoading && !wallet ? (
                    <div className="animate-pulse">
                        <div className="h-10 bg-white/20 rounded w-48 mb-6"></div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold mb-2">
                            ₦{wallet ? formatBalance(wallet.balance) : '0.00'}
                        </h2>
                        {wallet && (
                            <p className="text-sm opacity-75 mb-6">{wallet.wallet_tag}</p>
                        )}
                    </>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-xs opacity-75 mb-1">Total Spent</p>
                        <p className="text-xl font-bold">₦0.00</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-xs opacity-75 mb-1">Total Added</p>
                        <p className="text-xl font-bold">₦0.00</p>
                    </div>
                </div>
            </div>

   \

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#2c3e5e] mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No transactions yet</p>
                        </div>
                    ) : (
                        transactions.map((txn: any) => (
                            <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        {txn.type === 'credit' ? (
                                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#2c3e5e]">{txn.description}</p>
                                        <p className="text-xs text-gray-500">{txn.date}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {txn.type === 'credit' ? '+' : '-'}₦{txn.amount.toFixed(2)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
