
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/SEO';

/**
 * VerifyNotificationPage: Informs users to check their mailbox after signup.
 */
export const VerifyNotificationPage = () => {
    return (
        <div className="min-h-screen w-full bg-zinc-50 relative overflow-hidden grid place-items-center p-4 selection:bg-[#2c3e5e]/10 selection:text-[#2c3e5e]">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2c3e5e]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1db5cc]/5 rounded-full blur-[120px]" />
            </div>

            <SEO
                title="Verify Your Email"
                description="Please check your mailbox to verify your account."
            />
            <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl border border-zinc-200/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-10 sm:p-12 space-y-10 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-100/50 animate-bounce">
                            <Mail className="w-10 h-10 text-emerald-600" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-zinc-100 shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold tracking-tight text-[#2c3e5e]">
                            Verification Sent.
                        </h1>
                        <p className="text-sm text-zinc-500 max-w-[280px] mx-auto leading-relaxed font-medium">
                            A secure activation link has been dispatched to your email address. Please follow the instructions to continue.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-5 bg-zinc-50/50 border border-zinc-200/50 rounded-2xl text-[11px] text-zinc-600 font-semibold leading-relaxed text-center">
                        <span className="text-zinc-400 block mb-1 uppercase tracking-wider">Security Notice</span>
                        If the email hasn't appeared within 2 minutes, check your Junk folder or ensure the provided address is correct.
                    </div>

                    <Link 
                        to="/login"
                        className="w-full bg-[#2c3e5e] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-[#1f2d42] hover:shadow-2xl hover:shadow-[#2c3e5e]/20"
                    >
                        Sign In Now
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="pt-6 border-t border-zinc-100/50">
                    <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] flex items-center justify-center gap-2 uppercase">
                        deePlugg Identity Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};
