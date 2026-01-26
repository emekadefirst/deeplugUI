import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Cpu, MessageSquare, Key } from 'lucide-react';
import aboutImg1 from '../assets/image/about1.png';
import aboutImg2 from '../assets/image/about2.jpg';
import AdSense from '../components/AdSense';

export const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-[#2c3e5e] selection:bg-[#2c3e5e]/10">
            <SEO
                title="About Deeplugg: Premium eSIM, SMS Verification & Rental Services"
                description="Deeplugg provides high-performance eSIM solutions, secure SMS verification, and flexible mobile rentals. Experience digital freedom with our enterprise-grade infrastructure."
            />
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-[#2c3e5e]">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.3em] text-white/70 uppercase border border-white/20 rounded-full backdrop-blur-sm">
                        Our Story
                    </span>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                        Your Global <br />
                        <span className="text-white/60 italic font-medium tracking-normal">Connectivity Hub.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/80 font-medium leading-relaxed">
                        Deeplugg is the leading infrastructure for <strong>eSIM technology</strong>, <strong>SMS verification</strong>, and <strong>mobile rentals</strong>. We empower users and businesses to stay connected, secure, and anonymous across 500+ global carriers.
                    </p>
                </div>
            </section>

            {/* Narrative Section - E-E-A-T */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-black tracking-tight text-[#2c3e5e]">
                                Virtualizing Your Mobile Identity.
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                At <strong>Deeplugg</strong>, we believe digital freedom is a right, not a luxury. Our platform is built on enterprise-grade infrastructure that provides seamless <strong>eSIM provisioning</strong> and <strong>secure SMS verification</strong> for users who prioritize privacy and global accessibility.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Whether you're looking for temporary <strong>number rentals</strong> for business or permanent eSIM solutions for global travel, we provide the ultimate "plug" into the world's most reliable mobile networks. Our technology bridges the gap between hardware restrictions and digital mobility.
                            </p>
                            {/* <div className="grid grid-cols-2 gap-8 pt-4">
                                <div>
                                    <div className="text-3xl font-black text-[#2c3e5e] mb-1">5M+</div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Plugs Created</p>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-[#2c3e5e] mb-1">500+</div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Global Partners</p>
                                </div>
                            </div> */}
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-gray-100 rounded-[3rem] overflow-hidden relative shadow-2xl">
                                <img
                                    src={aboutImg2}
                                    alt="Global Connectivity"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2c3e5e]/40 to-transparent"></div>
                            </div>
                            {/* Glass Card Overlay */}
                            <div className="absolute -bottom-10 -left-10 w-72 p-8 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
                                <img
                                    src={aboutImg1}
                                    alt="Technology Infrastructure"
                                    className="w-full h-32 object-cover rounded-2xl mb-4"
                                />
                                <p className="font-bold text-[#2c3e5e] text-sm">Empowering over 1M users with secure virtual mobile identities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-[#2c3e5e] mb-4">Why Trust Deeplugg?</h2>
                        <p className="text-gray-500 font-medium">Built on transparency, expertise, and a passion for culture.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-[#2c3e5e]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Cpu className="w-7 h-7 text-[#2c3e5e]" />
                            </div>
                            <h3 className="text-xl font-black text-[#2c3e5e] mb-4">eSIM Solutions</h3>
                            <p className="text-gray-600 font-medium">Instant global data and voice connectivity without the need for physical SIM cards. Stay connected across borders.</p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-[#2c3e5e]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-7 h-7 text-[#2c3e5e]" />
                            </div>
                            <h3 className="text-xl font-black text-[#2c3e5e] mb-4">SMS Verification</h3>
                            <p className="text-gray-600 font-medium">Secure OTP and SMS verification services for all major platforms. Protect your identity with virtual numbers.</p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-[#2c3e5e]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Key className="w-7 h-7 text-[#2c3e5e]" />
                            </div>
                            <h3 className="text-xl font-black text-[#2c3e5e] mb-4">Mobile Rentals</h3>
                            <p className="text-gray-600 font-medium">Short and long-term rentals of virtual mobile numbers. Flexible solutions for individuals and enterprise teams.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#2c3e5e] rounded-[3rem] p-12 sm:p-20 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-5xl font-black text-white mb-8">Ready to plug your brand online?</h2>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/signup" className="px-10 py-5 bg-white text-[#2c3e5e] font-black rounded-2xl hover:scale-105 transition-all text-lg tracking-widest uppercase inline-block">
                                    Join the Network
                                </Link>
                                <a href="mailto:hello@deeplugg.com" className="px-10 py-5 bg-transparent text-white border-2 border-white/20 font-black rounded-2xl hover:bg-white/10 transition-all text-lg tracking-widest uppercase inline-block">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                        {/* Background elements */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>
            </section>

            <AdSense />
            <Footer />

            {/* Schema.org Organization for About Us */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Deeplugg Official",
                    "url": "https://www.deeplugg.com",
                    "logo": "https://www.deeplugg.com/logo.png",
                    "description": "Premium infrastructure for eSIM, SMS verification, and virtual mobile rentals.",
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "email": "hello@deeplugg.com",
                        "contactType": "customer service"
                    },
                    "sameAs": [
                        "https://twitter.com/deeplugg",
                        "https://instagram.com/deeplugg",
                        "https://facebook.com/deeplugg"
                    ]
                })}
            </script>
        </div>
    );
};
