import { Shield, Smartphone, MessageCircle } from 'lucide-react';

export default function Features() {
    return (
        <section className="py-24 bg-gray-50 ring-1 ring-gray-100 overflow-hidden rounded-[4rem] mx-4 sm:mx-8 mb-20 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-[#2c3e5e] mb-4 block underline decoration-[#2c3e5e]/30 underline-offset-8">Our Services</span>
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-[#2c3e5e] mb-8">
                            Privacy-first <br />
                            connections.
                        </h2>
                    </div>
                    <div>
                        <p className="text-gray-600 text-lg leading-relaxed max-w-sm font-medium">
                            We provide the tools to stay connected globally without compromising your personal information.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
                    {/* Feature 1 */}
                    <div className="group">
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center mb-8 text-[#2c3e5e] group-hover:bg-[#2c3e5e] group-hover:text-white transition-all duration-300">
                            <Shield className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-[#2c3e5e] mb-4 tracking-tight">SIM Rental</h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                            Rent virtual numbers for SMS verification, short and high-speed eSIMs for global travel.   
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group">
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center mb-8 text-[#2c3e5e] group-hover:bg-[#2c3e5e] group-hover:text-white transition-all duration-300">
                            <Smartphone className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-[#2c3e5e] mb-4 tracking-tight">Instant eSIM</h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                            No physical SIM cards needed. Activate data plans globally in minutes via QR code activation.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group">
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center mb-8 text-[#2c3e5e] group-hover:bg-[#2c3e5e] group-hover:text-white transition-all duration-300">
                            <MessageCircle className="h-7 w-7" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-[#2c3e5e] mb-4 tracking-tight">One-Time Verification</h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                            Reliable, fast for single codes
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}