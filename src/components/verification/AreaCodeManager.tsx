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
        <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-zinc-700">Area Filter (Optional)</label>
            <div className="flex gap-2.5">
                <input
                    type="text"
                    placeholder="Enter area code..."
                    value={newValue}
                    onChange={(e) => onValueChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
                    className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#2c3e5e] focus:ring-4 focus:ring-[#2c3e5e]/5 transition-all text-sm font-medium"
                />
                <button
                    type="button"
                    onClick={onAdd}
                    className="px-5 py-3 bg-[#2c3e5e] text-white font-semibold rounded-xl hover:bg-[#1f2d42] transition-all flex items-center gap-2 active:scale-95 shadow-sm shadow-[#2c3e5e]/5"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add</span>
                </button>
            </div>
            {areaCodes.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1.5 min-h-[32px]">
                    {areaCodes.map((code) => (
                        <span
                            key={code}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-100/50 text-zinc-700 rounded-lg text-xs font-semibold border border-zinc-200 animate-in fade-in zoom-in duration-200"
                        >
                            {code}
                            <button
                                onClick={() => onRemove(code)}
                                className="hover:text-red-500 transition-colors p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
});

AreaCodeManager.displayName = 'AreaCodeManager';
