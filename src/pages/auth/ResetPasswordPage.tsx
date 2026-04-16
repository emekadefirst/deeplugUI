import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowRight, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user-service';
import { useToastStore } from '../../stores/toast-store';
import { SEO } from '../../components/SEO';

export const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
    }, [navigate, addToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const token = sessionStorage.getItem('reset_token');
        
        if (!token) {
            setError('Session expired. Please request a new code.');
            setIsLoading(false);
            return;
        }

        try {
            await userService.resetPassword({ token, newPassword });
            sessionStorage.removeItem('reset_token');
            addToast('Password reset successful! Please sign in.', 'success');
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
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

            <SEO title="Set New Password" description="Create a new secure password for your account." />
            
            <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-10 sm:p-12 space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="space-y-3 text-center">
                    <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200/50 mx-auto mb-6">
                        <KeyRound className="w-8 h-8 text-[#2c3e5e]" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
                        Set New Password
                    </h1>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed px-4">
                        Please choose a strong password that you haven't used before.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] text-red-600 font-bold uppercase tracking-wider text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 ml-1">
                                New Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#2c3e5e] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-4 bg-zinc-50/50 border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all font-medium text-[#2c3e5e]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#2c3e5e] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 ml-1">
                                Confirm New Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#2c3e5e] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-4 bg-zinc-50/50 border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all font-medium text-[#2c3e5e]"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={isLoading || !newPassword || !confirmPassword}
                        className="w-full bg-[#2c3e5e] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f2d42] hover:shadow-2xl hover:shadow-[#2c3e5e]/20 mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Update Password
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-8 border-t border-zinc-100/50">
                    <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] flex items-center justify-center gap-2 uppercase">
                        deePlugg Identity Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};
