import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
// import { ArrowUpRight, Smartphone, MessageSquare, Zap } from 'lucide-react';
import heroImg1 from '../assets/image/img1.png';
import heroImg2 from '../assets/image/about2.jpg';
import { Shield, Smartphone, MessageCircle } from 'lucide-react';

export default function Hero() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [heroImg1, heroImg2];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Sliding Hero Section */}
            <section className="relative h-screen min-h-[600px] overflow-hidden bg-[#2c3e5e]">
                {/* Background Images Slider */}
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-80' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#2c3e5e]/40 mix-blend-multiply" />
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ee6c4d] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ee6c4d]"></span>
                            </span>
                            Live Global Network
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
                            Get Virtual Numbers, for Rent<br />
                            and SMS Verification
                            <span className="block mt-2 text-2xl sm:text-4xl lg:text-5xl text-white/90">
                                and all digital assets
                            </span>
                        </h1>

                        <p className="text-white/80 text-lg sm:text-2xl font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                            Experience seamless connectivity. Instant eSIMs, private number rentals, and secure SMS verification for 150+ countries.
                        </p>

                        <div className="pt-4">
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 bg-[#ee6c4d] text-white font-black text-lg px-8 py-4 rounded-xl hover:bg-[#e65a3d] transition-all duration-300 shadow-lg hover:shadow-[#ee6c4d]/30 hover:-translate-y-1"
                            >
                                Join Now
                                <ArrowUpRight className="h-5 w-5" strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Gradient Blob */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
            </section>

            {/* Service Cards Section */}
            <section className="relative z-30 -mt-20 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[4rem] bg-gray-50 ring-1 ring-gray-100 shadow-2xl p-8 sm:p-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 lg:mb-24">
                        <div className="text-center lg:text-left">
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#2c3e5e] mb-4 block underline decoration-[#2c3e5e]/30 underline-offset-8">Our Services</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-[#2c3e5e] mb-6 lg:mb-8">
                                Privacy-first <br className="hidden sm:block" />
                                connections.
                            </h2>
                        </div>
                        <div className="text-center lg:text-left">
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm font-medium mx-auto lg:mx-0">
                                We provide the tools to stay connected globally without compromising your personal information.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
                        {/* Feature 1 */}
                        <div className="group text-center lg:text-left">
                            <div className="w-16 h-16 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center mb-6 lg:mb-8 text-[#2c3e5e] group-hover:bg-[#2c3e5e] group-hover:text-white transition-all duration-300 mx-auto lg:mx-0">
                                <Shield className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#2c3e5e] mb-4 tracking-tight">SIM Rental</h3>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                Rent virtual numbers for SMS verification, short and high-speed eSIMs for global travel.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group text-center lg:text-left">
                            <div className="w-16 h-16 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center mb-6 lg:mb-8 text-[#2c3e5e] group-hover:bg-[#2c3e5e] group-hover:text-white transition-all duration-300 mx-auto lg:mx-0">
                                <Smartphone className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#2c3e5e] mb-4 tracking-tight">Instant eSIM</h3>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                No physical SIM cards needed. Activate data plans globally in minutes via QR code activation.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group text-center lg:text-left sm:col-span-2 lg:col-span-1">
                            <div className="w-16 h-16 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center mb-6 lg:mb-8 text-[#2c3e5e] group-hover:bg-[#2c3e5e] group-hover:text-white transition-all duration-300 mx-auto lg:mx-0">
                                <MessageCircle className="h-7 w-7" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-[#2c3e5e] mb-4 tracking-tight">One-Time Verification</h3>
                            <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                Reliable, fast for single codes and instant verification across all platforms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
