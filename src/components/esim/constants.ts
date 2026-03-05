// ─── Brand & Theme Constants ──────────────────────────────────────────────────
// Centralised so every eSIM component references the same values.

export const BRAND = '#2c3e5e';
export const BRAND_DARK = '#1a263b';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OfferType = 'all' | 'data' | 'calls_sms';
export type SpeedFilter = 'all' | '4g' | '5g';
export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'data_asc' | 'data_desc';

// ─── MVNO Brand Colours ───────────────────────────────────────────────────────

/** Map of icon_uri substrings → hex colours for provider branding */
export const MVNO_COLOR_MAP: readonly [string, string][] = [
    ['three', '#FF6600'],
    ['lyca', '#39B54A'],
    ['smartroam', '#0066CC'],
    ['airalo', '#6C5CE7'],
    ['holafly', '#F8A01F'],
] as const;

export const DEFAULT_MVNO_COLOR = '#6366f1';

// ─── Sort Options Metadata ────────────────────────────────────────────────────

export const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'data_asc', label: 'Data: Low to High' },
    { value: 'data_desc', label: 'Data: High to Low' },
] as const;

// ─── Plan Type Filter Options ─────────────────────────────────────────────────

export const OFFER_TYPE_OPTIONS: readonly { value: OfferType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'data', label: 'Data Only' },
    { value: 'calls_sms', label: 'Data/Calls/SMS' },
] as const;

// Quick-pick country codes for the empty state
export const QUICK_PICK_CODES = ['US', 'GB', 'NG', 'DE', 'JP', 'AE', 'FR'] as const;
