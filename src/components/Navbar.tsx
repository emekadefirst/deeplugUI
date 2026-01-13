import { useState } from 'react';
import { Menu, X, Plug, Sparkles } from 'lucide-react';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const navLinks = [
        { href: '#about', label: 'About Us', icon: null },
        { href: '#policies', label: 'Policies', icon: null },
        { href: '#ai', label: 'deePlug AI', icon: Sparkles },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <div className="flex items-center gap-10">
                        <a href="/" className="flex items-center gap-3 group">
                            <div className="relative p-2.5 bg-[#2c3e5e] rounded-full group-hover:scale-105 transition-all duration-300 shadow-lg">
                                <Plug className="h-6 w-6 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-[#2c3e5e]">
                                deePlug
                            </span>
                        </a>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#2c3e5e] hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-1.5"
                                >
                                    {link.label}
                                    {link.icon && <link.icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button className="bg-[#2c3e5e] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#1f2d42] hover:shadow-lg hover:shadow-[#2c3e5e]/20 hover:scale-105 transition-all duration-200">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-[#2c3e5e]" />
                        ) : (
                            <Menu className="h-6 w-6 text-[#2c3e5e]" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-6 pt-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#2c3e5e] rounded-lg transition-all flex items-center gap-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                                {link.icon && <link.icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
                            </a>
                        ))}
                        <div className="pt-4 space-y-2">
                            <button className="w-full bg-[#2c3e5e] text-white text-sm font-bold px-4 py-3 rounded-lg hover:bg-[#1f2d42] hover:shadow-lg transition-all">
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}