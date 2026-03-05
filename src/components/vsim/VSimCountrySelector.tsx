import React, { useState } from 'react';
import { Search, ChevronDown, Globe, Check } from 'lucide-react';
import type { VSimCountry } from '../../services/vsim-service';
import { useDropdownOutsideClick } from '../../hooks/use-outside-click';

interface Props {
    countries: VSimCountry[];
    selected: VSimCountry | null;
    search: string;
    loading?: boolean;
    onSearch: (v: string) => void;
    onSelect: (c: VSimCountry) => void;
}

export const VSimCountrySelector = React.memo(({ countries, selected, search, loading, onSearch, onSelect }: Props) => {
    const [open, setOpen] = useState(false);
    const ref = useDropdownOutsideClick(setOpen);

    return (
        <div className="space-y-2" ref={ref}>
            <label className="block text-sm font-bold text-[#2c3e5e]">Choose Region</label>
            <div className="relative">
                <button
                    type="button"
                    disabled={loading}
                    onClick={() => !loading && setOpen(!open)}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-between transition-all hover:border-[#2c3e5e]/30 shadow-sm disabled:opacity-50"
                    style={open ? { borderColor: '#2c3e5e', boxShadow: '0 0 0 4px rgba(44, 62, 94, 0.05)' } : {}}
                >
                    <div className="flex items-center gap-3">
                        <Globe className={`w-5 h-5 ${selected ? 'text-[#2c3e5e]' : 'text-gray-400'}`} />
                        <span className={selected ? 'text-[#2c3e5e] font-bold' : 'text-gray-400'}>
                            {selected ? selected.country : 'Select target country'}
                        </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-slide-up">
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter destinations..."
                                    value={search}
                                    onChange={(e) => onSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2c3e5e]/10"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {countries.map((country) => (
                                <button
                                    key={country.country_code}
                                    onClick={() => {
                                        onSelect(country);
                                        setOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors group"
                                >
                                    <div>
                                        <p className="font-bold text-[#2c3e5e]">{country.country}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{country.country_code}</p>
                                    </div>
                                    {selected?.country_code === country.country_code && <Check className="w-4 h-4 text-[#2c3e5e]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

VSimCountrySelector.displayName = 'VSimCountrySelector';
