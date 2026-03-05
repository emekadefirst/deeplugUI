import React, { useState, useMemo } from 'react';
import {
    X, Clock, Signal, Zap, Globe2, Phone, MessageSquare, Radio, ShoppingCart,
} from 'lucide-react';
import type { ESimCountry, ESimOffering } from '../../services/esim-service';
import { BRAND, BRAND_DARK } from './constants';
import { getPlanTypeLabel, getSpeedLabel, isDataOnly, stripHtml, getMvnoColor } from '../../utils/esim-helpers';

interface Props {
    offering: ESimOffering;
    country: ESimCountry;
    onBuyNow: () => void;
    onClose: () => void;
}

/**
 * Full-screen detail drawer for a selected eSIM plan.
 * React.memo prevents re-render when unrelated page state changes.
 * The `stripHtml` call is guarded by a useMemo because regex-heavy
 * string processing is relatively expensive.
 */
export const DetailDrawer = React.memo(({ offering, country, onBuyNow, onClose }: Props) => {
    const [showFullDesc, setShowFullDesc] = useState(false);
    const pricing = offering.product_offering_pricing[0];
    const color = getMvnoColor(offering.icon_uri ?? '');

    // Memoised: stripHtml runs 6 regex replacements — skip on re-render when offering is the same
    const { plainDesc, descPreview, hasMoreDesc } = useMemo(() => {
        const plain = offering.description ? stripHtml(offering.description) : null;
        return {
            plainDesc: plain,
            descPreview: plain ? plain.slice(0, 320) : null,
            hasMoreDesc: plain ? plain.length > 320 : false,
        };
    }, [offering.description]);

    const stats = useMemo(() => [
        { label: 'Duration', value: `${offering.bundle_validity}d`, icon: <Clock className="w-3 h-3" /> },
        { label: 'Plan', value: getPlanTypeLabel(offering), icon: <Signal className="w-3 h-3" /> },
        { label: 'Speed', value: getSpeedLabel(offering), icon: <Zap className="w-3 h-3" /> },
        { label: 'Roaming', value: offering.roaming ? 'Yes' : 'No', icon: <Globe2 className="w-3 h-3" />, accent: offering.roaming ? '#10b981' : '#ef4444' },
    ], [offering]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
                {/* Header */}
                <div className="relative p-6 flex-shrink-0 text-white" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)` }}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-start gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow"
                            style={{ backgroundColor: color }}
                        >
                            {offering.mvno.alias.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                {offering.featured && offering.featured_text && (
                                    <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                        {offering.featured_text}
                                    </span>
                                )}
                                {offering.roaming && (
                                    <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                        +Roaming
                                    </span>
                                )}
                            </div>
                            <h3 className="font-black text-lg leading-tight">{offering.name}</h3>
                            <p className="text-white/70 text-sm mt-0.5">{country.english_name} · {offering.mvno.alias}</p>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100 flex-shrink-0">
                    {stats.map(stat => (
                        <div key={stat.label} className="p-3 text-center">
                            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-0.5">
                                {stat.icon}{stat.label}
                            </p>
                            <p className="font-black text-xs" style={{ color: stat.accent ?? '#2c3e5e' }}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="px-5 py-4 space-y-2.5 border-b border-gray-100 flex-shrink-0">
                    {(offering.call_minutes ?? 0) !== 0 && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <span>{offering.call_minutes === -1 ? 'Unlimited calls' : `${offering.call_minutes} call minutes`}</span>
                        </div>
                    )}
                    {(offering.texts ?? 0) !== 0 && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-3.5 h-3.5 text-green-500" />
                            </div>
                            <span>{offering.texts === -1 ? 'Unlimited SMS' : `${offering.texts} SMS included`}</span>
                        </div>
                    )}
                    {isDataOnly(offering) && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Radio className="w-3.5 h-3.5 text-purple-500" />
                            </div>
                            <span>Data only · VoIP apps supported (WhatsApp, etc.)</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                {descPreview && (
                    <div className="px-5 py-4 border-b border-gray-100 overflow-y-auto flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">About this plan</p>
                        <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                            {showFullDesc ? plainDesc : descPreview}{hasMoreDesc && !showFullDesc && '…'}
                        </p>
                        {hasMoreDesc && (
                            <button
                                onClick={() => setShowFullDesc(v => !v)}
                                className="text-[10px] font-bold mt-2 hover:underline"
                                style={{ color: BRAND }}
                            >
                                {showFullDesc ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                )}

                {/* Price + CTA */}
                <div className="p-5 bg-gray-50 flex-shrink-0 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price</p>
                        <p className="text-3xl font-black text-[#2c3e5e]">
                            ₦{pricing?.naira_price?.toLocaleString('en-NG') ?? '—'}
                        </p>
                        <p className="text-xs text-gray-400">${pricing?.total_price_net?.toFixed(2) ?? '—'} USD</p>
                    </div>
                    <button
                        onClick={onBuyNow}
                        className="px-7 py-3.5 text-white rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:opacity-90"
                        style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)` }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
});

DetailDrawer.displayName = 'DetailDrawer';
