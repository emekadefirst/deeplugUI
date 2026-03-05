import React from 'react';
import { MapPin, Smartphone, Globe, Flag } from 'lucide-react';
import type { VSimNumberType } from '../../services/vsim-service';

interface Props {
    selected: VSimNumberType;
    onSelect: (t: VSimNumberType) => void;
}

const TYPES: { id: VSimNumberType; label: string; icon: typeof MapPin }[] = [
    { id: 'Local', label: 'Local', icon: MapPin },
    { id: 'Mobile', label: 'Mobile', icon: Smartphone },
    { id: 'TollFree', label: 'Toll Free', icon: Globe },
    { id: 'National', label: 'National', icon: Flag },
];

export const VSimTypePicker = React.memo(({ selected, onSelect }: Props) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-[#2c3e5e]">Number Type</label>
            <div className="grid grid-cols-2 gap-2">
                {TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = selected === type.id;
                    return (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all group ${isActive
                                ? 'border-[#2c3e5e] bg-[#2c3e5e]/5 text-[#2c3e5e]'
                                : 'border-gray-50 bg-gray-50/30 text-gray-400 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 mb-1.5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

VSimTypePicker.displayName = 'VSimTypePicker';
