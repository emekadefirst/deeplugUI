import React from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
    areaCodes: string[];
    newValue: string;
    onValueChange: (v: string) => void;
    onAdd: () => void;
    onRemove: (code: string) => void;
}

export const AreaCodeManager = React.memo(({ areaCodes, newValue, onValueChange, onAdd, onRemove }: Props) => {
    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-[#2c3e5e]">Area Codes (Optional)</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter code..."
                    value={newValue}
                    onChange={(e) => onValueChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#2c3e5e]/30 transition-all text-sm font-medium"
                />
                <button
                    type="button"
                    onClick={onAdd}
                    className="px-6 py-3 bg-[#2c3e5e] text-white font-bold rounded-xl hover:bg-[#1a263b] transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add
                </button>
            </div>
            {areaCodes.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {areaCodes.map((code) => (
                        <span
                            key={code}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2c3e5e]/5 text-[#2c3e5e] rounded-lg text-xs font-bold border border-[#2c3e5e]/10 animate-fade-in"
                        >
                            {code}
                            <button
                                onClick={() => onRemove(code)}
                                className="hover:text-red-500 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
});

AreaCodeManager.displayName = 'AreaCodeManager';
