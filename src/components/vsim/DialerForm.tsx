import React from 'react';
import { Phone, ChevronDown, RefreshCw, PhoneOff } from 'lucide-react';
import { COUNTRY_CODES } from '../../utils/country-codes';
import type { VSimOrderResponse } from '../../services/vsim-service';

interface Props {
    numbers: VSimOrderResponse[];
    loadingNumbers: boolean;
    dialNumber: string;
    onDialNumberChange: (v: string) => void;
    dialCountryCode: string;
    onCountryCodeChange: (code: string) => void;
    selectedFrom: string;
    onSelectedFromChange: (v: string) => void;
    isReady: boolean;
    isDialing: boolean;
    activeCall: any;
    onCall: (e: React.FormEvent) => void;
    onEndCall: () => void;
}

export const DialerForm = React.memo(({
    numbers, loadingNumbers, dialNumber, onDialNumberChange,
    dialCountryCode, onCountryCodeChange, selectedFrom, onSelectedFromChange,
    isReady, isDialing, activeCall, onCall, onEndCall
}: Props) => {
    const isCallDisabled = isDialing || !selectedFrom || !dialNumber || !isReady || activeCall;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-[#2c3e5e]/5 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -z-0" />

            <div className="relative z-10">
                <h2 className="font-black text-[#2c3e5e] uppercase tracking-tighter mb-6">Voice Terminal</h2>

                <form onSubmit={onCall} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Outbound Identity</label>
                        <div className="relative">
                            <select
                                value={selectedFrom}
                                onChange={(e) => onSelectedFromChange(e.target.value)}
                                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2c3e5e]/20 transition-all font-bold text-[#2c3e5e] appearance-none cursor-pointer"
                                required
                                disabled={loadingNumbers || !!activeCall}
                            >
                                <option value="">Select identity...</option>
                                {numbers.map((order) => (
                                    <option key={order.id} value={order.phone_number}>
                                        {order.phone_number}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination Number</label>
                        <div className="flex gap-2">
                            <div className="relative w-32 shrink-0">
                                <select
                                    value={dialCountryCode}
                                    onChange={(e) => onCountryCodeChange(e.target.value)}
                                    className="w-full pl-3 pr-8 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2c3e5e]/20 transition-all font-bold text-[#2c3e5e] appearance-none cursor-pointer text-sm"
                                    disabled={!!activeCall}
                                >
                                    {COUNTRY_CODES.map((c) => (
                                        <option key={c.iso} value={c.code}>
                                            {c.flag} {c.code}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={dialNumber}
                                    onChange={(e) => onDialNumberChange(e.target.value)}
                                    placeholder="Enter digits..."
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2c3e5e]/20 transition-all font-bold text-[#2c3e5e] text-lg tracking-widest"
                                    required
                                    disabled={!!activeCall}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isCallDisabled}
                            className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all ${!isCallDisabled
                                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
                                    : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none border border-gray-100'
                                }`}
                        >
                            {isDialing ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Establishing...
                                </>
                            ) : (
                                <>
                                    <Phone className="w-5 h-5" />
                                    Initiate Call
                                </>
                            )}
                        </button>

                        {activeCall && (
                            <button
                                type="button"
                                onClick={onEndCall}
                                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-300"
                            >
                                <PhoneOff className="w-5 h-5" />
                                Terminate
                            </button>
                        )}
                    </div>

                    {!isReady && !voiceError && (
                        <p className="text-center text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
                            Initialising Voice Engine...
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
});

DialerForm.displayName = 'DialerForm';

// Helper to avoid issues with undefined voiceError if passed from parent
const voiceError = null; 
