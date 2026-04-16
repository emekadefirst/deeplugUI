import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Home } from 'lucide-react';
import { userService } from '../../services/user-service';
import { SEO } from '../../components/SEO';

/**
 * AccountVerificationPage: Handles the transition of email verification.
 */
export const AccountVerificationPage = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const hasAttempted = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        if (hasAttempted.current) return;
        hasAttempted.current = true;

        const verify = async () => {
            try {
                await userService.verifyEmail(token);
                setStatus('success');
            } catch (err: any) {
                console.error(err);
                setStatus('error');
                setMessage(err.response?.data?.detail || 'Verification failed. The link might be expired or invalid.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen w-full bg-white grid place-items-center p-4 selection:bg-[#2c3e5e]/10 selection:text-[#2c3e5e]">
            <SEO
                title="Account Verification"
                description="Verify your account to access deePlugg services."
            />

            <div className="w-full max-w-[450px] bg-white border border-zinc-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 space-y-10 text-center animate-in fade-in zoom-in duration-500">

                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-6 py-10">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                            <Loader2 className="w-10 h-10 text-[#2c3e5e] animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-[#2c3e5e]">Verifying account...</h2>
                            <p className="text-sm text-zinc-500">Please wait while we validate your link.</p>
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 animate-in zoom-in-50 duration-500">
                                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
                                    Verification Successful!
                                    access.                            </h1>
                                <p className="text-sm text-zinc-500 leading-relaxed max-w-[300px] mx-auto">
                                    Your account has been successfully verified. You can now access all features of deePlugg.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link
                                to="/login"
                                className="w-full bg-[#2c3e5e] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-[#1f2d42] hover:shadow-xl hover:shadow-[#2c3e5e]/20"
                            >
                                Continue to Sign In
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border border-red-100 animate-in zoom-in-50 duration-500">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
                                    Verification Failed.
                                </h1>
                                <p className="text-sm text-zinc-500 leading-relaxed max-w-[300px] mx-auto">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                to="/login"
                                className="w-full bg-[#2c3e5e] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98] hover:opacity-90 shadow-md shadow-[#2c3e5e]/20"
                            >
                                Return to Sign In
                            </Link>
                            <Link
                                to="/"
                                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors py-2"
                            >
                                <Home className="w-3 h-3" />
                                Back to Homepage
                            </Link>
                        </div>
                    </>
                )}

                <div className="pt-2">
                    <p className="text-[10px] text-zinc-400 font-bold tracking-[0.15em] flex items-center justify-center gap-2 uppercase">
                        deePlugg Identity
                    </p>
                </div>
            </div>
        </div>
    );
};
