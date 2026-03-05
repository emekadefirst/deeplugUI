import React from 'react';

interface Props {
    label: string;
    value: string;
    icon: React.ElementType;
}

export const ProfileInfoItem = React.memo(({ label, value, icon: Icon }: Props) => {
    return (
        <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-3xl hover:bg-white hover:border-[#2c3e5e]/10 transition-all group shadow-sm hover:shadow-lg hover:shadow-[#2c3e5e]/5">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-[#2c3e5e]" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="text-sm font-black text-[#2c3e5e] tracking-tight truncate max-w-[200px]">{value}</p>
                </div>
            </div>
        </div>
    );
});

ProfileInfoItem.displayName = 'ProfileInfoItem';
