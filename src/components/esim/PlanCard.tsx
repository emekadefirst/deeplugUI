import React, { useMemo } from 'react';
import { Clock, Signal, Zap, Check } from 'lucide-react';
import type { ESimCountry, ESimOffering } from '../../services/esim-service';
import { BRAND, BRAND_DARK } from './constants';
import { formatData, getPlanTypeLabel, getSpeedLabel, getMvnoColor } from '../../utils/esim-helpers';

interface Props {
    offering: ESimOffering;
    country: ESimCountry;
    onMoreInfo: () => void;
    onBuyNow: () => void;
}

/**
 * Individual plan card in the offerings grid.
 *
 * React.memo: Cards are the most-rendered component on the page (1 per offering).
 * Without memo, every filter-toggle or sort-change causes ALL cards to re-render
 * even though their own props haven't changed.
 *
 * NOTE: For memo to work, parent must pass stable callback references
 * (useCallback in the page component).
 */
export const PlanCard = React.memo(({ offering, country, onMoreInfo, onBuyNow }: Props) => {
    const pricing = offering.product_offering_pricing[0];
    const color = getMvnoColor(offering.icon_uri ?? '');
    const dataLabel = formatData(offering.data, offering.data_unit);
    const planType = getPlanTypeLabel(offering);
    const speedLabel = getSpeedLabel(offering);

    // Price tag SVG icon — defined once, avoids re-creating the JSX element each render
    const priceIcon = useMemo(() => (
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    ), []);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col relative group">
            {/* Top seller badge */}
            {offering.featured && offering.featured_text && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div
                        className="text-white text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-b-xl shadow"
                        style={{ background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})` }}
                    >
                        {offering.featured_text}
                    </div>
                </div>
            )}

            {/* Card header */}
            <div className={`p-5 ${offering.featured && offering.featured_text ? 'pt-9' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-[#2c3e5e] text-xl leading-tight">
                            {dataLabel} eSIM
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">{country.english_name}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {offering.roaming && (
                                <span className="text-[11px] font-bold" style={{ color: BRAND }}>
                                    +Roaming
                                </span>
                            )}
                            {offering.free_text && (
                                <span className="text-[11px] font-bold text-amber-600">
                                    {offering.free_text}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Provider avatar */}
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={offering.mvno.alias}
                    >
                        {offering.mvno.alias.charAt(0)}
                    </div>
                </div>
                <p className="text-[11px] text-gray-400 font-semibold mt-2">{offering.mvno.alias}</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-5" />

            {/* Stats rows */}
            <div className="px-5 py-4 space-y-3 flex-1">
                {[
                    { icon: <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />, label: 'Duration', value: `${offering.bundle_validity} Days` },
                    { icon: <Signal className="w-4 h-4 text-gray-400 flex-shrink-0" />, label: 'Plan', value: planType },
                    { icon: <Zap className="w-4 h-4 text-gray-400 flex-shrink-0" />, label: 'Speed', value: speedLabel },
                    {
                        icon: priceIcon,
                        label: 'Price',
                        value: <span className="font-black text-[#2c3e5e] text-base">US${pricing?.total_price_net?.toFixed(2) ?? '—'}</span>,
                    },
                ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                            {row.icon}
                            {row.label}
                        </span>
                        <span className="font-semibold text-[#2c3e5e]">{row.value}</span>
                    </div>
                ))}
            </div>

            {/* Action buttons */}
            <div className="px-5 pb-4 flex gap-2.5">
                <button
                    onClick={onMoreInfo}
                    className="flex-1 py-2.5 border-2 border-gray-200 text-[#2c3e5e] rounded-xl font-bold text-sm hover:border-gray-300 transition-all"
                >
                    More Info
                </button>
                <button
                    onClick={onBuyNow}
                    className="flex-1 py-2.5 text-white rounded-xl font-bold text-sm transition-all hover:opacity-90 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)` }}
                >
                    Buy Now
                </button>
            </div>

            {/* Promo footer */}
            {offering.promo_text && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
                    <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black flex-shrink-0"
                        style={{ backgroundColor: color }}
                    >
                        {offering.mvno.alias.charAt(0)}
                    </div>
                    <p className="text-[11px] text-gray-500 italic flex-1 truncate">{offering.promo_text}</p>
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: BRAND }} />
                </div>
            )}
        </div>
    );
});

PlanCard.displayName = 'PlanCard';
