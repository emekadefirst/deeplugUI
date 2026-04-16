import React, { useState } from 'react';
import { HelpCircle, Percent, ChevronDown } from 'lucide-react';
import type { PriceResponse } from '../../services/sms-service';
import { formatNaira } from '../../utils/formatters';

interface Props {
    data: PriceResponse;
    pricingOption: 0 | 1;
    onOptionChange: (v: 0 | 1) => void;
}

export const PriceInfo = React.memo(({ data, pricingOption, onOptionChange }: Props) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const successRate = data.success_rate ?? 0;
    const isLowSuccess = successRate < 50;

    return (
        <div className="space-y-6 pt-6 border-t border-zinc-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-700">Service Quote</label>
                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                        <p className="text-lg font-bold text-[#2c3e5e] tracking-tight">
                            {formatNaira(data.price ?? 0)} — {formatNaira(data.high_price ?? 0)}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">Real-time demand range</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-zinc-700">Pool Health</label>
                    <div className={`p-4 border rounded-xl flex items-center justify-between
                        ${isLowSuccess ? 'bg-red-50/30 border-red-100' : 'bg-emerald-50/30 border-emerald-100'}`}>
                        <div>
                            <p className={`text-lg font-bold tracking-tight ${isLowSuccess ? 'text-red-600' : 'text-emerald-600'}`}>
                                {successRate}%
                            </p>
                            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">Success probability</p>
                        </div>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                            ${isLowSuccess ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Percent className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-zinc-700">Allocation Strategy</label>
                    <div className="relative">
                        <HelpCircle
                            size={14}
                            className="text-zinc-400 cursor-help hover:text-[#2c3e5e] transition-colors"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        />
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-zinc-900 text-white text-[11px] rounded-lg shadow-xl z-50 pointer-events-none leading-relaxed animate-in fade-in zoom-in duration-150">
                                <p className="font-bold mb-1 text-white">Priority Routing</p>
                                <p className="opacity-80 font-medium">High success strategy prioritizes premium pools for faster delivery. Optimized for high-demand services.</p>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-zinc-900" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={pricingOption}
                        onChange={(e) => onOptionChange(Number(e.target.value) as 0 | 1)}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-800 font-medium text-sm appearance-none focus:outline-none focus:border-[#2c3e5e] focus:ring-4 focus:ring-[#2c3e5e]/5 transition-all cursor-pointer"
                    >
                        <option value={1}>Optimize for success (Recommended)</option>
                        <option value={0}>Optimize for cost</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 w-4 h-4" />
                </div>
            </div>
        </div>
    );
});

PriceInfo.displayName = 'PriceInfo';
