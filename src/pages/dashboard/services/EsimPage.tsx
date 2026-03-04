import { useEffect, useState, useMemo } from 'react';
import {
    Search,
    ChevronDown,
    RefreshCw,
    Globe,
    Wifi,
    Check,
    XCircle,
    Signal,
    Clock,
    Zap,
    ShoppingCart,
    X,
    Phone,
    MessageSquare,
    Radio,
    Globe2,
    Rocket,
    Filter,
} from 'lucide-react';
import { useESimStore } from '../../../stores/esim-store';
import type { ESimCountry, ESimOffering } from '../../../services/esim-service';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type OfferType = 'all' | 'data' | 'sms' | 'call';

function formatData(data: number, unit: string): string {
    return `${data} ${unit}`;
}

function getDataColor(data: number): string {
    if (data < 5) return '#6366f1';
    if (data < 15) return '#0ea5e9';
    if (data < 50) return '#10b981';
    return '#f59e0b';
}

function stripHtml(html: string): string {
    return html
        .replace(/<\/?(p|li|ul|br)[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function isDataOnly(o: ESimOffering): boolean {
    return !o.call_minutes && !o.texts;
}

function hasCalls(o: ESimOffering): boolean {
    return !!(o.call_minutes && o.call_minutes > 0) || !!(o.texts && o.texts > 0);
}

// ─── Coming Soon Modal ────────────────────────────────────────────────────────

const ComingSoonModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-gradient-to-br from-[#2c3e5e] to-[#1a263b] p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4 text-white" />
                </button>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Coming Soon!</h3>
                <p className="text-white/60 text-sm mt-1">eSIM purchase is almost here</p>
            </div>
            <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    We're putting the finishing touches on eSIM checkout.
                    Stay tuned — you'll be able to purchase and activate instantly very soon!
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 bg-[#2c3e5e] text-white rounded-2xl font-bold hover:bg-[#1a263b] transition-all"
                >
                    Got it
                </button>
            </div>
        </div>
    </div>
);

// ─── Plan Details Panel ───────────────────────────────────────────────────────

interface DetailsPanelProps {
    offering: ESimOffering;
    country: ESimCountry;
    onBuyNow: () => void;
    onClose: () => void;
}

const DetailsPanel = ({ offering, country, onBuyNow, onClose }: DetailsPanelProps) => {
    const [showFullDesc, setShowFullDesc] = useState(false);
    const pricing = offering.product_offering_pricing[0];
    const color = getDataColor(offering.data);
    const plainDesc = offering.description ? stripHtml(offering.description) : null;
    const descPreview = plainDesc ? plainDesc.slice(0, 220) : null;
    const hasMoreDesc = plainDesc && plainDesc.length > 220;

    const networkLabel = offering.network_speed?.alias
        ?.replace('NETWORK_', '')
        ?.replace('_', '/') ?? 'LTE';

    return (
        <div className="bg-white rounded-2xl border-2 border-[#2c3e5e] shadow-lg shadow-[#2c3e5e]/10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#2c3e5e] to-[#1a263b] p-5 text-white">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
                <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-xs font-black mb-3"
                    style={{ backgroundColor: color }}
                >
                    <Signal className="w-3 h-3" />
                    {formatData(offering.data, offering.data_unit)}
                </div>
                <h3 className="font-bold text-base leading-tight pr-6">{offering.name}</h3>
                <p className="text-white/50 text-xs mt-1">
                    {offering.mvno.alias} · {country.english_name}
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                <div className="p-3 text-center">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Validity
                    </p>
                    <p className="font-black text-[#2c3e5e] text-sm">{offering.bundle_validity} days</p>
                </div>
                <div className="p-3 text-center">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> Speed
                    </p>
                    <p className="font-black text-[#2c3e5e] text-sm">{networkLabel}</p>
                </div>
                <div className="p-3 text-center">
                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                        <Globe2 className="w-2.5 h-2.5" /> Roaming
                    </p>
                    <p className="font-black text-sm" style={{ color: offering.roaming ? '#10b981' : '#ef4444' }}>
                        {offering.roaming ? 'Yes' : 'No'}
                    </p>
                </div>
            </div>

            {/* Features */}
            <div className="px-4 py-3 space-y-2 border-b border-gray-100">
                {(offering.call_minutes ?? 0) > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Phone className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span>
                            {offering.calls_international
                                ? `${offering.call_minutes_international ?? offering.call_minutes} intl. minutes`
                                : `${offering.call_minutes} local minutes`}
                        </span>
                    </div>
                )}
                {(offering.texts ?? 0) > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <span>{offering.texts} SMS included</span>
                    </div>
                )}
                {isDataOnly(offering) && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Radio className="w-3.5 h-3.5 text-purple-500" />
                        </div>
                        <span>Data only (VoIP apps supported)</span>
                    </div>
                )}
            </div>

            {/* Description */}
            {descPreview && (
                <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">About this plan</p>
                    <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                        {showFullDesc ? plainDesc : descPreview}
                        {hasMoreDesc && !showFullDesc && '…'}
                    </p>
                    {hasMoreDesc && (
                        <button
                            onClick={() => setShowFullDesc(v => !v)}
                            className="text-[10px] font-bold text-[#2c3e5e] mt-1 hover:underline"
                        >
                            {showFullDesc ? 'Show less' : 'Read more'}
                        </button>
                    )}
                </div>
            )}

            {/* Price + CTA */}
            <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total</p>
                        <p className="text-2xl font-black text-[#2c3e5e]">
                            ₦{pricing?.naira_price?.toLocaleString('en-NG') ?? '—'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400">${pricing?.total_price_net?.toFixed(2) ?? '—'} USD</p>
                        <p className="text-[10px] text-gray-300">excl. local taxes</p>
                    </div>
                </div>
                <button
                    onClick={onBuyNow}
                    className="w-full py-3.5 bg-[#2c3e5e] text-white rounded-2xl font-bold text-sm hover:bg-[#1a263b] transition-all shadow-md shadow-[#2c3e5e]/20 flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now
                </button>
            </div>
        </div>
    );
};

// ─── Plan Card ────────────────────────────────────────────────────────────────

interface PlanCardProps {
    offering: ESimOffering;
    isSelected: boolean;
    onClick: () => void;
}

const PlanCard = ({ offering, isSelected, onClick }: PlanCardProps) => {
    const pricing = offering.product_offering_pricing[0];
    const color = getDataColor(offering.data);

    return (
        <button
            onClick={onClick}
            className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 group overflow-hidden ${isSelected
                ? 'border-[#2c3e5e] bg-[#2c3e5e]/5 shadow-lg shadow-[#2c3e5e]/10'
                : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
        >
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl opacity-80" style={{ backgroundColor: color }} />

            <div className="flex items-start justify-between mb-4 mt-1">
                <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-black"
                    style={{ backgroundColor: color }}
                >
                    <Signal className="w-3.5 h-3.5" />
                    {formatData(offering.data, offering.data_unit)}
                </div>
                {isSelected && (
                    <div className="w-6 h-6 bg-[#2c3e5e] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                )}
            </div>

            <p className="font-bold text-[#2c3e5e] text-sm leading-tight mb-3 pr-2">{offering.name}</p>

            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {offering.bundle_validity}d
                </span>
                <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {offering.mvno.alias}
                </span>
                {offering.roaming && (
                    <span className="flex items-center gap-1 text-green-600">
                        <Globe2 className="w-3 h-3" />
                        Roaming
                    </span>
                )}
            </div>

            <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price</p>
                    <p className="text-xl font-black text-[#2c3e5e]">
                        ₦{pricing?.naira_price?.toLocaleString('en-NG', { minimumFractionDigits: 0 }) ?? '—'}
                    </p>
                </div>
                <p className="text-[10px] text-gray-400">${pricing?.total_price_net?.toFixed(2) ?? '—'} USD</p>
            </div>
        </button>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const EsimPage = () => {
    const {
        countries,
        offerings,
        loadingCountries,
        loadingOfferings,
        error,
        purchaseSuccess,
        fetchCountries,
        fetchOfferings,
        clearMessages,
    } = useESimStore();

    const [selectedCountry, setSelectedCountry] = useState<ESimCountry | null>(null);
    const [selectedOffering, setSelectedOffering] = useState<ESimOffering | null>(null);
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [offerType, setOfferType] = useState<OfferType>('all');

    const [countrySearch, setCountrySearch] = useState('');
    const [planSearch, setPlanSearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    useEffect(() => {
        fetchCountries();
        return () => { clearMessages(); };
    }, [fetchCountries, clearMessages]);

    useEffect(() => {
        if (selectedCountry) {
            fetchOfferings(selectedCountry.id);
            setSelectedOffering(null);
        }
    }, [selectedCountry, fetchOfferings]);

    const filteredCountries = useMemo(() =>
        countries
            .filter(c => c.has_active_offerings)
            .filter(c =>
                c.english_name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                c.id.toLowerCase().includes(countrySearch.toLowerCase())
            ),
        [countries, countrySearch]
    );

    const filteredOfferings = useMemo(() => {
        let list = offerings;

        // Type filter
        if (offerType === 'data') list = list.filter(o => isDataOnly(o));
        if (offerType === 'call') list = list.filter(o => !!(o.call_minutes && o.call_minutes > 0));
        if (offerType === 'sms') list = list.filter(o => !!(o.texts && o.texts > 0));

        // Text search
        if (planSearch) {
            const q = planSearch.toLowerCase();
            list = list.filter(o =>
                o.name.toLowerCase().includes(q) ||
                o.mvno.alias.toLowerCase().includes(q)
            );
        }

        return list;
    }, [offerings, offerType, planSearch]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4">
            {/* ── Header ── */}
            <div>
                <h1 className="text-2xl font-bold text-[#2c3e5e] flex items-center gap-2">
                    <Wifi className="w-6 h-6" />
                    Buy eSIM
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Browse global data plans powered by Sim Local — activate instantly on any eSIM-compatible device.
                </p>
            </div>

            {/* ── Alerts ── */}
            {purchaseSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-700 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-100 p-1 rounded-full flex-shrink-0 mt-0.5"><Check className="w-4 h-4" /></div>
                    <p className="font-medium">{purchaseSuccess}</p>
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                    <div className="bg-red-100 p-1 rounded-full flex-shrink-0 mt-0.5"><XCircle className="w-4 h-4" /></div>
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ── LEFT: Country + Details ── */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Country selector */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <label className="block text-sm font-bold text-[#2c3e5e] mb-3">
                            1. Choose Destination
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => !loadingCountries && setShowCountryDropdown(v => !v)}
                                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-left transition-all flex items-center justify-between ${showCountryDropdown
                                    ? 'border-[#2c3e5e] ring-4 ring-[#2c3e5e]/5'
                                    : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {loadingCountries
                                        ? <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                                        : <Globe className={`w-5 h-5 ${selectedCountry ? 'text-[#2c3e5e]' : 'text-gray-400'}`} />
                                    }
                                    <span className={selectedCountry ? 'text-[#2c3e5e] font-semibold' : 'text-gray-400'}>
                                        {selectedCountry ? selectedCountry.english_name : 'Select destination country'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showCountryDropdown && (
                                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-3 border-b border-gray-50">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#2c3e5e] outline-none"
                                                placeholder="Search countries…"
                                                value={countrySearch}
                                                onChange={e => setCountrySearch(e.target.value)}
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
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setShowCountryDropdown(false);
                                                        setCountrySearch('');
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-semibold text-[#2c3e5e] text-sm">{country.english_name}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{country.id}</p>
                                                    </div>
                                                    {selectedCountry?.id === country.id && <Check className="w-4 h-4 text-[#2c3e5e]" />}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Country summary */}
                        {selectedCountry && !selectedOffering && (
                            <div className="mt-4 p-4 bg-gradient-to-br from-[#2c3e5e]/5 to-[#2c3e5e]/10 rounded-2xl border border-[#2c3e5e]/10 animate-in fade-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#2c3e5e] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2c3e5e]">{selectedCountry.english_name}</p>
                                        <p className="text-xs text-gray-500">{offerings.length} plan{offerings.length !== 1 ? 's' : ''} available</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Full Details Panel (when offer selected) ── */}
                    {selectedOffering && selectedCountry && (
                        <DetailsPanel
                            offering={selectedOffering}
                            country={selectedCountry}
                            onBuyNow={() => setShowComingSoon(true)}
                            onClose={() => setSelectedOffering(null)}
                        />
                    )}
                </div>

                {/* ── RIGHT: Filter + Plans Grid ── */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[500px] flex flex-col overflow-hidden">
                        {selectedCountry ? (
                            <>
                                {/* Header row: title + type filter + search */}
                                <div className="p-5 border-b border-gray-100 bg-gray-50/30 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <div className="flex-1">
                                            <h2 className="font-bold text-[#2c3e5e]">
                                                Available Plans
                                                {!loadingOfferings && filteredOfferings.length > 0 && (
                                                    <span className="ml-2 px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-500 uppercase font-bold">
                                                        {filteredOfferings.length}
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-xs text-gray-400 mt-0.5">{selectedCountry.english_name}</p>
                                        </div>
                                        {offerings.length > 0 && (
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2c3e5e] focus:border-transparent outline-none w-full sm:w-48"
                                                    placeholder="Filter plans…"
                                                    value={planSearch}
                                                    onChange={e => setPlanSearch(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Type filter */}
                                    {offerings.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <div className="flex gap-2 flex-wrap">
                                                {(
                                                    [
                                                        { value: 'all', label: 'All Offers' },
                                                        { value: 'data', label: 'Data Only' },
                                                        { value: 'call', label: 'Voice Call Only' },
                                                        { value: 'sms', label: 'SMS Only' },
                                                    ] as const
                                                ).map(opt => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setOfferType(opt.value)}
                                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${offerType === opt.value
                                                            ? 'bg-[#2c3e5e] text-white border-[#2c3e5e]'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Plans grid */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    {loadingOfferings ? (
                                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
                                            <RefreshCw className="w-8 h-8 animate-spin text-[#2c3e5e]" />
                                            <p className="font-medium text-sm">Fetching available plans…</p>
                                        </div>
                                    ) : filteredOfferings.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {filteredOfferings.map(offering => (
                                                <PlanCard
                                                    key={offering.id}
                                                    offering={offering}
                                                    isSelected={selectedOffering?.id === offering.id}
                                                    onClick={() =>
                                                        setSelectedOffering(prev =>
                                                            prev?.id === offering.id ? null : offering
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Wifi className="w-8 h-8 text-gray-200" />
                                            </div>
                                            <p className="font-bold text-gray-600">No plans found</p>
                                            <p className="text-sm max-w-xs">
                                                {planSearch || offerType !== 'all'
                                                    ? 'Try a different filter or search term.'
                                                    : 'No eSIM plans are currently available for this destination.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Empty state */
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#2c3e5e]/10 to-[#2c3e5e]/5 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                                    <Wifi className="w-12 h-12 text-[#2c3e5e]/25" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2c3e5e] mb-2">Pick a Destination</h3>
                                <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                                    Select a country on the left to browse all available eSIM data plans for that destination.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {['US', 'GB', 'AE', 'NG', 'DE', 'FR'].map(code => {
                                        const c = countries.find(x => x.id === code);
                                        return c ? (
                                            <button
                                                key={code}
                                                onClick={() => setSelectedCountry(c)}
                                                className="px-3 py-1.5 bg-[#2c3e5e]/5 hover:bg-[#2c3e5e]/10 text-[#2c3e5e] text-xs font-bold rounded-lg transition-colors"
                                            >
                                                {c.english_name}
                                            </button>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Coming Soon Modal ── */}
            {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}
        </div>
    );
};
