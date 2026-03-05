import React, { useState, useMemo, useCallback } from 'react';
import { Search, ChevronDown, RefreshCw, Globe, Check } from 'lucide-react';
import type { ESimCountry } from '../../services/esim-service';
import { BRAND, QUICK_PICK_CODES } from './constants';

interface Props {
    countries: ESimCountry[];
    selectedCountry: ESimCountry | null;
    loadingCountries: boolean;
    onSelect: (country: ESimCountry) => void;
}

/**
 * Country selector with search dropdown + quick-pick pills.
 *
 * React.memo: Only re-renders when countries list, selected country,
 * or loading state changes — not on filter/sort changes.
 *
 * Internal dropdown state (open/close, search string) is scoped here,
 * preventing the parent from re-rendering when the dropdown opens.
 */
export const CountrySelector = React.memo(({ countries, selectedCountry, loadingCountries, onSelect }: Props) => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    // useMemo: filtering 200+ countries on every keystroke is fine, but
    // we avoid doing it on unrelated parent re-renders too
    const filteredCountries = useMemo(() =>
        countries
            .filter(c => c.has_active_offerings)
            .filter(c =>
                c.english_name.toLowerCase().includes(search.toLowerCase()) ||
                c.id.toLowerCase().includes(search.toLowerCase())
            ),
        [countries, search]
    );

    const handleSelect = useCallback((country: ESimCountry) => {
        onSelect(country);
        setOpen(false);
        setSearch('');
    }, [onSelect]);

    // Quick-pick countries — memoised so we don't .find() 7 times on every render
    const quickPicks = useMemo(() =>
        QUICK_PICK_CODES
            .map(code => countries.find(c => c.id === code && c.has_active_offerings))
            .filter((c): c is ESimCountry => c !== undefined),
        [countries]
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <label className="block text-sm font-bold text-[#2c3e5e] mb-3">
                Choose your destination
            </label>
            <div className="relative max-w-sm">
                <button
                    type="button"
                    onClick={() => !loadingCountries && setOpen(v => !v)}
                    className="w-full px-4 py-3 bg-white border-2 rounded-xl text-left transition-all flex items-center justify-between"
                    style={open ? { borderColor: BRAND, boxShadow: `0 0 0 4px ${BRAND}10` } : { borderColor: '#e5e7eb' }}
                >
                    <div className="flex items-center gap-3">
                        {loadingCountries
                            ? <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                            : <Globe className="w-5 h-5" style={{ color: selectedCountry ? BRAND : '#9ca3af' }} />
                        }
                        <span style={{ color: selectedCountry ? '#2c3e5e' : '#9ca3af', fontWeight: selectedCountry ? 600 : 400 }}>
                            {selectedCountry ? selectedCountry.english_name : 'Select destination country…'}
                        </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg text-sm outline-none"
                                    style={{ '--tw-ring-color': BRAND } as React.CSSProperties}
                                    placeholder="Search countries…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {filteredCountries.length === 0
                                ? <div className="py-8 text-center text-sm text-gray-400">No countries found</div>
                                : filteredCountries.map(country => (
                                    <button
                                        key={country.id}
                                        onClick={() => handleSelect(country)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-[#2c3e5e] text-sm">{country.english_name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{country.id}</p>
                                        </div>
                                        {selectedCountry?.id === country.id && <Check className="w-4 h-4" style={{ color: BRAND }} />}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}
            </div>

            {/* Quick pick pills — only shown before a country is selected */}
            {!selectedCountry && quickPicks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {quickPicks.map(c => (
                        <button
                            key={c.id}
                            onClick={() => handleSelect(c)}
                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-[#2c3e5e] text-xs font-bold rounded-lg transition-all hover:border-gray-300"
                        >
                            {c.english_name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

CountrySelector.displayName = 'CountrySelector';
