import { useEffect, useRef } from 'react';
import simLocalLogo from '../assets/image/simlocal-logo.svg';
import paystackLogo from '../assets/image/paystack-logo.png';

const partners = [
    { name: 'Sim Local', logo: simLocalLogo },
    { name: 'Paystack', logo: paystackLogo },
];

// Duplicate list for seamless infinite scroll
const marqueeItems = [...partners, ...partners, ...partners];

const styles = `
@keyframes partners-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}

@keyframes partners-marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }
}

.partners-heading-anim {
    opacity: 0;
    animation: partners-fade-up 0.7s ease forwards;
}

.partners-subtext-anim {
    opacity: 0;
    animation: partners-fade-up 0.7s ease 0.15s forwards;
}

.partners-strip-anim {
    opacity: 0;
    animation: partners-fade-up 0.7s ease 0.3s forwards;
}

.partners-marquee-track {
    display: flex;
    gap: 2rem;
    animation: partners-marquee 18s linear infinite;
    width: max-content;
}

.partners-marquee-wrapper:hover .partners-marquee-track {
    animation-play-state: paused;
}
`;

export default function Partners() {
    const styleRef = useRef<HTMLStyleElement | null>(null);

    useEffect(() => {
        if (!document.getElementById('partners-styles')) {
            const el = document.createElement('style');
            el.id = 'partners-styles';
            el.textContent = styles;
            document.head.appendChild(el);
            styleRef.current = el;
        }
        return () => {
            styleRef.current?.remove();
        };
    }, []);

    return (
        <section className="py-8 sm:py-10 bg-white border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Heading */}
                <div className="text-center mb-7">
                    <span className="partners-heading-anim text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#2c3e5e] mb-3 block">
                        Trusted Partners
                    </span>
                    <h2 className="partners-heading-anim text-2xl sm:text-3xl font-black text-[#2c3e5e] tracking-tight">
                        Powered by world-class networks
                    </h2>
                    <p className="partners-subtext-anim text-gray-500 text-sm mt-2 max-w-md mx-auto">
                        We partner with leading global providers to deliver fast, reliable connectivity wherever you are.
                    </p>
                </div>

                {/* Animated marquee strip */}
                <div className="partners-strip-anim partners-marquee-wrapper relative">
                    {/* Fade edges */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to right, white, transparent)' }}
                    />
                    <div
                        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
                        style={{ background: 'linear-gradient(to left, white, transparent)' }}
                    />

                    <div className="overflow-hidden">
                        <div className="partners-marquee-track">
                            {marqueeItems.map((p, i) => (
                                <div
                                    key={`${p.name}-${i}`}
                                    className="group flex-shrink-0 flex items-center justify-center px-10 py-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#2c3e5e]/20 hover:bg-[#2c3e5e]/5 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                                    style={{ minWidth: '180px' }}
                                >
                                    <img
                                        src={p.logo}
                                        alt={`${p.name} logo`}
                                        className="h-10 sm:h-12 w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
