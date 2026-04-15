import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { smsService, type Country, type Service, type PriceResponse } from '../services/sms-service';

/**
 * Custom hook for managing state and logic of the Account Verification page.
 */
export function useVerifyAccount() {
    const navigate = useNavigate();

    // Data state
    const [countries, setCountries] = useState<Country[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form selection state
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [pricingOption, setPricingOption] = useState<0 | 1>(1);
    const [areaCodes, setAreaCodes] = useState<string[]>([]);
    const [newAreaCode, setNewAreaCode] = useState('');

    // UI state
    const [countrySearch, setCountrySearch] = useState('');
    const [serviceSearch, setServiceSearch] = useState('');
    const [priceData, setPriceData] = useState<PriceResponse | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isRenting, setIsRenting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
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
        fetchData();
    }, []);

    // Derived states (memoized)
    const filteredCountries = useMemo(() =>
        countries.filter(
            (country) =>
                country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                country.short_name.toLowerCase().includes(countrySearch.toLowerCase())
        ),
        [countries, countrySearch]);

    const filteredServices = useMemo(() =>
        services.filter((service) =>
            service.name.toLowerCase().includes(serviceSearch.toLowerCase())
        ),
        [services, serviceSearch]);

    // Side effect: Clear price when core selection changes
    useEffect(() => {
        setPriceData(null);
    }, [selectedCountry, selectedService, areaCodes]);

    // Callbacks
    const handleAddAreaCode = useCallback(() => {
        if (newAreaCode && !areaCodes.includes(newAreaCode)) {
            setAreaCodes(prev => [...prev, newAreaCode]);
            setNewAreaCode('');
        }
    }, [newAreaCode, areaCodes]);

    const handleRemoveAreaCode = useCallback((code: string) => {
        setAreaCodes(prev => prev.filter((c) => c !== code));
    }, []);

    const handleGetPrice = useCallback(async () => {
        if (!selectedCountry || !selectedService) {
            setError('Please select both country and service');
            return;
        }

        try {
            setIsSearching(true);
            setError(null);
            const data = await smsService.getPrice({
                country: selectedCountry.ID.toString(),
                service: selectedService.ID.toString(),
                areacode: areaCodes.length > 0 ? areaCodes.join(',') : undefined,
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
    }, [selectedCountry, selectedService, pricingOption, areaCodes]);

    const handleRent = useCallback(async () => {
        if (!selectedCountry || !selectedService || !priceData) return;

        try {
            setIsRenting(true);
            setError(null);

            const finalPrice = pricingOption === 1 ? (priceData.high_price ?? 0) : (priceData.price ?? 0);

            const orderData = {
                country: selectedCountry.ID.toString(),
                service: selectedService.ID.toString(),
                pricing_option: pricingOption,
                areacode: areaCodes,
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
    }, [selectedCountry, selectedService, priceData, pricingOption, areaCodes, navigate]);

    const resetMessages = useCallback(() => {
        setError(null);
        setSuccessMessage(null);
    }, []);

    return {
        // Data
        countries,
        services,
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
        resetMessages
    };
}
