import { useEffect, useState } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, RefreshCw, X, Loader2 } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useWalletStore } from '../../stores/wallet-store';
import { useProfileStore } from '../../stores/profile-store';
import { useToastStore } from '../../stores/toast-store';
import { useNavigate } from 'react-router-dom';

import { walletService, type TransactionData } from '../../services/wallet-service';
import { SEO } from '../../components/SEO';

export const WalletPage = () => {
    const { wallet, isLoading, error, fetchWallet, refresh } = useWalletStore();
    const { profile, fetchProfile } = useProfileStore();
    const { addToast } = useToastStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalError, setModalError] = useState('');
    const [recentTxns, setRecentTxns] = useState<TransactionData[]>([]);
    const [isLoadingTxns, setIsLoadingTxns] = useState(false);
    const navigate = useNavigate();

    const loadRecentTxns = async () => {
        setIsLoadingTxns(true);
        try {
            const res = await walletService.getTransactions({ page: 1, page_size: 5 });
            if (res.data) {
                setRecentTxns(res.data.slice(0, 5));
            }
        } catch (e) {
            console.error('Failed to load recent txns', e);
        } finally {
            setIsLoadingTxns(false);
        }
    };

    useEffect(() => {
        fetchWallet();
        fetchProfile();
        loadRecentTxns();
    }, [fetchWallet, fetchProfile]);

    const config = {
        email: profile?.email || "",
        amount: Math.round(Number(amount) * 100), // Amount is in Kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUB_KEY || "",
    };

    // The hook returns a function to initialize the payment
    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference: any) => {
        console.log("Payment successful:", reference);
        setIsProcessing(true);

        try {
            // Transform Paystack success response to our backend payload
            // Paystack amount is in Kobo, backend expects value (likely Naira or standard unit) based on "amount: 0" in prompt
            // But usually backend expects the funded amount.
            // Using the originally entered amount (which is in Naira)

            const payload = {
                status: "pending", // ALWAYS "pending", ignoring external provider status
                provider: "paystack",
                payment_ref_id: reference.reference,
                amount: Number(amount)
            };

            await walletService.fundWallet(payload);

            closeModal();
            refresh(); // Refresh wallet balance
            addToast("Payment recorded successfully! Wallet update may take a moment.", 'success');
        } catch (err: any) {
            console.error("Backend verification failed:", err);
            const errorMsg = err.response?.data?.message || "Payment successful, but failed to verify with server. Please contact support.";
            setModalError(errorMsg);
            addToast(errorMsg, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const onClose = () => {
        console.log("Payment closed");
        setIsProcessing(false);
    };

    const handleFundWallet = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setModalError('Please enter a valid amount');
            return;
        }

        if (!profile?.email) {
            setModalError('User email not found. Please try refreshing the page.');
            return;
        }

        // Check if key is correctly configured (client-side check for dev help)
        if (config.publicKey.startsWith('sk_')) {
            console.error('Security Warning: You are using a Secret Key (sk_) in the frontend. Please use your Public Key (pk_) for Paystack Inline.');
            setModalError('Configuration Error: Invalid Paystack Key type.');
            return;
        }

        setIsProcessing(true);
        setModalError('');

        try {
            initializePayment({ onSuccess, onClose });
        } catch (err) {
            console.error("Paystack init error:", err);
            setModalError('Failed to load payment modal.');
            setIsProcessing(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAmount('');
        setModalError('');
        setIsProcessing(false);
    };

    const formatTxnDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatBalance = (balance: string) => {
        const num = parseFloat(balance);
        return num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="space-y-6">
            <SEO title="Wallet" description="Manage your funds and view transaction history." />
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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#2c3e5e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1f2d42] transition-all"
                    >
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



            {/* Recent Transactions */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[#2c3e5e]">Recent Transactions</h3>
                    <button 
                        onClick={() => navigate('/dashboard/transactions')}
                        className="text-sm font-semibold text-[#2c3e5e] hover:underline hover:text-[#1a263b] transition-all"
                    >
                        View More
                    </button>
                </div>
                
                <div className="space-y-3">
                    {isLoadingTxns ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : recentTxns.length === 0 ? (
                        <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No transactions yet</p>
                            <p className="text-xs text-gray-400 mt-1">Fund your wallet to make transactions</p>
                        </div>
                    ) : (
                        recentTxns.map((txn) => (
                            <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {txn.type === 'credit' ? (
                                            <ArrowDownLeft className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <ArrowUpRight className="w-6 h-6 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#2c3e5e]">{txn.type === 'credit' ? 'Wallet Credit' : 'Wallet Debit'}</p>
                                        <p className="text-xs text-gray-500 font-medium">{formatTxnDate(txn.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <p className={`font-bold text-lg ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {txn.type === 'credit' ? '+' : '-'}₦{Number(txn.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                    </p>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg border ${
                                        txn.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                                        txn.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                        {txn.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Fund Wallet Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#2c3e5e]">Add Funds</h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {modalError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleFundWallet}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount (₦)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₦</span>
                                        <input
                                            type="number"
                                            id="amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 focus:border-[#2c3e5e] transition-all"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Enter the amount you wish to add to your wallet.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing || !amount}
                                    className="w-full py-3 bg-[#2c3e5e] text-white rounded-xl font-semibold hover:bg-[#1f2d42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Initializing...
                                        </>
                                    ) : (
                                        'Proceed to Payment'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
