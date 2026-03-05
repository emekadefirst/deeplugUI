import React from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import { useDropdownOutsideClick } from '../../hooks/use-outside-click';
import { BRAND, SORT_OPTIONS } from './constants';
import type { SortOption } from './constants';

interface Props {
    sortBy: SortOption;
    onSort: (v: SortOption) => void;
}

/**
 * Sort-by dropdown rendered in the results toolbar.
 *
 * React.memo: Prevents re-render when filters change but sort hasn't.
 * useDropdownOutsideClick encapsulates the outside-click pattern.
 */
export const SortDropdown = React.memo(({ sortBy, onSort }: Props) => {
    const [open, setOpen] = React.useState(false);
    const ref = useDropdownOutsideClick(setOpen);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#2c3e5e] hover:border-gray-300 shadow-sm transition-all"
            >
                <ArrowUpDown className="w-4 h-4" />
                Sort By
                {sortBy !== 'default' && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND }} />
                )}
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden w-52">
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { onSort(opt.value); setOpen(false); }}
                            className="w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between hover:bg-gray-50"
                            style={sortBy === opt.value ? { color: BRAND, fontWeight: 700 } : { color: '#374151' }}
                        >
                            {opt.label}
                            {sortBy === opt.value && <Check className="w-3.5 h-3.5" style={{ color: BRAND }} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

SortDropdown.displayName = 'SortDropdown';
