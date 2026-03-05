/**
 * EsimPage — Orchestrator component (thin shell).
 *
 * All complex logic lives in:
 *   - useESimFilters hook  (filter/sort state + memoised computation)
 *   - Component files       (PlanCard, FilterSidebar, etc.)
 *   - esim-helpers utils    (pure data transforms)
 *
 * This page only manages:
 *   1. Country selection state
 *   2. Data fetching effects
 *   3. Modal visibility flags
 *   4. Layout composition
 */

import { useEffect, useState, useCallback } from 'react';
import { Wifi, RefreshCw, Globe, Check, XCircle, SlidersHorizontal } from 'lucide-react';
import { useESimStore } from '../../../stores/esim-store';
import { useESimFilters } from '../../../hooks/use-esim-filters';
import { BRAND } from '../../../components/esim/constants';
import {
    ComingSoonModal,
    DetailDrawer,
    PlanCard,
    FilterSidebar,
    CountrySelector,
    SortDropdown,
} from '../../../components/esim';
import type { ESimCountry, ESimOffering } from '../../../services/esim-service';

export const EsimPage = () => {
    // ── Store (global server state) ───────────────────────────────────────
    const {
        countries, offerings, loadingCountries, loadingOfferings, error,
        purchaseSuccess, fetchCountries, fetchOfferings, clearMessages,
    } = useESimStore();

    // ── Local UI state ────────────────────────────────────────────────────
    const [selectedCountry, setSelectedCountry] = useState<ESimCountry | null>(null);
    const [selectedOffering, setSelectedOffering] = useState<ESimOffering | null>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // ── Filter/sort logic (custom hook) ───────────────────────────────────
    const filters = useESimFilters(offerings);

    // ── Effects ───────────────────────────────────────────────────────────

    useEffect(() => {
        fetchCountries();
        return () => { clearMessages(); };
    }, [fetchCountries, clearMessages]);

    useEffect(() => {
        if (selectedCountry) {
            fetchOfferings(selectedCountry.id);
            filters.resetFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCountry, fetchOfferings]);

    // ── Stable callbacks for memoised children ────────────────────────────

    const handleCountrySelect = useCallback((country: ESimCountry) => {
        setSelectedCountry(country);
    }, []);

    const handleMoreInfo = useCallback((offering: ESimOffering) => {
        setSelectedOffering(offering);
        setShowDetail(true);
    }, []);

    const handleBuyNow = useCallback(() => {
        setShowComingSoon(true);
    }, []);

    const handleDetailBuyNow = useCallback(() => {
        setShowDetail(false);
        setShowComingSoon(true);
    }, []);

    const handleDetailClose = useCallback(() => {
        setShowDetail(false);
    }, []);

    const handleComingSoonClose = useCallback(() => {
        setShowComingSoon(false);
    }, []);

    const handleMobileFiltersClose = useCallback(() => {
        setMobileFiltersOpen(false);
    }, []);

    // ── Derived flags ─────────────────────────────────────────────────────
    const showFilters = !loadingOfferings && offerings.length > 0 && selectedCountry !== null;

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-5">
            {/* Page header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#2c3e5e] flex items-center gap-2">
                    <Wifi className="w-5 h-5 sm:w-6 sm:h-6" />
                    Buy eSIM
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Browse global data plans — activate instantly on any eSIM-compatible device.
                </p>
            </div>

            {/* Alerts */}
            {purchaseSuccess && (
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-green-700 flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="font-medium">{purchaseSuccess}</p>
                </div>
            )}
            {error && (
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-red-700 flex items-start gap-2 sm:gap-3">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Country selector */}
            <CountrySelector
                countries={countries}
                selectedCountry={selectedCountry}
                loadingCountries={loadingCountries}
                onSelect={handleCountrySelect}
            />

            {/* Loading */}
            {selectedCountry && loadingOfferings && (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-gray-400 gap-3">
                    <RefreshCw className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" style={{ color: BRAND }} />
                    <p className="font-medium text-xs sm:text-sm">Fetching plans for {selectedCountry.english_name}…</p>
                </div>
            )}

            {/* Plans layout: sidebar + grid */}
            {selectedCountry && !loadingOfferings && (
                <div className="flex gap-5 items-start">
                    {/* Sidebar (desktop only rendered here; mobile drawer is handled inside FilterSidebar) */}
                    {showFilters && (
                        <FilterSidebar
                            availableMvnos={filters.availableMvnos}
                            selectedMvnos={filters.selectedMvnos}
                            offerType={filters.offerType}
                            speedFilter={filters.speedFilter}
                            has4g={filters.has4g}
                            has5g={filters.has5g}
                            hasActiveFilter={filters.hasActiveFilter}
                            onToggleMvno={filters.toggleMvno}
                            onOfferType={filters.setOfferType}
                            onSpeedFilter={filters.setSpeedFilter}
                            onReset={filters.resetFilters}
                            isMobileOpen={mobileFiltersOpen}
                            onMobileClose={handleMobileFiltersClose}
                        />
                    )}

                    {/* Results */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        {offerings.length > 0 && (
                            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                                {/* Mobile filter toggle */}
                                <button
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#2c3e5e] hover:border-gray-300 shadow-sm transition-all flex-shrink-0"
                                >
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                    Filter
                                    {filters.hasActiveFilter && (
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND }} />
                                    )}
                                </button>

                                <p className="text-xs sm:text-sm text-gray-500 flex-1 min-w-0 truncate">
                                    <span className="font-bold text-[#2c3e5e]">{filters.filteredOfferings.length}</span>{' '}
                                    plan{filters.filteredOfferings.length !== 1 ? 's' : ''} for{' '}
                                    <span className="font-bold text-[#2c3e5e]">{selectedCountry.english_name}</span>
                                </p>
                                <SortDropdown sortBy={filters.sortBy} onSort={filters.setSortBy} />
                            </div>
                        )}

                        {/* Grid — single column on mobile, 2 on tablet, 3 on desktop */}
                        {filters.filteredOfferings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                                {filters.filteredOfferings.map(offering => (
                                    <PlanCard
                                        key={offering.id}
                                        offering={offering}
                                        country={selectedCountry}
                                        onMoreInfo={() => handleMoreInfo(offering)}
                                        onBuyNow={handleBuyNow}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-white rounded-2xl border border-gray-200 shadow-sm px-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Wifi className="w-8 h-8 sm:w-10 sm:h-10 text-gray-200" />
                                </div>
                                <p className="font-bold text-gray-600 text-base sm:text-lg">No plans found</p>
                                <p className="text-gray-400 text-xs sm:text-sm max-w-xs mt-1">
                                    {filters.hasActiveFilter
                                        ? 'Try adjusting or resetting your filters.'
                                        : 'No eSIM plans are available for this destination.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!selectedCountry && (
                <div className="flex flex-col items-center justify-center py-14 sm:py-20 text-center bg-white rounded-2xl border border-gray-200 px-4">
                    <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-6"
                        style={{ background: `linear-gradient(135deg, ${BRAND}18, ${BRAND}08)` }}
                    >
                        <Globe className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: `${BRAND}50` }} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2c3e5e] mb-2">Pick a Destination</h3>
                    <p className="text-gray-400 max-w-sm text-xs sm:text-sm leading-relaxed">
                        Select a country above to browse all available eSIM plans for that destination.
                    </p>
                </div>
            )}

            {/* Modals */}
            {showDetail && selectedOffering && selectedCountry && (
                <DetailDrawer
                    offering={selectedOffering}
                    country={selectedCountry}
                    onBuyNow={handleDetailBuyNow}
                    onClose={handleDetailClose}
                />
            )}
            {showComingSoon && <ComingSoonModal onClose={handleComingSoonClose} />}
        </div>
    );
};
