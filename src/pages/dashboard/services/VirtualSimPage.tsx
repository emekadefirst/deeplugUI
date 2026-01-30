import { useEffect, useState, useMemo } from 'react';
import { Search, ChevronDown, RefreshCw, MapPin, Phone, Globe, Smartphone, Check, Flag, XCircle } from 'lucide-react';
import { useVSimStore } from '../../../stores/vsim-store';
import type { VSimCountry, VSimPhoneNumber, VSimNumberType, VSIMOrder } from '../../../services/vsim-service';

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

    // Local purchasing state
    const [isPurchasing, setIsPurchasing] = useState(false);

    // Search states
    const [countrySearch, setCountrySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    // FIX TS(2554): Wrap the initialization in a stable manner
    useEffect(() => {
        const initPage = async () => {
            await fetchCountries();
        };
        initPage();

        return () => {
            clearMessages();
        };
    }, [fetchCountries, clearMessages]);

    // Fetch numbers when country or type changes
    useEffect(() => {
        if (selectedCountry?.country_code) {
            fetchNumbers(selectedCountry.country_code, selectedType);
            setSelectedNumber(null);
        } else {
            resetNumbers();
        }
    }, [selectedCountry, selectedType, fetchNumbers, resetNumbers]);

    const handlePurchase = async () => {
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
        } catch (err) {
            console.error("Purchase error:", err);
        } finally {
            setIsPurchasing(false);
        }
    };

    const filteredCountries = useMemo(() =>
        countries.filter(
            (country) =>
                country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
                country.country_code.toLowerCase().includes(countrySearch.toLowerCase())
        ), [countries, countrySearch]);

    const numberTypes: { id: VSimNumberType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { id: 'Local', label: 'Local', icon: MapPin },
        { id: 'Mobile', label: 'Mobile', icon: Smartphone },
        { id: 'TollFree', label: 'Toll Free', icon: Globe },
        { id: 'National', label: 'National', icon: Flag },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#2c3e5e]">Virtual SIM (eSIM)</h1>
                    <p className="text-gray-600">Secure a dedicated number for global communications</p>
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard/services/virtual-sim/communications'}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2c3e5e] text-white font-semibold rounded-xl hover:bg-[#1f2d42] transition-all shadow-lg shadow-[#2c3e5e]/20"
                >
                    <Phone className="w-4 h-4" />
                    SMS & Phone Logs
                </button>
            </div>

            {/* Notifications */}
            {purchaseSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-100 p-1 rounded-full"><Check className="w-4 h-4" /></div>
                    <span className="font-medium">{purchaseSuccess}</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <div className="bg-red-100 p-1 rounded-full"><XCircle className="w-4 h-4" /></div>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Selection Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#2c3e5e] mb-3">
                                    1. Choose Country
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => !loadingDetails && setShowCountryDropdown(!showCountryDropdown)}
                                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-left transition-all flex items-center justify-between ${showCountryDropdown ? 'border-[#2c3e5e] ring-4 ring-[#2c3e5e]/5' : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className={`w-5 h-5 ${selectedCountry ? 'text-[#2c3e5e]' : 'text-gray-400'}`} />
                                            <span className={selectedCountry ? 'text-[#2c3e5e] font-semibold' : 'text-gray-400'}>
                                                {selectedCountry ? `${selectedCountry.country}` : 'Select target country'}
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
                                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#2c3e5e]"
                                                        placeholder="Filter countries..."
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto">
                                                {filteredCountries.map((country) => (
                                                    <button
                                                        key={country.country_code}
                                                        onClick={() => {
                                                            setSelectedCountry(country);
                                                            setShowCountryDropdown(false);
                                                        }}
                                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                                                    >
                                                        <div>
                                                            <p className="font-semibold text-[#2c3e5e]">{country.country}</p>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">{country.country_code}</p>
                                                        </div>
                                                        {selectedCountry?.country_code === country.country_code && <Check className="w-4 h-4 text-[#2c3e5e]" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedCountry && (
                                <div className="pt-2 animate-in fade-in slide-in-from-left-2">
                                    <label className="block text-sm font-bold text-[#2c3e5e] mb-3">
                                        2. Select Number Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {numberTypes.map((type) => {
                                            const Icon = type.icon;
                                            const isActive = selectedType === type.id;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${isActive
                                                            ? 'border-[#2c3e5e] bg-[#2c3e5e]/5 text-[#2c3e5e]'
                                                            : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-200'
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5 mb-1" />
                                                    <span className="text-xs font-bold">{type.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Numbers Inventory */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[500px] flex flex-col overflow-hidden">
                        {selectedCountry ? (
                            <>
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                                    <h2 className="font-bold text-[#2c3e5e] flex items-center gap-2">
                                        Available {selectedType} Numbers
                                        <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-500 uppercase">
                                            {selectedCountry.country_code}
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex-1 p-6">
                                    {loadingNumbers && numbers.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-[#2c3e5e]" />
                                            <p className="font-medium">Searching our global inventory...</p>
                                        </div>
                                    ) : numbers.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {numbers.map((number) => (
                                                <button
                                                    key={number.phone_number}
                                                    onClick={() => setSelectedNumber(number)}
                                                    className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${selectedNumber?.phone_number === number.phone_number
                                                            ? 'border-[#2c3e5e] bg-[#2c3e5e]/5'
                                                            : 'border-gray-100 hover:border-gray-300 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                                            <Phone className="w-4 h-4 text-[#2c3e5e]" />
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Monthly</p>
                                                            <p className="font-black text-[#2c3e5e]">
                                                                {number.currency || '₦'}{Math.ceil(number.price || 0).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <p className="text-lg font-bold text-[#2c3e5e] mb-1 tracking-tight">
                                                        {number.friendly_name}
                                                    </p>

                                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                                        {number.capabilities && Object.entries(number.capabilities).map(([key, val]) =>
                                                            val && (
                                                                <span key={key} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[9px] font-bold text-gray-500 uppercase">
                                                                    {key}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Smartphone className="w-8 h-8 text-gray-200" />
                                            </div>
                                            <p className="font-bold text-gray-600">No {selectedType} numbers found</p>
                                            <p className="text-sm max-w-xs mx-auto">Try a different number type or select another country from the sidebar.</p>
                                        </div>
                                    )}

                                    {hasMore && (
                                        <button
                                            onClick={() => loadMoreNumbers()}
                                            disabled={loadingNumbers}
                                            className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:border-gray-300 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            {loadingNumbers ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Load More Numbers'}
                                        </button>
                                    )}
                                </div>

                                {selectedNumber && (
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-bottom-full">
                                        <button
                                            onClick={handlePurchase}
                                            disabled={isPurchasing}
                                            className="w-full py-4 bg-[#2c3e5e] text-white rounded-2xl font-bold text-lg hover:bg-[#1a263b] transition-all shadow-xl shadow-[#2c3e5e]/20 flex items-center justify-center gap-3 disabled:opacity-70"
                                        >
                                            {isPurchasing ? (
                                                <RefreshCw className="w-6 h-6 animate-spin" />
                                            ) : (
                                                `Buy ${selectedNumber.friendly_name}`
                                            )}
                                        </button>
                                        <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                                            By clicking, you agree to the Virtual SIM terms of service and recurring monthly billing.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-20 h-20 bg-[#2c3e5e]/5 rounded-3xl flex items-center justify-center mb-6">
                                    <Globe className="w-10 h-10 text-[#2c3e5e]/20" />
                                </div>
                                <h3 className="text-xl font-bold text-[#2c3e5e] mb-2">Global Connectivity Awaits</h3>
                                <p className="text-gray-500 max-w-sm">Select a country and number type from the left to browse our available digital communication lines.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};