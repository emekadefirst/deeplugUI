import { useState, useMemo, useCallback } from 'react';
import type { ESimOffering } from '../services/esim-service';
import type { OfferType, SpeedFilter, SortOption } from '../components/esim/constants';
import { isDataOnly } from '../utils/esim-helpers';

/**
 * Custom hook encapsulating ALL filter, sort, and derived-state logic
 * for the eSIM offerings list.
 *
 * WHY: Keeps the EsimPage component "dumb" — it only wires state to UI.
 * The filtering / sorting computations are memoised here to avoid
 * recalculating on unrelated state changes (e.g. modal open/close).
 */
export function useESimFilters(offerings: ESimOffering[]) {
    // ── Filter state ──────────────────────────────────────────────────────
    const [selectedMvnos, setSelectedMvnos] = useState<Set<string>>(new Set());
    const [offerType, setOfferType] = useState<OfferType>('all');
    const [speedFilter, setSpeedFilter] = useState<SpeedFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('default');

    // ── Derived data (memoised to skip recalc when offerings reference is stable) ──

    /** Unique MVNO providers from the current offerings list */
    const availableMvnos = useMemo(() => {
        const map = new Map<string, string>();
        offerings.forEach(o => map.set(o.mvno.id, o.mvno.alias));
        return Array.from(map.entries()).map(([id, alias]) => ({ id, alias }));
    }, [offerings]);

    /** Speed capability flags */
    const { has4g, has5g } = useMemo(() => ({
        has4g: offerings.some(o => o.network_speed?.alias.includes('4G')),
        has5g: offerings.some(o => o.network_speed?.alias.includes('5G')),
    }), [offerings]);

    /** Whether any filter is currently active */
    const hasActiveFilter = selectedMvnos.size > 0 || offerType !== 'all' || speedFilter !== 'all';

    /**
     * The final filtered + sorted list.
     * useMemo prevents re-filtering when only unrelated state (e.g. modal) changes.
     */
    const filteredOfferings = useMemo(() => {
        let list = [...offerings];

        // MVNO filter
        if (selectedMvnos.size > 0) {
            list = list.filter(o => selectedMvnos.has(o.mvno.id));
        }

        // Plan type filter
        if (offerType === 'data') list = list.filter(isDataOnly);
        if (offerType === 'calls_sms') list = list.filter(o => !isDataOnly(o));

        // Speed filter
        if (speedFilter === '4g') list = list.filter(o => o.network_speed?.alias.includes('4G'));
        if (speedFilter === '5g') list = list.filter(o => o.network_speed?.alias.includes('5G'));

        // Sorting
        const getPrice = (o: ESimOffering) => o.product_offering_pricing[0]?.total_price_net ?? 0;
        const getData = (o: ESimOffering) => (o.data === -1 ? 9999 : o.data);

        switch (sortBy) {
            case 'price_asc': list.sort((a, b) => getPrice(a) - getPrice(b)); break;
            case 'price_desc': list.sort((a, b) => getPrice(b) - getPrice(a)); break;
            case 'data_asc': list.sort((a, b) => getData(a) - getData(b)); break;
            case 'data_desc': list.sort((a, b) => getData(b) - getData(a)); break;
        }

        return list;
    }, [offerings, selectedMvnos, offerType, speedFilter, sortBy]);

    // ── Callbacks (stable identity for child components) ──────────────────

    /** Toggle an MVNO provider on/off. useCallback keeps PlanCard memo stable. */
    const toggleMvno = useCallback((id: string) => {
        setSelectedMvnos(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    /** Reset all filters to default values */
    const resetFilters = useCallback(() => {
        setSelectedMvnos(new Set());
        setOfferType('all');
        setSpeedFilter('all');
        setSortBy('default');
    }, []);

    return {
        // State
        selectedMvnos,
        offerType,
        speedFilter,
        sortBy,
        hasActiveFilter,

        // Derived
        availableMvnos,
        has4g,
        has5g,
        filteredOfferings,

        // Setters
        setOfferType,
        setSpeedFilter,
        setSortBy,

        // Callbacks
        toggleMvno,
        resetFilters,
    };
}
