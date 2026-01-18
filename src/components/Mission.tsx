export default function Mission() {
    return (
        <section className="py-16 sm:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative order-2 lg:order-1">
                        <div className="bg-[#2c3e5e] rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-16 min-h-[400px] lg:aspect-square flex flex-col justify-center text-white relative z-10 overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-none mb-10 tracking-tighter uppercase italic text-white/90">
                                    Digital <br />
                                    Freedom <br />
                                    Secured.
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-12">
                                    <div className="p-6 bg-white/5 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/10">
                                        <div className="text-4xl sm:text-5xl font-black text-white mb-2 line-height-1">01</div>
                                        <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/90 mb-2">Virtualize</div>
                                        <div className="text-[10px] sm:text-xs text-white/60 leading-relaxed font-medium">Move your mobile identity to the cloud instantly.</div>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/10">
                                        <div className="text-4xl sm:text-5xl font-black text-white mb-2 line-height-1">02</div>
                                        <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/90 mb-2">Connect</div>
                                        <div className="text-[10px] sm:text-xs text-white/60 leading-relaxed font-medium">Access over 500 mobile carriers globally.</div>
                                    </div>
                                </div>
                            </div>
                            {/* Abstract background shapes */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="text-center lg:text-left">
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-[#2c3e5e] mb-6 block">Our Impact</span>
                            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-[#2c3e5e] mb-8 lg:mb-10 tracking-tighter">
                                Leading the <br />
                                virtual wave.
                            </h2>
                            <p className="text-gray-600 mb-10 lg:mb-12 max-w-md mx-auto lg:mx-0 font-medium text-base sm:text-lg">
                                deePlugg empowers users  to stay anonymous, safe and connected.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
