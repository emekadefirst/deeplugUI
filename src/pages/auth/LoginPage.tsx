import React, { useState, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userService } from '../../services/user-service';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Derived state for button validation
  const isFormValid = useMemo(() => {
    return formData.email.includes('@') && formData.password.length >= 6;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await userService.login({
        email: formData.email,
        password: formData.password
      });

      // Status 201 success; tokens are in cookies
      console.log('Login successful');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white grid place-items-center p-4 selection:bg-[#2c3e5e]/10 selection:text-[#2c3e5e]">
      {/* Container with Glass Effect from styles.md */}
      <div className="w-full max-w-[400px] bg-white border border-zinc-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-8 transition-all duration-300">

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Email Input */}
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

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#2c3e5e] hover:underline underline-offset-4"
                >
                  Forgot password?
                </button>
              </div>
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

          {/* Submit Button - Interaction pattern from styles.md */}
          <button
            disabled={!isFormValid || isLoading}
            className="w-full bg-[#2c3e5e] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f2d42] hover:shadow-xl hover:shadow-[#2c3e5e]/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer / Social Auth */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white  text-zinc-500">Or continue with</span>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-[#2c3e5e] font-bold hover:underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};