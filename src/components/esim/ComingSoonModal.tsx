import React from 'react';
import { X, Rocket } from 'lucide-react';
import { BRAND, BRAND_DARK } from './constants';

interface Props {
    onClose: () => void;
}

/**
 * React.memo prevents re-render when the parent re-renders due to
 * unrelated state changes (e.g. filter changes, country selection).
 * The only prop is the stable `onClose` callback.
 */
export const ComingSoonModal = React.memo(({ onClose }: Props) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm text-center overflow-hidden">
            <div
                className="p-8 relative text-white"
                style={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)` }}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                    <X className="w-4 h-4 text-white" />
                </button>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Coming Soon!</h3>
                <p className="text-white/60 text-sm mt-1">eSIM purchase is almost here</p>
            </div>
            <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    We're putting the finishing touches on eSIM checkout.
                    Stay tuned — you'll be able to purchase and activate instantly very soon!
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 text-white rounded-2xl font-bold transition-all hover:opacity-90"
                    style={{ backgroundColor: BRAND }}
                >
                    Got it
                </button>
            </div>
        </div>
    </div>
));

ComingSoonModal.displayName = 'ComingSoonModal';
