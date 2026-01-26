import { useState, useEffect } from 'react';
import { Menu, X, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/privacy', label: 'Policy' },
        { href: '/about', label: 'About Us' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#2c3e5e]/90 backdrop-blur-xl shadow-lg border-b border-white/10' : 'bg-transparent'
            }`}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                <div className="flex justify-between items-center h-20 sm:h-24">
                    {/* Logo Section */}
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-[#2c3e5e] font-black text-xl">D</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">
                                deePlugg
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="text-sm font-bold text-white/80 hover:text-white transition-colors tracking-wide"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Right Side */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-white/50 group-focus-within:text-white transition-colors" />
                            </div>
                            {/* <input
                                type="text"
                                placeholder="Search country"
                                className="bg-white/10 border border-white/20 rounded-full py-2.5 pl-10 pr-6 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all w-48 xl:w-64"
                            /> */}
                        </div>

                        {/* Action Buttons
                        <button className="flex items-center gap-2 bg-white text-[#2c3e5e] px-5 py-2.5 rounded-xl font-black text-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-white/10">
                            <Smartphone className="h-4 w-4" />
                            Download APP
                        </button> */}

                        <Link to="/login" className="bg-[#ee6c4d] p-3 rounded-xl text-white hover:bg-[#ee6c4d]/90 transition-all shadow-lg hover:scale-105">
                            <User className="h-5 w-5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-3 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-[#2c3e5e] border-b border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="block py-3 text-lg font-bold text-white/90 hover:text-white transition-all border-b border-white/5"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 space-y-4">
                            {/* <button className="w-full flex items-center justify-center gap-2 bg-white text-[#2c3e5e] py-4 rounded-2xl font-black text-sm">
                                <Smartphone className="h-5 w-5" />
                                Download APP
                            </button> */}
                            <Link
                                to="/login"
                                className="block w-full text-center py-4 bg-[#ee6c4d] text-white rounded-2xl font-black text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign In / Profile
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

