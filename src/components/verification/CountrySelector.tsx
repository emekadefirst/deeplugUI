import React, { useState } from 'react';
import { Search, ChevronDown, MapPin, Check } from 'lucide-react';
import type { Country } from '../../services/sms-service';
import { useDropdownOutsideClick } from '../../hooks/use-outside-click';

interface Props {
    countries: Country[];
    selected: Country | null;
    search: string;
    onSearch: (v: string) => void;
    onSelect: (c: Country) => void;
}

export const CountrySelector = React.memo(({ countries, selected, search, onSearch, onSelect }: Props) => {
    const [open, setOpen] = useState(false);
    const ref = useDropdownOutsideClick(setOpen);

    return (
        <div className="space-y-2.5" ref={ref}>
            <label className="block text-sm font-semibold text-zinc-700">Select Region</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className={`w-full px-4 py-3.5 bg-white border rounded-xl flex items-center justify-between transition-all duration-200 outline-none
                        ${open ? 'border-[#2c3e5e] ring-4 ring-[#2c3e5e]/5' : 'border-zinc-200 hover:border-zinc-300'}`}
                >
                    <div className="flex items-center gap-3">
                        <MapPin className={`w-5 h-5 transition-colors ${selected ? 'text-[#2c3e5e]' : 'text-zinc-400'}`} />
                        <span className={`text-sm ${selected ? 'text-zinc-900 font-medium' : 'text-zinc-500'}`}>
                            {selected ? `${selected.name} (+${selected.cc})` : 'Select a country...'}
                        </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-3 border-b border-zinc-100 bg-zinc-50/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search regions..."
                                    value={search}
                                    onChange={(e) => onSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none focus:border-[#2c3e5e] transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-[280px] overflow-y-auto overscroll-contain">
                            {countries.length === 0 ? (
                                <div className="py-10 text-center text-sm text-zinc-400 flex flex-col items-center gap-2">
                                    <Search className="w-5 h-5 opacity-20" />
                                    No regions found
                                </div>
                            ) : (
                                <div className="p-1">
                                    {countries.map((country) => (
                                        <button
                                            key={country.ID}
                                            onClick={() => {
                                                onSelect(country);
                                                setOpen(false);
                                            }}
                                            className={`w-full px-3 py-2.5 text-left rounded-lg flex items-center justify-between transition-colors group
                                                ${selected?.ID === country.ID ? 'bg-[#2c3e5e]/5 text-[#2c3e5e]' : 'hover:bg-zinc-50 text-zinc-700'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium tracking-tight">{country.name}</span>
                                                <span className="text-[10px] text-zinc-400 font-semibold tracking-wider">+{country.cc}</span>
                                            </div>
                                            {selected?.ID === country.ID && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

CountrySelector.displayName = 'CountrySelector';
