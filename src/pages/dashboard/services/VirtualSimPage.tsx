/**
 * VirtualSimPage — Orchestrator for the VSim service.
 * 
 * Uses useVSimStore for global data/actions.
 * Components are decomposed into src/components/vsim/.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { RefreshCw, Phone, Globe, Smartphone, Check, XCircle, ArrowRight } from 'lucide-react';
import { useVSimStore } from '../../../stores/vsim-store';
import { VSimCountrySelector, VSimTypePicker, VSimNumberCard } from '../../../components/vsim';
import type { VSimCountry, VSimPhoneNumber, VSimNumberType, VSIMOrder } from '../../../services/vsim-service';
import { SEO } from '../../../components/SEO';

export const VirtualSimPage = () => {
    const {
        countries,
        fetchCountries,
        loadingDetails,
        numbers,
        loadingNumbers,
        fetchNumbers,
        resetNumbers,
        error,
        purchaseNumber,
        purchaseSuccess,
        clearMessages,
        hasMore,
        loadMoreNumbers
    } = useVSimStore();

    // Form state
    const [selectedCountry, setSelectedCountry] = useState<VSimCountry | null>(null);
    const [selectedType, setSelectedType] = useState<VSimNumberType>('Local');
    const [selectedNumber, setSelectedNumber] = useState<VSimPhoneNumber | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');

    // Initial load
    useEffect(() => {
        fetchCountries();
        return () => { clearMessages(); };
    }, [fetchCountries, clearMessages]);

    // Fetch numbers on selection change
    useEffect(() => {
        if (selectedCountry?.country_code) {
            fetchNumbers(selectedCountry.country_code, selectedType);
            setSelectedNumber(null);
        } else {
            resetNumbers();
        }
    }, [selectedCountry, selectedType, fetchNumbers, resetNumbers]);

    // Callbacks
    const handlePurchase = useCallback(async () => {
        if (!selectedNumber || !selectedCountry) return;

        setIsPurchasing(true);
        const orderData: VSIMOrder = {
            phone_number: selectedNumber.phone_number,
            amount: selectedNumber.price || 0,
            type: [selectedType],
            detail: `Purchase of ${selectedType} number for ${selectedCountry.country}`
        };

        try {
            const success = await purchaseNumber(orderData);
            if (success) {
                setSelectedNumber(null);
            }
        } finally {
            setIsPurchasing(false);
        }
    }, [selectedNumber, selectedCountry, selectedType, purchaseNumber]);

    const handleCountrySelect = useCallback((country: VSimCountry) => {
        setSelectedCountry(country);
    }, []);

    const handleTypeSelect = useCallback((type: VSimNumberType) => {
        setSelectedType(type);
    }, []);

    const handleNumberSelect = useCallback((number: VSimPhoneNumber) => {
        setSelectedNumber(number);
    }, []);

    // Derived
    const filteredCountries = useMemo(() =>
        countries.filter(
            (country) =>
                country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
                country.country_code.toLowerCase().includes(countrySearch.toLowerCase())
        ), [countries, countrySearch]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 px-3 sm:px-4">
            <SEO title="Virtual SIM" description="Get a dedicated global number for secure calls and SMS." />
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#2c3e5e]">Virtual SIM</h1>
                    <p className="text-gray-500 text-sm mt-1">Get a dedicated global number for calls and SMS.</p>
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard/services/virtual-sim/communications'}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#2c3e5e] text-white font-black rounded-2xl hover:bg-[#1a263b] transition-all shadow-lg shadow-[#2c3e5e]/10 group text-sm"
                >
                    <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Communications Log
                </button>
            </div>

            {/* Alerts */}
            {purchaseSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-700 flex items-center gap-3 animate-slide-up">
                    <Check className="w-4 h-4 text-green-600" />
                    <p className="font-bold">{purchaseSuccess}</p>
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center gap-3 animate-slide-up">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Selection Sidebar */}
                <aside className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-sm space-y-7">
                        <VSimCountrySelector
                            countries={filteredCountries}
                            selected={selectedCountry}
                            search={countrySearch}
                            loading={loadingDetails}
                            onSearch={setCountrySearch}
                            onSelect={handleCountrySelect}
                        />

                        {selectedCountry && (
                            <div className="animate-fade-in">
                                <VSimTypePicker
                                    selected={selectedType}
                                    onSelect={handleTypeSelect}
                                />
                            </div>
                        )}

                        {!selectedCountry && (
                            <div className="p-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                                <Globe className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select a country to continue</p>
                            </div>
                        )}
                    </div>

                    {/* How to use info */}
                    <div className="hidden lg:block bg-gradient-to-br from-[#2c3e5e] to-[#1a263b] rounded-3xl p-7 text-white shadow-xl">
                        <h4 className="font-black text-sm uppercase tracking-widest mb-4 opacity-60">Global Presence</h4>
                        <p className="text-sm font-bold leading-relaxed mb-4">Secure a local identity anywhere in the world. Perfect for business or privacy.</p>
                        <div className="flex items-center gap-2 text-xs font-black opacity-80">
                            <Check className="w-4 h-4 text-green-400" /> Instant Activation
                        </div>
                        <div className="flex items-center gap-2 text-xs font-black opacity-80 mt-2">
                            <Check className="w-4 h-4 text-green-400" /> Monthly Renewal
                        </div>
                    </div>
                </aside>

                {/* Main Results Area */}
                <main className="lg:col-span-8">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm min-h-[600px] flex flex-col overflow-hidden">
                        {selectedCountry ? (
                            <>
                                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                    <h2 className="font-black text-[#2c3e5e] flex items-center gap-3">
                                        <Smartphone className="w-5 h-5" />
                                        Available {selectedType} Numbers
                                        <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-tighter shadow-sm">
                                            {selectedCountry.country_code}
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex-1 p-6 sm:p-8">
                                    {loadingNumbers && numbers.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center py-24 text-gray-400">
                                            <RefreshCw className="w-10 h-10 animate-spin mb-4 text-[#2c3e5e]" />
                                            <p className="font-black text-sm uppercase tracking-widest">Searching Global Inventory...</p>
                                        </div>
                                    ) : numbers.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {numbers.map((number) => (
                                                <VSimNumberCard
                                                    key={number.phone_number}
                                                    number={number}
                                                    selected={selectedNumber?.phone_number === number.phone_number}
                                                    onSelect={handleNumberSelect}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center py-20 text-center text-gray-400">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
                                                <XCircle className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <p className="font-black text-[#2c3e5e] text-lg uppercase tracking-tight">Out of Stock</p>
                                            <p className="text-sm max-w-xs mx-auto mt-2 leading-relaxed font-medium">No {selectedType} numbers are available for {selectedCountry.country} at the moment. Please try another type or destination.</p>
                                        </div>
                                    )}

                                    {hasMore && (
                                        <button
                                            onClick={() => loadMoreNumbers()}
                                            disabled={loadingNumbers}
                                            className="w-full mt-8 py-4 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-black text-xs uppercase tracking-widest hover:border-[#2c3e5e]/20 hover:text-[#2c3e5e] transition-all flex items-center justify-center gap-3"
                                        >
                                            {loadingNumbers ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
                                                <>Explore More Numbers <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Purchase Bar (Sticky at bottom if selected) */}
                                {selectedNumber && (
                                    <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-100 animate-slide-up">
                                        <div className="max-w-md mx-auto">
                                            <button
                                                onClick={handlePurchase}
                                                disabled={isPurchasing}
                                                className="w-full py-4 bg-[#2c3e5e] text-white rounded-[1.5rem] font-black text-lg hover:bg-[#1a263b] transition-all shadow-2xl shadow-[#2c3e5e]/30 flex items-center justify-center gap-3 disabled:opacity-70 group"
                                            >
                                                {isPurchasing ? (
                                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <>
                                                        Reserve {selectedNumber.friendly_name}
                                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest leading-none">
                                                Recurring monthly billing applies.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400">
                                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                                    <Globe className="w-12 h-12 text-gray-100" />
                                </div>
                                <h3 className="text-xl font-black text-[#2c3e5e] uppercase tracking-tight mb-2">Global Connectivity</h3>
                                <p className="text-sm max-w-sm font-medium leading-relaxed">Select a destination and number type to browse our live inventory of secure virtual identity lines.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};