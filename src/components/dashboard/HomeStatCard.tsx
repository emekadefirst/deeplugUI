import React from 'react';

interface Props {
    label: string;
    value: string;
    icon: React.ElementType;
}

export const HomeStatCard = React.memo(({ label, value, icon: Icon }: Props) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-zinc-200/50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-zinc-500">{label}</p>
                    <p className="text-2xl font-bold text-[#2c3e5e] tracking-tight">{value}</p>
                </div>
                <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-200/50 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#2c3e5e]" />
                </div>
            </div>
        </div>
    );
});

HomeStatCard.displayName = 'HomeStatCard';
