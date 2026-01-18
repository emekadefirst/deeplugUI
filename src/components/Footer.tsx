import { Plug } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="py-16 sm:py-24 bg-gradient-to-t from-[#1a1a2e] via-[#2c3e5e] to-[#3d5a80] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 sm:mb-10 shadow-xl border border-white/20">
                    <Plug className="h-10 w-10 sm:h-12 sm:w-12 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-8 tracking-tight">Join the deePlugg network today.</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto bg-white text-[#2c3e5e] font-black px-8 sm:px-12 py-4 sm:py-5 rounded-2xl hover:bg-white/90 transition-all shadow-2xl shadow-black/30 text-base sm:text-lg uppercase tracking-widest leading-none">
                        Get Started
                    </button>
                    <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 font-extrabold px-8 sm:px-12 py-4 sm:py-5 rounded-2xl hover:bg-white/20 transition-all text-base sm:text-lg leading-none">
                        View Pricing
                    </button>
                </div>
                <div className="mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 text-white/60 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-6 sm:gap-10">
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Status</a>
                    </div>
                    <span className="text-center sm:text-left">© 2024 deePlugg. Built for privacy.</span>
                </div>
            </div>
        </footer>
    );
}