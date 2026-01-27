import { useEffect, useState } from 'react';
import { Search, ChevronDown, RefreshCw, MapPin, Phone, Globe, Smartphone, Check, Flag } from 'lucide-react';
import { useVSimStore } from '../../../stores/vsim-store';
import type { VSimCountry, VSimPhoneNumber, VSimNumberType } from '../../../services/vsim-service';

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
    const [isPurchasing, ] = useState(false);

    // Search states
    const [countrySearch, setCountrySearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    useEffect(() => {
        fetchCountries();
        return () => clearMessages();
    }, [fetchCountries, clearMessages]);

    // Fetch numbers when country or type changes
    useEffect(() => {
        if (selectedCountry) {
            fetchNumbers(selectedCountry.country_code, selectedType);
            setSelectedNumber(null);
        } else {
            resetNumbers();
        }
    }, [selectedCountry, selectedType, fetchNumbers, resetNumbers]);

    const handlePurchase = async () => {
        if (!selectedNumber) return;
        const success = await purchaseNumber(selectedNumber.phone_number);
        if (success) {
            setTimeout(() => {
                setSelectedNumber(null);
                // Optionally navigate to orders page here
            }, 2000);
        }
    };

    const filteredCountries = countries.filter(
        (country) =>
            country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
            country.country_code.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const numberTypes: { id: VSimNumberType; label: string; icon: any }[] = [
        { id: 'Local', label: 'Local', icon: MapPin },
        { id: 'Mobile', label: 'Mobile', icon: Smartphone },
        { id: 'TollFree', label: 'Toll Free', icon: Globe },
        { id: 'National', label: 'National', icon: Flag },
    ];

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-[#2c3e5e]">Virtual SIM (eSIM)</h1>
                    <button
                        onClick={() => window.location.href = '/dashboard/services/virtual-sim/communications'}
                        className="px-4 py-2 bg-gray-100 text-[#2c3e5e] font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        Call & SMS Console
                    </button>
                </div>
                <p className="text-gray-600">Get a virtual SIM number for your calls and messages</p>
            </div>

            {purchaseSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {purchaseSuccess}
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Selection Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="space-y-6">
                            {/* Country Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                                    Select Country *
                                </label>
                                <div className="relative">
                                    <div
                                        onClick={() => !loadingDetails && setShowCountryDropdown(!showCountryDropdown)}
                                        className={`w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#2c3e5e] transition-colors flex items-center justify-between ${loadingDetails ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-[#2c3e5e]" />
                                            <span className={selectedCountry ? 'text-[#2c3e5e] font-medium' : 'text-gray-400'}>
                                                {selectedCountry ? `${selectedCountry.country} (${selectedCountry.country_code})` : 'Choose a country...'}
                                            </span>
                                        </div>
                                        {loadingDetails ? (
                                            <RefreshCw className="w-5 h-5 text-[#2c3e5e] animate-spin" />
                                        ) : (
                                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>

                                    {showCountryDropdown && !loadingDetails && (
                                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
                                            <div className="p-3 border-b border-gray-200">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search countries..."
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 focus:border-[#2c3e5e]"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCountries.map((country) => (
                                                    <div
                                                        key={country.country_code}
                                                        onClick={() => {
                                                            setSelectedCountry(country);
                                                            setShowCountryDropdown(false);
                                                            setCountrySearch('');
                                                        }}
                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                                    >
                                                        <p className="font-medium text-[#2c3e5e]">{country.country}</p>
                                                        <p className="text-xs text-gray-500">{country.country_code}</p>
                                                    </div>
                                                ))}
                                                {filteredCountries.length === 0 && (
                                                    <div className="px-4 py-8 text-center text-gray-400">
                                                        No countries found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Type Selection */}
                            {selectedCountry && (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                                        Number Type
                                    </label>
                                    <div className="space-y-2">
                                        {numberTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => setSelectedType(type.id)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${selectedType === type.id
                                                        ? 'border-[#2c3e5e] bg-[#2c3e5e]/5 text-[#2c3e5e]'
                                                        : 'border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <Icon className={`w-5 h-5 ${selectedType === type.id ? 'text-[#2c3e5e]' : 'text-gray-400'}`} />
                                                    <span className="font-medium">{type.label}</span>
                                                    {selectedType === type.id && (
                                                        <Check className="w-5 h-5 ml-auto text-[#2c3e5e]" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Numbers List */}
                <div className="lg:col-span-2">
                    {selectedCountry ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full min-h-[400px]">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-[#2c3e5e]">
                                    Available Numbers
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {selectedCountry.country} • {selectedType}
                                </span>
                            </div>

                            {loadingNumbers ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <RefreshCw className="w-8 h-8 animate-spin mb-4 text-[#2c3e5e]" />
                                    <p>Searching available numbers...</p>
                                </div>
                            ) : numbers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {numbers.map((number) => (
                                        <div
                                            key={number.phone_number}
                                            onClick={() => setSelectedNumber(number)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedNumber?.phone_number === number.phone_number
                                                ? 'border-[#2c3e5e] bg-[#2c3e5e]/5'
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Phone className={`w-4 h-4 ${selectedNumber?.phone_number === number.phone_number ? 'text-[#2c3e5e]' : 'text-gray-400'}`} />
                                                    <span className="font-bold text-lg text-[#2c3e5e]">
                                                        {number.friendly_name}
                                                    </span>
                                                </div>
                                                {selectedNumber?.phone_number === number.phone_number && (
                                                    <div className="w-5 h-5 bg-[#2c3e5e] rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                                                {number.locality && <span>{number.locality}</span>}
                                                {number.region && <span>• {number.region}</span>}
                                                {number.postal_code && <span>• {number.postal_code}</span>}
                                            </div>
                                            {number.capabilities && (
                                                <div className="mt-3 flex gap-2">
                                                    {Object.entries(number.capabilities).map(([key, value]) =>
                                                        value && (
                                                            <span key={key} className="px-2 py-1 bg-gray-100 rounded-md text-[10px] uppercase font-bold text-gray-600">
                                                                {key}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                            {number.price && (
                                                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">Monthly Fee</span>
                                                    <span className="font-bold text-[#2c3e5e]">
                                                        {number.currency || '₦'}{Math.ceil(number.price).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Smartphone className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-500 mb-1">
                                        {selectedType.replace(/([A-Z])/g, ' $1').trim()} numbers not found
                                    </p>
                                    <p className="text-sm">Try changing the number type or country</p>
                                </div>
                            )}

                            {hasMore && numbers.length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => selectedCountry && loadMoreNumbers(selectedCountry.country_code, selectedType)}
                                        disabled={loadingNumbers}
                                        className="px-6 py-2 bg-gray-100 text-[#2c3e5e] font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loadingNumbers ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            'View More'
                                        )}
                                    </button>
                                </div>
                            )}

                            {selectedNumber && (
                                <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-bottom-4">
                                    <button
                                        onClick={handlePurchase}
                                        disabled={isPurchasing}
                                        className="w-full py-4 bg-[#2c3e5e] text-white rounded-xl font-bold font-lg hover:bg-[#1f2d42] transition-colors shadow-lg shadow-[#2c3e5e]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isPurchasing ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                Purchasing...
                                            </>
                                        ) : (
                                            `Proceed with ${selectedNumber.friendly_name} ${selectedNumber.price ? `(${selectedNumber.currency || '₦'}${Math.ceil(selectedNumber.price).toLocaleString()})` : ''}`
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-8 min-h-[400px]">
                            <Globe className="w-12 h-12 mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Select a country to start</p>
                            <p className="text-sm">Choose a country from the list to see available numbers</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
