import { useEffect, useState } from 'react';
import { Search, ChevronDown, DollarSign, MapPin, Smartphone, ArrowRight, RefreshCw, Hash, Percent, CheckCircle } from 'lucide-react';
import { smsService, type Country, type Service, type PriceResponse } from '../../../services/sms-service';

export const VerifyAccountPage = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [pricingOption, setPricingOption] = useState<'low' | 'high'>('low');
    const [areaCodes, setAreaCodes] = useState<string[]>([]);
    const [newAreaCode, setNewAreaCode] = useState('');

    // Search states
    const [countrySearch, setCountrySearch] = useState('');
    const [serviceSearch, setServiceSearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);

    // Price and Search state
    const [priceData, setPriceData] = useState<PriceResponse | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isRenting, setIsRenting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [countriesData, servicesData] = await Promise.all([
                smsService.getCountries(),
                smsService.getServices(),
            ]);
            setCountries(countriesData);
            setServices(servicesData);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const filteredCountries = countries.filter(
        (country) =>
            country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
            country.short_name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(serviceSearch.toLowerCase())
    );

    const handleAddAreaCode = () => {
        if (newAreaCode && !areaCodes.includes(newAreaCode)) {
            setAreaCodes([...areaCodes, newAreaCode]);
            setNewAreaCode('');
        }
    };

    const handleRemoveAreaCode = (code: string) => {
        setAreaCodes(areaCodes.filter((c) => c !== code));
        setPriceData(null);
    };

    // Reset price when selections change
    useEffect(() => {
        setPriceData(null);
    }, [selectedCountry, selectedService, pricingOption, areaCodes]);

    const handleGetPrice = async () => {
        if (!selectedCountry || !selectedService) {
            setError('Please select both country and service');
            return;
        }

        try {
            setIsSearching(true);
            setError(null);
            const data = await smsService.getPrice({
                country: selectedCountry.ID,
                service: selectedService.ID,
                pricing_option: pricingOption === 'low' ? 0 : 1,
                areacode: areaCodes.length > 0 ? areaCodes : undefined,
            });
            setPriceData(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to get price for this combination');
            setPriceData(null);
        } finally {
            setIsSearching(false);
        }
    };

    const handleRent = async () => {
        if (!selectedCountry || !selectedService || !priceData) return;

        try {
            setIsRenting(true);
            setError(null);
            setSuccessMessage(null);

            const result = await smsService.rentNumber({
                counrty: selectedCountry.ID.toString(),
                service: selectedService.ID,
                quantity: 1,
                pricing_option: pricingOption === 'low' ? 0 : 1,
                areacode: areaCodes.length > 0 ? areaCodes : undefined,
            });

            setSuccessMessage(`Successfully rented number: ${result.number}`);
            // Optionally clear form or redirect
            setPriceData(null);
            setSelectedCountry(null);
            setSelectedService(null);
            setAreaCodes([]);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to rent number. Please check your balance.');
        } finally {
            setIsRenting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[#2c3e5e] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#2c3e5e] mb-2">Account Verification</h1>
                <p className="text-gray-600">Get a virtual number to receive OTP for account verification</p>
            </div>

            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
                <div className="space-y-6">
                    {/* Service Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                            Select Service *
                        </label>
                        <div className="relative">
                            <div
                                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#2c3e5e] transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-[#2c3e5e]" />
                                    <span className={selectedService ? 'text-[#2c3e5e] font-medium' : 'text-gray-400'}>
                                        {selectedService ? selectedService.name : 'Choose a service...'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {showServiceDropdown && (
                                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
                                    <div className="p-3 border-b border-gray-200">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search services..."
                                                value={serviceSearch}
                                                onChange={(e) => setServiceSearch(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 focus:border-[#2c3e5e]"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredServices.map((service) => (
                                            <div
                                                key={service.ID}
                                                onClick={() => {
                                                    setSelectedService(service);
                                                    setShowServiceDropdown(false);
                                                    setServiceSearch('');
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <p className="font-medium text-[#2c3e5e]">{service.name}</p>
                                            </div>
                                        ))}
                                        {filteredServices.length === 0 && (
                                            <div className="px-4 py-8 text-center text-gray-400">
                                                No services found
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Country Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                            Select Country *
                        </label>
                        <div className="relative">
                            <div
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#2c3e5e] transition-colors flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-[#2c3e5e]" />
                                    <span className={selectedCountry ? 'text-[#2c3e5e] font-medium' : 'text-gray-400'}>
                                        {selectedCountry ? `${selectedCountry.name} (+${selectedCountry.cc})` : 'Choose a country...'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {showCountryDropdown && (
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
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredCountries.map((country) => (
                                            <div
                                                key={country.ID}
                                                onClick={() => {
                                                    setSelectedCountry(country);
                                                    setShowCountryDropdown(false);
                                                    setCountrySearch('');
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <p className="font-medium text-[#2c3e5e]">{country.name}</p>
                                                <p className="text-xs text-gray-500">+{country.cc} • {country.region}</p>
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

                    {/* Pricing Option */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                            Pricing Option
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPricingOption('low')}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${pricingOption === 'low'
                                    ? 'bg-[#2c3e5e] text-white shadow-lg shadow-[#2c3e5e]/20'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <DollarSign className="w-5 h-5 mx-auto mb-1" />
                                Low Price
                            </button>
                            <button
                                type="button"
                                onClick={() => setPricingOption('high')}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${pricingOption === 'high'
                                    ? 'bg-[#2c3e5e] text-white shadow-lg shadow-[#2c3e5e]/20'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <DollarSign className="w-5 h-5 mx-auto mb-1" />
                                High Price
                            </button>
                        </div>
                    </div>

                    {/* Area Codes */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                            Area Codes (Optional)
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Enter area code..."
                                value={newAreaCode}
                                onChange={(e) => setNewAreaCode(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddAreaCode()}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 focus:border-[#2c3e5e]"
                            />
                            <button
                                type="button"
                                onClick={handleAddAreaCode}
                                className="px-6 py-3 bg-gray-100 text-[#2c3e5e] font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        {areaCodes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {areaCodes.map((code) => (
                                    <span
                                        key={code}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-[#2c3e5e]/10 text-[#2c3e5e] rounded-lg text-sm font-medium"
                                    >
                                        {code}
                                        <button
                                            onClick={() => handleRemoveAreaCode(code)}
                                            className="hover:text-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Display */}
                    {priceData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                                    Price (Naira)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₦</div>
                                    <input
                                        type="text"
                                        readOnly
                                        value={priceData.price}
                                        className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-[#2c3e5e] focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">
                                    Success Rate
                                </label>
                                <div className="relative">
                                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${priceData.success_rate}%`}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-green-600 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {!priceData ? (
                        <button
                            onClick={handleGetPrice}
                            disabled={!selectedCountry || !selectedService || isSearching}
                            className="w-full bg-[#2c3e5e] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1f2d42] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2c3e5e]/20"
                        >
                            {isSearching ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Searching for Number...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Search for Number
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleRent}
                            disabled={isRenting}
                            className="w-full bg-[#2c3e5e] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1f2d42] transition-all shadow-lg shadow-[#2c3e5e]/20 disabled:opacity-50"
                        >
                            {isRenting ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Renting Number...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="w-5 h-5" />
                                    Rent Number Now
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
