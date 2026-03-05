import React from 'react';
import { Check, SlidersHorizontal, X } from 'lucide-react';
import { BRAND, OFFER_TYPE_OPTIONS } from './constants';
import type { OfferType, SpeedFilter } from './constants';

interface Props {
    availableMvnos: { id: string; alias: string }[];
    selectedMvnos: Set<string>;
    offerType: OfferType;
    speedFilter: SpeedFilter;
    has4g: boolean;
    has5g: boolean;
    hasActiveFilter: boolean;
    onToggleMvno: (id: string) => void;
    onOfferType: (v: OfferType) => void;
    onSpeedFilter: (v: SpeedFilter) => void;
    onReset: () => void;
    /** Mobile drawer mode */
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

/**
 * Filter sidebar.
 *
 * Desktop (lg+): renders as a sticky sidebar in the flex layout.
 * Mobile (<lg): renders as a slide-up bottom sheet / drawer overlay.
 */
export const FilterSidebar = React.memo(({
    availableMvnos, selectedMvnos, offerType, speedFilter,
    has4g, has5g, hasActiveFilter, onToggleMvno, onOfferType, onSpeedFilter, onReset,
    isMobileOpen = false, onMobileClose,
}: Props) => {

    // ── The inner filter content (shared between desktop & mobile) ───
    const filterContent = (
        <div className="p-5 space-y-6">
            {/* Plan type */}
            <div>
                <p className="text-xs font-black text-[#2c3e5e] mb-3 uppercase tracking-wide">Plan</p>
                <div className="flex flex-wrap gap-2">
                    {OFFER_TYPE_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => onOfferType(opt.value)}
                            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all text-left"
                            style={offerType === opt.value
                                ? { backgroundColor: `${BRAND}15`, borderColor: BRAND, color: BRAND }
                                : { borderColor: '#e5e7eb', color: '#6b7280' }
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Speed */}
            {(has4g || has5g) && (
                <div>
                    <p className="text-xs font-black text-[#2c3e5e] mb-3 uppercase tracking-wide">Speed</p>
                    <div className="flex flex-wrap gap-2">
                        {(['all', ...(has4g ? ['4g'] : []), ...(has5g ? ['5g'] : [])] as SpeedFilter[]).map(s => (
                            <button
                                key={s}
                                onClick={() => onSpeedFilter(s)}
                                className="px-3.5 py-1 rounded-full text-xs font-bold border transition-all"
                                style={speedFilter === s
                                    ? { backgroundColor: `${BRAND}15`, borderColor: BRAND, color: BRAND }
                                    : { borderColor: '#e5e7eb', color: '#6b7280' }
                                }
                            >
                                {s === 'all' ? 'All' : s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Network Provider */}
            {availableMvnos.length > 1 && (
                <div>
                    <p className="text-xs font-black text-[#2c3e5e] mb-3 uppercase tracking-wide">Network Provider</p>
                    <div className="space-y-2.5">
                        {availableMvnos.map(({ id, alias }) => (
                            <label
                                key={id}
                                className="flex items-center gap-2.5 cursor-pointer"
                                onClick={() => onToggleMvno(id)}
                            >
                                <div
                                    className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                                    style={{
                                        backgroundColor: selectedMvnos.has(id) ? BRAND : 'transparent',
                                        borderColor: selectedMvnos.has(id) ? BRAND : '#d1d5db',
                                    }}
                                >
                                    {selectedMvnos.has(id) && <Check className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <span className="text-sm text-gray-700">{alias}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* ── Desktop sidebar (hidden on mobile) ── */}
            <aside className="hidden lg:block w-52 flex-shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-4">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-black text-[#2c3e5e] flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                    </h2>
                    {hasActiveFilter && (
                        <button onClick={onReset} className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors">
                            Reset
                        </button>
                    )}
                </div>
                {filterContent}
            </aside>

            {/* ── Mobile bottom-sheet drawer (only when open) ── */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40" onClick={e => e.target === e.currentTarget && onMobileClose?.()}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
                    {/* Sheet */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto z-50 animate-slide-up">
                        {/* Handle bar */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-gray-300 rounded-full" />
                        </div>
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-black text-[#2c3e5e] flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4" />
                                Filter
                            </h2>
                            <div className="flex items-center gap-3">
                                {hasActiveFilter && (
                                    <button onClick={onReset} className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors">
                                        Reset
                                    </button>
                                )}
                                <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        {filterContent}
                        {/* Apply button at bottom */}
                        <div className="p-5 border-t border-gray-100">
                            <button
                                onClick={onMobileClose}
                                className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all hover:opacity-90"
                                style={{ backgroundColor: BRAND }}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

FilterSidebar.displayName = 'FilterSidebar';
