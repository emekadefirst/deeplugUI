import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/user-service';
import { useToastStore } from '../../stores/toast-store';
import { SEO } from '../../components/SEO';

export const RequestResetPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { addToast } = useToastStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await userService.requestResetPassword(email);
            sessionStorage.setItem('reset_token', response.token);
            addToast('Reset code sent to your email!', 'success');
            navigate('/auth/verify-reset');
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 400) {
                setError('Account not found with this email address.');
            } else {
                setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-zinc-50 relative overflow-hidden grid place-items-center p-4 selection:bg-[#2c3e5e]/10 selection:text-[#2c3e5e]">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2c3e5e]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#ee6c4d]/5 rounded-full blur-[120px]" />
            </div>

            <SEO title="Reset Password" description="Request a password reset for your deePlugg account." />
            
            <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-10 sm:p-12 space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="space-y-3 text-center">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200/50 mx-auto mb-6">
                        <Mail className="w-8 h-8 text-[#2c3e5e]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
                        Forgot Password?
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed px-4">
                        Enter your email address and we'll send you a code to reset your password.
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
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#2c3e5e] transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-11 pr-4 py-4 bg-zinc-50/50 border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all font-medium text-[#2c3e5e] placeholder:text-zinc-400"
                            />
                        </div>
                    </div>

                    <button
                        disabled={isLoading || !email}
                        className="w-full bg-[#2c3e5e] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f2d42] hover:shadow-2xl hover:shadow-[#2c3e5e]/20"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Send Reset Code
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-2 text-center">
                    <Link 
                        to="/login"
                        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#2c3e5e] transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
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
