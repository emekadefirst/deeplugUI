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

export const HomeServiceCard = React.memo(({ title, description, icon: Icon, features, path, }: Props) => {
    return (
        <Link
            to={path}
            className="group relative bg-white rounded-3xl border border-zinc-200/50 overflow-hidden hover:border-[#2c3e5e]/30 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col"
        >
            <div className="p-8 flex-1 space-y-6 relative z-10">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200/50 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-[#2c3e5e]" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[#2c3e5e] tracking-tight">{title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                    <ul className="space-y-2">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                                <div className="w-1 h-1 bg-[#2c3e5e] rounded-full" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="px-8 py-4 bg-zinc-50/50 flex items-center justify-between group-hover:bg-zinc-50 transition-colors border-t border-zinc-100">
                <span className="text-xs font-semibold text-[#2c3e5e]">Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#2c3e5e] group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
});

HomeServiceCard.displayName = 'HomeServiceCard';
