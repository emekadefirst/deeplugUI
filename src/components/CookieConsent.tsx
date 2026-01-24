import { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X } from 'lucide-react';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('deeplugg-consent');
        if (!consent) {
            // Delay showing to ensure smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (type: 'all' | 'none' | 'manage') => {
        localStorage.setItem('deeplugg-consent', type);
        setIsVisible(false);
        // Here you would typically trigger Google's adsbygoogle commands
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[480px] z-[9999] animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2c3e5e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-[#2c3e5e] rounded-2xl shadow-lg shadow-[#2c3e5e]/20">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#2c3e5e] tracking-tight">Privacy Matters</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Consent Management</p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <p className="text-gray-600 font-medium leading-relaxed mb-8 text-sm sm:text-base">
                        To provide the best experience, we (and our certified partners like <span className="text-[#2c3e5e] font-bold">Google AdSense</span>) use cookies for personalized ads, analytics, and site security. By clicking "Consent", you agree to our 2026 connectivity standards.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => handleConsent('all')}
                            className="w-full py-4 bg-[#2c3e5e] text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-[#2c3e5e]/10 uppercase tracking-widest text-xs"
                        >
                            Consent
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleConsent('none')}
                                className="py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all text-xs uppercase"
                            >
                                Do not consent
                            </button>
                            <button
                                onClick={() => handleConsent('manage')}
                                className="py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all text-xs uppercase flex items-center justify-center gap-2"
                            >
                                <Settings className="w-3.5 h-3.5" />
                                Manage
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 text-[10px] text-center text-gray-400 font-medium uppercase tracking-wider">
                        Read our <a href="/privacy" className="text-[#2c3e5e] font-bold underline">Privacy Policy</a> for more details.
                    </p>
                </div>
            </div>
        </div>
    );
};
