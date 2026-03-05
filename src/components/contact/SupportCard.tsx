import React from 'react';

interface Props {
    title: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    onClick: () => void;
}

export const SupportCard = React.memo(({ title, description, icon: Icon, iconBg, iconColor, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-start p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-[#2c3e5e]/20 transition-all group text-left shadow-sm hover:shadow-xl hover:shadow-[#2c3e5e]/5 animate-scale-in"
        >
            <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
            <h3 className="text-xl font-black text-[#2c3e5e] uppercase tracking-tight mb-2">{title}</h3>
            <p className="text-gray-400 text-xs font-bold leading-relaxed">{description}</p>
        </button>
    );
});

SupportCard.displayName = 'SupportCard';
