import api from './api';

// --- Type Definitions (matches actual Sim Local API response) ---

export interface ESimCountry {
    id: string;
    alias: string;
    english_name: string;
    slug: string;
    has_active_offerings: boolean;
}

export interface ESimCurrency {
    id: string;
    alias: string;
    description: string;
}

export interface ESimPricing {
    id: string;
    currency: ESimCurrency;
    price: number;
    total_price_net: number;
    // Computed on the frontend from total_price_net * USD/NGN rate
    naira_price: number;
}

export interface ESimMvno {
    id: string;
    alias: string;
    description: string;
}

export interface ESimOffering {
    id: string;
    name: string;
    sku: string;
    data: number;
    data_unit: string;
    bundle_validity: number;
    path: string;
    product_offering_pricing: ESimPricing[];
    mvno: ESimMvno;
    roaming: boolean;
    network_speed?: { id: string; alias: string };
    description?: string | null;
    call_minutes?: number | null;
    calls_local?: boolean;
    calls_international?: boolean;
    call_minutes_international?: number | null;
    texts?: number | null;
    data_only_match?: boolean;
}

export interface ESimOrderPayload {
    offering_id: string;
    sku: string;
    amount: number;
    naira_price: number;
    country_id: string;
    plan_name: string;
}

// --- In-memory caches ---
let countriesCache: ESimCountry[] | null = null;
let usdToNgnRate: number | null = null;

/**
 * Fetch the live USD → NGN exchange rate.
 * Cached for the session lifetime. Falls back to 1600 if the request fails.
 */
async function getUsdNgnRate(): Promise<number> {
    if (usdToNgnRate !== null) return usdToNgnRate;

    try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const json = await res.json();
        console.log('[eSIM] Exchange rate response:', json);
        usdToNgnRate = json?.rates?.NGN ?? 1600;
    } catch (err) {
        console.warn('[eSIM] Exchange rate fetch failed, falling back to 1600 NGN/USD', err);
        usdToNgnRate = 1600;
    }

    return usdToNgnRate!;
}

// --- Service ---

export const esimService = {
    getCountries: async (): Promise<ESimCountry[]> => {
        if (countriesCache) return countriesCache;
        const response = await api.get<ESimCountry[]>('/esim/countries');
        console.log('[eSIM] getCountries response:', response);
        countriesCache = response.data;
        return countriesCache;
    },

    getOfferings: async (country_id?: string): Promise<ESimOffering[]> => {
        const [response, rate] = await Promise.all([
            api.get<ESimOffering[]>('/esim/offers', {
                params: country_id ? { country_id } : undefined,
            }),
            getUsdNgnRate(),
        ]);

        console.log('[eSIM] getOfferings response:', response);
        console.log('[eSIM] USD→NGN rate:', rate);

        // Inject computed naira_price into each pricing entry
        const offerings = response.data.map(offering => ({
            ...offering,
            product_offering_pricing: offering.product_offering_pricing.map(p => ({
                ...p,
                naira_price: Math.round(p.total_price_net * rate),
            })),
        }));

        return offerings;
    },

    purchaseEsim: async (payload: ESimOrderPayload): Promise<void> => {
        const response = await api.post('/esim/purchase', payload);
        console.log('[eSIM] purchaseEsim response:', response);
        return response.data;
    },
};
