const countries = [
    { name: 'Nigeria', flag: '🇳🇬', code: 'NG' },
    { name: 'United States', flag: '🇺🇸', code: 'US' },
    { name: 'United Kingdom', flag: '🇬🇧', code: 'UK' },
    { name: 'Germany', flag: '🇩🇪', code: 'DE' },
    { name: 'Japan', flag: '🇯🇵', code: 'JP' },
];

const scStyles = `
@keyframes sc-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes sc-badge-pop {
    0%   { opacity: 0; transform: scale(0.7); }
    70%  { transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
}
.sc-heading { opacity: 0; animation: sc-fade-up 0.65s ease 0.05s forwards; }
.sc-sub     { opacity: 0; animation: sc-fade-up 0.65s ease 0.2s forwards; }
.sc-card-0  { opacity: 0; animation: sc-fade-up 0.55s ease 0.28s forwards; }
.sc-card-1  { opacity: 0; animation: sc-fade-up 0.55s ease 0.36s forwards; }
.sc-card-2  { opacity: 0; animation: sc-fade-up 0.55s ease 0.44s forwards; }
.sc-card-3  { opacity: 0; animation: sc-fade-up 0.55s ease 0.52s forwards; }
.sc-card-4  { opacity: 0; animation: sc-fade-up 0.55s ease 0.60s forwards; }
.sc-badge   { opacity: 0; animation: sc-badge-pop 0.6s ease 0.7s forwards; }

.sc-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.sc-card:hover {
    transform: translateY(-5px) scale(1.04);
    box-shadow: 0 12px 32px rgba(44, 62, 94, 0.13);
    border-color: rgba(44, 62, 94, 0.25);
}
`;

export default function SupportedCountries() {
    return (
        <>
            <style>{scStyles}</style>
            <section className="py-10 sm:py-14 bg-[#f8fafc] border-t border-gray-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    {/* Heading */}
                    <div className="text-center mb-10">
                        <span className="sc-heading text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#2c3e5e] mb-3 block">
                            Global Coverage
                        </span>
                        <h2 className="sc-heading text-2xl sm:text-3xl font-black text-[#2c3e5e] tracking-tight">
                            Stay connected in 150+ countries
                        </h2>
                        <p className="sc-sub text-gray-500 text-sm mt-2 max-w-md mx-auto">
                            From Lagos to Tokyo, Deeplu keeps you online wherever life takes you — no SIM swaps, no roaming surprises.
                        </p>
                    </div>

                    {/* Country cards */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
                        {countries.map((country, i) => (
                            <div
                                key={country.code}
                                className={`sc-card sc-card-${i} flex flex-col items-center gap-2 px-6 py-5 bg-white rounded-2xl border border-gray-200 shadow-sm cursor-default select-none`}
                                style={{ minWidth: '110px' }}
                            >
                                <span className="text-4xl leading-none">{country.flag}</span>
                                <span className="text-xs font-bold text-[#2c3e5e] mt-1">{country.name}</span>
                            </div>
                        ))}

                        {/* 150+ badge card */}
                        <div
                            className="sc-badge sc-card flex flex-col items-center justify-center gap-2 px-6 py-5 rounded-2xl border border-dashed border-[#2c3e5e]/30 shadow-sm cursor-default select-none"
                            style={{
                                minWidth: '110px',
                                background: 'linear-gradient(135deg, #2c3e5e10 0%, #3b82f620 100%)',
                            }}
                        >
                            <span
                                className="text-2xl font-black tracking-tight"
                                style={{ color: '#2c3e5e' }}
                            >
                                150+
                            </span>
                            <span className="text-xs font-semibold text-[#2c3e5e]/70 text-center leading-tight">
                                More<br />Countries
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
