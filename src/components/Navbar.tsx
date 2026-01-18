import { useState, useEffect } from 'react';
import { Menu, X, Plug, Sparkles } from 'lucide-react';
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
        { href: '#about', label: 'About Us', icon: null },
        { href: '#policies', label: 'Policies', icon: null },
        { href: '#ai', label: 'deePlugg AI', icon: Sparkles },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4 lg:gap-10">
                        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                            <div className="relative p-2 bg-[#2c3e5e] rounded-xl sm:rounded-full group-hover:scale-105 transition-all duration-300 shadow-lg">
                                <Plug className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#2c3e5e]">
                                deePlugg
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#2c3e5e] hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                >
                                    {link.label}
                                    {link.icon && <link.icon className="h-3.5 w-3.5 text-[#2c3e5e]" strokeWidth={2.5} />}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-6 py-2.5 text-sm font-semibold text-[#2c3e5e] hover:bg-gray-50 rounded-lg transition-all"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-[#2c3e5e] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#1f2d42] hover:shadow-lg hover:shadow-[#2c3e5e]/20 hover:scale-105 transition-all duration-200"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-[#2c3e5e]" />
                        ) : (
                            <Menu className="h-6 w-6 text-[#2c3e5e]" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-4 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center justify-between px-4 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#2c3e5e] rounded-xl transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                    {link.icon ? <link.icon className="h-4 w-4" strokeWidth={2.5} /> : <div className="w-4 h-4 opacity-10 border-r-2 border-b-2 border-current rotate-45" />}
                                </a>
                            ))}
                        </div>
                        <div className="p-4 pt-0 space-y-3">
                            <Link
                                to="/login"
                                className="block w-full text-center py-4 text-sm font-bold text-[#2c3e5e] bg-gray-50 rounded-xl"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="block w-full bg-[#2c3e5e] text-white text-sm font-bold px-4 py-4 rounded-xl text-center hover:bg-[#1f2d42] shadow-lg shadow-[#2c3e5e]/10"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
