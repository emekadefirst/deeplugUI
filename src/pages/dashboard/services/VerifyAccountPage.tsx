import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, HelpCircle, MapPin, Smartphone, ArrowRight, RefreshCw, Percent, CheckCircle } from 'lucide-react';
import { smsService, type Country, type Service, type PriceResponse } from '../../../services/sms-service';

export const VerifyAccountPage = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState<Country[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [pricingOption, setPricingOption] = useState<0 | 1>(1);
    const [areaCodes, setAreaCodes] = useState<string[]>([]);
    const [newAreaCode, setNewAreaCode] = useState('');

    // UI states
    const [countrySearch, setCountrySearch] = useState('');
    const [serviceSearch, setServiceSearch] = useState('');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    const [priceData, setPriceData] = useState<PriceResponse | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isRenting, setIsRenting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    // Helper to format currency
    const formatNaira = (amount: number | string) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(Number(amount));
    };

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
    };

    // Only clear price when core selection changes, NOT when pricingOption changes
    useEffect(() => {
        setPriceData(null);
    }, [selectedCountry, selectedService, areaCodes]);

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
                pricing_option: pricingOption,
                areacode: areaCodes.length > 0 ? areaCodes : undefined,
            });

            if (data?.message && data.message !== "Found") {
                setError(data.message);
                return;
            }
            setPriceData(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to fetch price.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleRent = async () => {
        if (!selectedCountry || !selectedService || !priceData) return;

        try {
            setIsRenting(true);
            setError(null);

            // Fix: Fallback to 0 if price is undefined
            const finalPrice = pricingOption === 1 ? (priceData.high_price ?? 0) : (priceData.price ?? 0);

            const orderData = {
                country: selectedCountry.ID.toString(),
                service: selectedService.ID,
                quantity: 1,
                pricing_option: pricingOption,
                areacode: areaCodes.map(code => Number(code)),
                found_price: finalPrice,
            };

            const result = await smsService.rentNumber(orderData);
            setSuccessMessage(result?.number ? `Rented: ${result.number}` : 'Order successful!');

            setTimeout(() => navigate('/dashboard/orders'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Check your balance and try again.');
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

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="space-y-6">
                    {/* Country Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">Select Country *</label>
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
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
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
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                            >
                                                <p className="font-medium text-[#2c3e5e]">{country.name}</p>
                                                <p className="text-xs text-gray-500">+{country.cc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Service Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">Select Service *</label>
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
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
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
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                            >
                                                <p className="font-medium text-[#2c3e5e]">{service.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Area Codes */}
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e5e] mb-2">Area Codes (Optional)</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Enter area code..."
                                value={newAreaCode}
                                onChange={(e) => setNewAreaCode(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleAddAreaCode}
                                className="px-6 py-3 bg-gray-100 text-[#2c3e5e] font-semibold rounded-xl hover:bg-gray-200"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {areaCodes.map((code) => (
                                <span key={code} className="inline-flex items-center gap-2 px-3 py-1 bg-[#2c3e5e]/10 text-[#2c3e5e] rounded-lg text-sm font-medium">
                                    {code}
                                    <button onClick={() => handleRemoveAreaCode(code)} className="hover:text-red-600">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Price Display */}
                    {priceData && (
                        <div className="space-y-6 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#2c3e5e]">Price Range</label>
                                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-[#2c3e5e] text-lg">
                                        {formatNaira(priceData.price ?? 0)} — {formatNaira(priceData.high_price ?? 0)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-[#2c3e5e]">Success Rate</label>
                                    <div className="relative">
                                        <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${priceData.success_rate ?? 0}%`}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold text-green-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#2c3e5e] flex items-center gap-2 mb-2">
                                    Pricing option
                                    <label className="text-sm font-semibold text-[#2c3e5e] flex items-center gap-2 mb-2">
                                        Pricing option

                                        {/* Wrap icon and tooltip in a relative container */}
                                        <div className="relative flex items-center">
                                            <HelpCircle
                                                size={14}
                                                className="text-blue-500 cursor-help"
                                                onMouseEnter={() => setShowTooltip(true)}
                                                onMouseLeave={() => setShowTooltip(false)}
                                            />

                                            {showTooltip && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#2c3e5e] text-white text-[10px] rounded shadow-lg z-50 pointer-events-none">
                                                    High success rate prioritizes faster delivery. Lowest price prioritizes cost.
                                                    {/* Simple Triangle Arrow */}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#2c3e5e]" />
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </label>
                                <div className="relative">
                                    <select
                                        value={pricingOption}
                                        onChange={(e) => setPricingOption(Number(e.target.value) as 0 | 1)}
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-[#2c3e5e] font-medium appearance-none focus:outline-none focus:border-[#2c3e5e]"
                                    >
                                        <option value={1}>Select highest success rate</option>
                                        <option value={0}>Select lowest price</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {!priceData ? (
                        <button
                            onClick={handleGetPrice}
                            disabled={!selectedCountry || !selectedService || isSearching}
                            className="w-full bg-[#2c3e5e] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1f2d42] transition-all disabled:opacity-50"
                        >
                            {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            {isSearching ? 'Checking Prices...' : 'Check Availability'}
                        </button>
                    ) : (
                        <button
                            onClick={handleRent}
                            disabled={isRenting}
                            className="w-full bg-[#2c3e5e] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1f2d42] transition-all disabled:opacity-50"
                        >
                            {isRenting ? <RefreshCw className="w-5 h-5 animate-spin" /> : `Confirm & Rent for ${formatNaira(pricingOption === 1 ? (priceData.high_price ?? 0) : (priceData.price ?? 0))}`}
                            {!isRenting && <ArrowRight className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};