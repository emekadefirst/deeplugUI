import React, { useState, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/user-service';

/**
 * SignupPage: Premium implementation following Deeplug design system.
 */
export const SignupPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        whatsapp_number: '',
    });

    const isFormValid = useMemo(() => {
        return (
            formData.username.length >= 3 &&
            formData.email.includes('@') &&
            formData.password.length >= 8 &&
            formData.whatsapp_number.length >= 10
        );
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await userService.createUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                whatsapp_number: formData.whatsapp_number,
            });

            alert('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-white grid place-items-center p-4 selection:bg-[#2c3e5e]/10 selection:text-[#2c3e5e]">
            <div className="w-full max-w-[450px] bg-white border border-zinc-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-8 transition-all duration-300">

                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
                        Create an account
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Join Deeplug and start managing your virtual connectivity
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">
                                Username
                            </label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#2c3e5e] transition-colors" />
                                <input
                                    type="text"
                                    required
                                    placeholder="johndoe"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all"
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#2c3e5e] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">
                                WhatsApp Number
                            </label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#2c3e5e] transition-colors" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="+234..."
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all"
                                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#2c3e5e] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-[#2c3e5e]/5 focus:border-[#2c3e5e] transition-all"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#2c3e5e] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!isFormValid || isLoading}
                        className="w-full bg-[#2c3e5e] text-white py-3.5 mt-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f2d42] hover:shadow-xl hover:shadow-[#2c3e5e]/20"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-zinc-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#2c3e5e] font-bold hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
