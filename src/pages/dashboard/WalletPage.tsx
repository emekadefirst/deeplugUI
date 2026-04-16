import { useEffect, useState } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, RefreshCw, X, Loader2 } from 'lucide-react';
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
    const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalError, setModalError] = useState('');
    const [recentTxns, setRecentTxns] = useState<TransactionData[]>([]);
    const [isLoadingTxns, setIsLoadingTxns] = useState(false);
    const navigate = useNavigate();

    const DOLLAR_RATE = 1500; // Hardcoded as per example

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

    const handleFundWallet = async (e: React.FormEvent) => {
        e.preventDefault();

        const numAmount = Number(amount);

        if (!amount || isNaN(numAmount) || numAmount <= 0) {
            setModalError('Please enter a valid amount');
            return;
        }

        if (currency === 'USD' && numAmount < 5) {
            setModalError('Minimum funding for USD is $5');
            return;
        }

        if (!profile?.email) {
            setModalError('User email not found. Please try refreshing the page.');
            return;
        }

        setIsProcessing(true);
        setModalError('');

        try {
            const payload: any = {
                amount: numAmount,
                currency: currency,
            };

            if (currency === 'USD') {
                payload.dollar_price = DOLLAR_RATE;
            }

            const response = await walletService.fundWallet(payload);
            
            // Handle different potential response structures
            // If response is just the URL string
            if (typeof response === 'string' && response.startsWith('http')) {
                window.location.href = response;
                return;
            }
            
            // If response is an object with a link property
            const redirectLink = response?.data?.link || response?.link;
            if (redirectLink && typeof redirectLink === 'string') {
                window.location.href = redirectLink;
                return;
            }

            addToast("Funding request initiated successfully!", 'success');
            closeModal();
            refresh();
        } catch (err: any) {
            console.error("Funding failed:", err);
            const errorMsg = err.response?.data?.message || "Failed to initiate payment. Please try again later.";
            setModalError(errorMsg);
            addToast(errorMsg, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAmount('');
        setCurrency('NGN');
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
                        className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#2c3e5e] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1f2d42] transition-all active:scale-95 shadow-md shadow-[#2c3e5e]/10"
                    >
                        <Plus className="w-5 h-5" />
                        Add Funds
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200/50 rounded-xl text-sm text-red-600 animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {/* Balance Card */}
            <div className="bg-[#2c3e5e] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <WalletIcon className="w-6 h-6 text-zinc-300" />
                        <span className="text-sm font-medium text-zinc-300">Available Balance</span>
                    </div>

                    {isLoading && !wallet ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-12 bg-white/10 rounded-lg w-48"></div>
                            <div className="h-4 bg-white/10 rounded w-32"></div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-5xl font-bold tracking-tight mb-2">
                                ₦{wallet ? formatBalance(wallet.balance) : '0.00'}
                            </h2>
                            {wallet && (
                                <p className="text-sm font-medium text-zinc-400 tracking-wide uppercase">{wallet.wallet_tag}</p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-3xl border border-zinc-200/50 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#2c3e5e]">Recent Activity</h3>
                    <button 
                        onClick={() => navigate('/dashboard/transactions')}
                        className="text-sm font-semibold text-[#2c3e5e] hover:underline px-4 py-2 hover:bg-zinc-50 rounded-lg transition-all"
                    >
                        View Timeline
                    </button>
                </div>
                
                <div className="space-y-4">
                    {isLoadingTxns ? (
                        <div className="flex flex-col justify-center items-center py-16 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-[#2c3e5e] opacity-40" />
                            <p className="text-sm text-zinc-400 font-medium">Fetching history...</p>
                        </div>
                    ) : recentTxns.length === 0 ? (
                        <div className="text-center py-16 px-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
                            <TrendingUp className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <p className="text-zinc-600 font-semibold text-lg">Empty Ledger</p>
                            <p className="text-sm text-zinc-400 mt-1 max-w-xs mx-auto">Your transaction history will appear here once you start using your wallet.</p>
                        </div>
                    ) : (
                        recentTxns.map((txn) => (
                            <div key={txn.id} className="group flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-zinc-200/50">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                        {txn.type === 'credit' ? (
                                            <ArrowDownLeft className="w-6 h-6" />
                                        ) : (
                                            <ArrowUpRight className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-semibold text-zinc-800">{txn.type === 'credit' ? 'Wallet Funding' : 'Service Payment'}</p>
                                        <p className="text-xs text-zinc-400 font-medium">{formatTxnDate(txn.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <p className={`font-bold text-lg tracking-tight ${txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {txn.type === 'credit' ? '+' : '-'}₦{Number(txn.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                                    </p>
                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg tracking-widest ${
                                        txn.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                                        txn.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-200/50">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-[#2c3e5e]">Add Funds</h3>
                                <p className="text-xs text-zinc-500">Top up your balance to maintain services.</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {modalError && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200/50 rounded-xl text-sm text-red-700 font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
                                <X className="w-4 h-4" />
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleFundWallet} className="space-y-6">
                            <div className="space-y-4">
                                {/* Currency Selection */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setCurrency('NGN'); setAmount(''); setModalError(''); }}
                                        className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${currency === 'NGN' ? 'bg-[#2c3e5e] text-white border-[#2c3e5e] shadow-md shadow-[#2c3e5e]/10' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'}`}
                                    >
                                        Naira (₦)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setCurrency('USD'); setAmount(''); setModalError(''); }}
                                        className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${currency === 'USD' ? 'bg-[#2c3e5e] text-white border-[#2c3e5e] shadow-md shadow-[#2c3e5e]/10' : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'}`}
                                    >
                                        Dollar ($)
                                    </button>
                                </div>

                                <div>
                                    <label htmlFor="amount" className="block text-sm font-semibold text-zinc-700 mb-2">
                                        Funding Amount {currency === 'USD' ? '($)' : '(₦)'}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">
                                            {currency === 'USD' ? '$' : '₦'}
                                        </span>
                                        <input
                                            type="number"
                                            id="amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-10 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all text-xl font-bold text-[#2c3e5e]"
                                            placeholder="0.00"
                                            min={currency === 'USD' ? "5" : "0"}
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    
                                    {currency === 'USD' && amount && !isNaN(Number(amount)) && (
                                        <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2">
                                            <div className="flex justify-between text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                                <span>Exchange Rate</span>
                                                <span>Total Payable</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-sm font-bold text-zinc-700">1* {DOLLAR_RATE.toLocaleString()}</p>
                                                <p className="text-lg font-bold text-[#2c3e5e]">₦{(Number(amount) * DOLLAR_RATE).toLocaleString()}</p>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 italic mt-2 border-t border-zinc-200 pt-2">
                                                USD funding has a minimum requirement of $5.
                                            </p>
                                        </div>
                                    )}

                                    {currency === 'NGN' && (
                                        <p className="mt-3 text-xs text-zinc-400 font-medium">
                                            Minimum funding amount is ₦100.
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing || !amount}
                                    className="w-full py-4 bg-[#2c3e5e] text-white rounded-2xl font-bold text-lg hover:bg-[#1f2d42] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-[#2c3e5e]/20 active:scale-[0.98] mt-4"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        `Proceed to Payment`
                                    )}
                                </button>
                                
                                <p className="text-[10px] text-center text-zinc-400 font-medium px-4">
                                    Secure payments processed by Paystack. Your funds are deposited instantly upon successful verification.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
