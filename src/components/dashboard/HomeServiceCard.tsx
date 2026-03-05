import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
    title: string;
    description: string;
    icon: React.ElementType;
    features: readonly string[];
    path: string;
    color: string;
}

export const HomeServiceCard = React.memo(({ title, description, icon: Icon, features, path, color }: Props) => {
    return (
        <Link
            to={path}
            className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:border-[#2c3e5e]/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[#2c3e5e]/10 flex flex-col"
        >
            <div className={`absolute top-0 right-0 w-40 h-40 ${color} opacity-5 rounded-bl-[100px] transition-transform duration-700 group-hover:scale-150`} />

            <div className="p-10 flex-1 space-y-6 relative z-10">
                <div className={`w-20 h-20 ${color} rounded-[1.75rem] flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                    <Icon className="w-10 h-10 text-white" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-[#2c3e5e] uppercase tracking-tighter leading-none">{title}</h3>
                    <p className="text-gray-400 text-sm font-bold leading-relaxed">{description}</p>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <ul className="space-y-3">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-xs font-black text-gray-500 uppercase tracking-widest">
                                <div className={`w-1.5 h-1.5 ${color} rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex items-center justify-between group-hover:bg-white transition-colors border-t border-gray-50">
                <span className="text-[10px] font-black text-[#2c3e5e] uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Try out</span>
                <div className="w-10 h-10 bg-[#2c3e5e] rounded-xl flex items-center justify-center text-white group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );
});

HomeServiceCard.displayName = 'HomeServiceCard';
