import { Shield, ArrowRight, RefreshCw, Search, CheckCircle, XCircle, Info } from 'lucide-react';
import { useVerifyAccount } from '../../../hooks/use-verify-account';
import { CountrySelector, ServiceSelector, AreaCodeManager, PriceInfo } from '../../../components/verification';
import { formatNaira } from '../../../utils/formatters';
import { SEO } from '../../../components/SEO';

export const VerifyAccountPage = () => {
    const {
        loading,
        error,
        successMessage,
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
        filteredCountries,
        filteredServices,
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
                <RefreshCw className="w-10 h-10 text-[#2c3e5e] animate-spin" />
                <p className="text-zinc-500 font-medium">Initializing verification service...</p>
            </div>
        );
    }

    const isCheckDisabled = !selectedCountry || !selectedService || isSearching;
    const finalPrice = pricingOption === 1 ? (priceData?.high_price ?? 0) : (priceData?.price ?? 0);

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-16">
            <SEO title="Account Verification" description="Rent virtual numbers for SMS verification on global platforms." />
            
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[#2c3e5e] flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Account Verification
                </h1>
                <p className="text-zinc-500 text-sm">Deploy high-integrity virtual numbers for instant OTP verification.</p>
            </div>

            {/* Notifications */}
            <div className="space-y-3">
                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200/50 rounded-xl text-sm text-green-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold">{successMessage}</span>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200/50 rounded-xl text-sm text-red-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold">{error}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Main Selection Form */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-zinc-200/50 p-6 sm:p-8 shadow-sm transition-all">
                        <div className="space-y-8">
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
                                <div className="pt-2 animate-in fade-in duration-500">
                                    <PriceInfo
                                        data={priceData}
                                        pricingOption={pricingOption}
                                        onOptionChange={setPricingOption}
                                    />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4">
                                {!priceData ? (
                                    <button
                                        onClick={handleGetPrice}
                                        disabled={isCheckDisabled}
                                        className="w-full bg-[#2c3e5e] text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 hover:bg-[#1f2d42] transition-all disabled:opacity-40 shadow-lg shadow-[#2c3e5e]/10 active:scale-[0.98]"
                                    >
                                        {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                        {isSearching ? 'Verifying pool availability...' : 'Check Availability'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRent}
                                        disabled={isRenting}
                                        className="w-full bg-[#2c3e5e] text-white py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 hover:bg-[#1f2d42] transition-all disabled:opacity-40 shadow-lg shadow-[#2c3e5e]/10 active:scale-[0.98]"
                                    >
                                        {isRenting ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                Deploy Number for {formatNaira(finalPrice)}
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#2c3e5e] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <h3 className="font-semibold text-lg mb-6 relative z-10 flex items-center gap-2">
                            <Info className="w-5 h-5 opacity-80" />
                            Operations
                        </h3>
                        <ul className="space-y-6 relative z-10">
                            {[
                                { step: 1, text: "Select target country and specialized service." },
                                { step: 2, text: "Validate real-time pool pricing and availability." },
                                { step: 3, text: "Confirm deployment. Codelines remain active for 20 minutes." }
                            ].map((item) => (
                                <li key={item.step} className="flex gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold border border-white/10">
                                        {item.step}
                                    </span>
                                    <p className="text-xs text-zinc-300 leading-relaxed">{item.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-6 space-y-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-zinc-900 text-sm">Service Integrity</h3>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                If an SMS code is not received within the operational window, funds are automatically reverted to your available balance.
                            </p>
                        </div>
                        <button className="text-xs font-semibold text-[#2c3e5e] hover:underline transition-all">
                            Technical Documentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};