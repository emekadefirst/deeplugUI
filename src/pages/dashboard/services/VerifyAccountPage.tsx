/**
 * VerifyAccountPage — Orchestrator component.
 * 
 * Logic is decoupled into useVerifyAccount hook.
 * UI is decomposed into atomic components in src/components/verification/.
 */

import { Shield, ArrowRight, RefreshCw, Search, CheckCircle, XCircle } from 'lucide-react';
import { useVerifyAccount } from '../../../hooks/use-verify-account';
import { CountrySelector, ServiceSelector, AreaCodeManager, PriceInfo } from '../../../components/verification';
import { formatNaira } from '../../../utils/formatters';
import { SEO } from '../../../components/SEO';

export const VerifyAccountPage = () => {
    const {
        loading,
        error,
        successMessage,

        // Form state
        selectedCountry,
        selectedService,
        pricingOption,
        areaCodes,
        newAreaCode,
        countrySearch,
        serviceSearch,
        priceData,
        isSearching,
        isRenting,

        // Derived
        filteredCountries,
        filteredServices,

        // Actions
        setSelectedCountry,
        setSelectedService,
        setPricingOption,
        setNewAreaCode,
        setCountrySearch,
        setServiceSearch,
        handleAddAreaCode,
        handleRemoveAreaCode,
        handleGetPrice,
        handleRent,
    } = useVerifyAccount();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-[#2c3e5e] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold text-sm">Initialising Verification Service...</p>
            </div>
        );
    }

    const isCheckDisabled = !selectedCountry || !selectedService || isSearching;
    const finalPrice = pricingOption === 1 ? (priceData?.high_price ?? 0) : (priceData?.price ?? 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <SEO title="Account Verification" description="Rent virtual numbers for SMS verification on global platforms." />
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#2c3e5e] flex items-center gap-2">
                        <Shield className="w-7 h-7 text-[#2c3e5e]" />
                        Account Verification
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Get virtual numbers for OTP verification on global platforms.</p>
                </div>
            </div>

            {/* Notifications */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-700 flex items-center gap-3 animate-slide-up">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-bold">{successMessage}</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center gap-3 animate-slide-up">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Selection Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
                        <CountrySelector
                            countries={filteredCountries}
                            selected={selectedCountry}
                            search={countrySearch}
                            onSearch={setCountrySearch}
                            onSelect={setSelectedCountry}
                        />

                        <ServiceSelector
                            services={filteredServices}
                            selected={selectedService}
                            search={serviceSearch}
                            onSearch={setServiceSearch}
                            onSelect={setSelectedService}
                        />

                        <AreaCodeManager
                            areaCodes={areaCodes}
                            newValue={newAreaCode}
                            onValueChange={setNewAreaCode}
                            onAdd={handleAddAreaCode}
                            onRemove={handleRemoveAreaCode}
                        />

                        {priceData && (
                            <PriceInfo
                                data={priceData}
                                pricingOption={pricingOption}
                                onOptionChange={setPricingOption}
                            />
                        )}

                        {/* Actions */}
                        <div className="pt-4">
                            {!priceData ? (
                                <button
                                    onClick={handleGetPrice}
                                    disabled={isCheckDisabled}
                                    className="w-full bg-[#2c3e5e] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#1a263b] transition-all disabled:opacity-50 shadow-lg shadow-[#2c3e5e]/10 group"
                                >
                                    {isSearching ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                                    {isSearching ? 'Verifying Availability...' : 'Check Availability'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleRent}
                                    disabled={isRenting}
                                    className="w-full bg-[#2c3e5e] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#1a263b] transition-all disabled:opacity-50 shadow-lg shadow-[#2c3e5e]/10 group"
                                >
                                    {isRenting ? <RefreshCw className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            Rent Now for {formatNaira(finalPrice)}
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#2c3e5e] to-[#1a263b] rounded-3xl p-6 text-white shadow-xl">
                        <h3 className="font-black text-lg mb-4">How it works</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black">1</div>
                                <p className="text-xs text-white/80 leading-relaxed">Choose the country and service (like WhatsApp or Google) you need.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black">2</div>
                                <p className="text-xs text-white/80 leading-relaxed">Check availability and price range for your selection.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black">3</div>
                                <p className="text-xs text-white/80 leading-relaxed">Rent the number. You have limited time to receive the SMS code.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
                        <h3 className="font-bold text-[#2c3e5e] text-sm mb-2">Need Help?</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">If you don't receive your code within the time limit, the funds will be automatically returned to your wallet.</p>
                        <button className="text-xs font-black text-[#2c3e5e] hover:underline">View FAQ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};