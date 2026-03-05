import React from 'react';
import { Phone, Check } from 'lucide-react';
import type { VSimPhoneNumber } from '../../services/vsim-service';

interface Props {
    number: VSimPhoneNumber;
    selected: boolean;
    onSelect: (n: VSimPhoneNumber) => void;
}

export const VSimNumberCard = React.memo(({ number, selected, onSelect }: Props) => {
    return (
        <button
            onClick={() => onSelect(number)}
            className={`p-4 sm:p-5 rounded-3xl border-2 text-left transition-all relative group overflow-hidden ${selected
                ? 'border-[#2c3e5e] bg-[#2c3e5e]/5'
                : 'border-gray-100 hover:border-gray-200 bg-white shadow-sm'
                }`}
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-[#2c3e5e]/5 rounded-bl-[100px] transition-transform duration-500 transition-all ${selected ? 'translate-x-4 -translate-y-4' : 'translate-x-24 -translate-y-24 group-hover:translate-x-8 group-hover:-translate-y-8'}`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl transition-colors ${selected ? 'bg-[#2c3e5e] text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                        <Phone className="w-4 h-4" />
                    </div>
                    {selected && (
                        <div className="bg-[#2c3e5e] text-white p-1 rounded-full animate-in zoom-in">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                </div>

                <p className="text-xl font-black text-[#2c3e5e] mb-1 tracking-tight">
                    {number.friendly_name}
                </p>

                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Starts at</span>
                    <span className="text-lg font-black text-[#2c3e5e]">
                        {number.currency || '₦'}{Math.ceil(number.price || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">/ mo</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-5">
                    {number.capabilities && Object.entries(number.capabilities).map(([key, val]) =>
                        val && (
                            <span key={key} className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                {key}
                            </span>
                        )
                    )}
                </div>
            </div>
        </button>
    );
});

VSimNumberCard.displayName = 'VSimNumberCard';
