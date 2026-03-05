import React from 'react';

interface Props {
    label: string;
    status: string;
    icon: React.ElementType;
    variant: 'success' | 'warning' | 'info' | 'error';
}

const variantConfig = {
    success: 'bg-green-50 border-green-100 text-green-600 icon-bg-green-100',
    warning: 'bg-amber-50 border-amber-100 text-amber-600 icon-bg-amber-100',
    info: 'bg-blue-50 border-blue-100 text-blue-600 icon-bg-blue-100',
    error: 'bg-red-50 border-red-100 text-red-600 icon-bg-red-100',
};

export const AccountStatusCard = React.memo(({ label, status, icon: Icon, variant }: Props) => {
    const config = variantConfig[variant];
    const iconBgClass = config.split('icon-bg-')[1];

    return (
        <div className={`p-6 rounded-[2rem] border-2 transition-all shadow-sm ${config.split(' icon-bg')[0]}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBgClass}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</p>
                    <p className="text-lg font-black tracking-tight">{status}</p>
                </div>
            </div>
        </div>
    );
});

AccountStatusCard.displayName = 'AccountStatusCard';
