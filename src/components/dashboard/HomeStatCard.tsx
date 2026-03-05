import React from 'react';

interface Props {
    label: string;
    value: string;
    icon: React.ElementType;
}

export const HomeStatCard = React.memo(({ label, value, icon: Icon }: Props) => {
    return (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#2c3e5e]/5 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[60px] transition-transform group-hover:scale-110" />
            <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
                    <p className="text-3xl font-black text-[#2c3e5e] tracking-tighter">{value}</p>
                </div>
                <div className="w-14 h-14 bg-[#2c3e5e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#2c3e5e]/20 group-hover:rotate-6 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </div>
    );
});

HomeStatCard.displayName = 'HomeStatCard';
