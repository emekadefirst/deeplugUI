import { ArrowRight, Phone, MessageSquare, Wifi } from 'lucide-react';

export default function Hero() {
    return (
        <main className="pt-32 pb-20 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2c3e5e]/10 text-[#2c3e5e] text-xs font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2c3e5e] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2c3e5e]"></span>
                            </span>
                            Global Virtual Connectivity
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] mb-8 text-[#2c3e5e] tracking-tight">
                            Rent virtual <br />
                            numbers & eSIMs <br />
                            instantly.
                        </h1>
                        <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg font-medium">
                            Get instant access to virtual numbers for SMS verification, short codes for marketing, and high-speed eSIMs for global travel.
                        </p>

                        <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-2xl p-2 max-w-lg shadow-sm focus-within:border-[#2c3e5e]/30 transition-all">
                            <input
                                type="text"
                                placeholder="Enter your WhatsApp Number "
                                className="flex-1 bg-transparent px-5 py-3 text-xs md:text-sm font-semibold focus:outline-none placeholder:text-gray-400"
                            />
                            <button className="bg-[#2c3e5e] text-white text-xs md:text-sm font-black px-8 py-4 rounded-xl hover:bg-[#1f2d42] transition-all flex items-center gap-2 shadow-lg shadow-[#2c3e5e]/20">
                               Try on WhatsApp
                                <ArrowRight className="h-4 w-4" strokeWidth={3} />
                            </button>
                        </div>
                        <div className="mt-6 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>✓ No ID required</span>
                            <span>✓ Instant setup</span>
                            <span>✓ 150+ countries</span>
                        </div>
                    </div>

                    {/* Right Illustration - Virtual Number/SMS Dashboard */}
                    <div className="relative">
                        <div className="relative z-10 p-4 lg:p-0">
                            {/* Mockup Dashboard */}
                            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto border border-gray-100 relative overflow-hidden group">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#2c3e5e]/10 rounded-2xl flex items-center justify-center text-[#2c3e5e]">
                                            <Phone className="h-6 w-6" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-[#2c3e5e] uppercase">Active Line</div>
                                            <div className="text-xs text-gray-400 font-bold">+1 (555) 000-8888</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8 p-6 bg-[#2c3e5e] rounded-2xl text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="text-[10px] text-white/50 font-black uppercase mb-1">Incoming SMS</div>
                                        <div className="text-2xl font-black mb-2 tracking-tight">Your code is 882-102</div>
                                        <div className="text-xs text-white/70 font-bold italic">Sent via DeepPlug Verification</div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 font-bold text-sm text-[#2c3e5e]">
                                            <MessageSquare className="h-5 w-5" strokeWidth={2.5} />
                                            <span>Short Code SMS</span>
                                        </div>
                                        <div className="text-xs font-black text-[#2c3e5e]">ENABLED</div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 group-hover:border-[#2c3e5e]/20 transition-colors">
                                        <div className="flex items-center gap-3 font-bold text-sm text-[#2c3e5e]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                            </svg>
                                            <span>Social Verification</span>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-2 border-[#2c3e5e] flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-[#2c3e5e] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-8 bg-[#2c3e5e] text-white font-black py-4 rounded-2xl hover:bg-[#1f2d42] transition-all shadow-lg shadow-[#2c3e5e]/20 uppercase tracking-widest text-xs">
                                    Renew Subscription
                                </button>

                                {/* Overlaid SIM/eSIM Card */}
                                <div className="absolute top-1/4 -right-12 w-64 aspect-[1.6] bg-[#2c3e5e] rounded-2xl shadow-2xl p-8 text-white transform rotate-6 group-hover:rotate-0 transition-transform duration-500 border border-white/10">
                                    <div className="flex flex-col h-full justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                                                <Wifi className="h-3 w-3" />
                                                Global eSIM
                                            </div>
                                            <div className="w-8 h-6 bg-yellow-400 rounded-sm opacity-60"></div>
                                        </div>
                                        <div>
                                            <div className="text-xl font-black tracking-tight mb-1 italic">DEEPLUG CONNECT</div>
                                            <div className="flex justify-between items-center text-[10px] font-extrabold text-white/80">
                                                <span>5G HIGH SPEED</span>
                                                <span>UNLIMITED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2c3e5e]/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#2c3e5e]/5 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}