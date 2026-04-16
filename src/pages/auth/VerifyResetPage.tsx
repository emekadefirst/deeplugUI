import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Loader2, ChevronLeft, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/user-service';
import { useToastStore } from '../../stores/toast-store';
import { SEO } from '../../components/SEO';

export const VerifyResetPage = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { addToast } = useToastStore();

    useEffect(() => {
        const token = sessionStorage.getItem('reset_token');
        if (!token) {
            addToast('Reset session expired. Please start again.', 'error');
            navigate('/auth/forgot-password');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = sessionStorage.getItem('reset_token');
        
        if (!token) {
            setError('Session expired. Please request a new code.');
            setIsLoading(false);
            return;
        }

        try {
            await userService.verifyResetRequest({ code, token });
            addToast('Code verified! Set your new password.', 'success');
            navigate('/auth/reset-password');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Invalid or expired code.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-zinc-50 relative overflow-hidden grid place-items-center p-4 selection:bg-[#2c3e5e]/10 selection:text-[#2c3e5e]">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2c3e5e]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1db5cc]/5 rounded-full blur-[120px]" />
            </div>

            <SEO title="Verify Code" description="Enter the verification code sent to your email." />
            
            <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-10 sm:p-12 space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="space-y-3 text-center">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200/50 mx-auto mb-6">
                        <ShieldCheck className="w-8 h-8 text-[#2c3e5e]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
                        Check your email
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed px-4">
                        We've sent a unique verification code to your email address. Enter it below to continue.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] text-red-600 font-bold uppercase tracking-wider text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 ml-1">
                            Verification Code
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter code"
                                className="w-full px-4 py-4 bg-zinc-50/50 border border-zinc-200 rounded-2xl text-center text-2xl font-bold tracking-[0.25em] outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all text-[#2c3e5e] placeholder:text-zinc-300 placeholder:tracking-normal placeholder:text-sm"
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading || !code}
                        className="w-full bg-[#2c3e5e] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f2d42] hover:shadow-2xl hover:shadow-[#2c3e5e]/20"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Verify Code
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="text-center">
                        <button 
                            onClick={() => navigate('/auth/forgot-password')}
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#1db5cc] hover:underline underline-offset-4"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Resend Code
                        </button>
                    </div>

                    <div className="pt-2 text-center">
                        <Link 
                            to="/auth/forgot-password"
                            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#2c3e5e] transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Change Email
                        </Link>
                    </div>
                </div>

                <div className="pt-10 border-t border-zinc-100/50">
                    <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] flex items-center justify-center gap-2 uppercase">
                        deePlugg Identity Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};
