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

    return (
        <div className="space-y-6 pt-6 border-t border-gray-100 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#2c3e5e]">Estimated Price</label>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <p className="text-xl font-black text-[#2c3e5e]">
                            {formatNaira(data.price ?? 0)} — {formatNaira(data.high_price ?? 0)}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Price range based on demand</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-[#2c3e5e]">Success Rate</label>
                    <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xl font-black text-green-600">
                                {data.success_rate ?? 0}%
                            </p>
                            <p className="text-[10px] text-green-600/60 font-bold uppercase tracking-wider mt-0.5">Reliability score</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Percent className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-[#2c3e5e]">Pricing Option</label>
                    <div className="relative">
                        <HelpCircle
                            size={14}
                            className="text-blue-500 cursor-help"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onClick={() => setShowTooltip(!showTooltip)}
                        />
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-[#2c3e5e] text-white text-[10px] rounded-xl shadow-xl z-50 pointer-events-none leading-relaxed">
                                <p className="font-bold mb-1">Success Rate vs. Cost</p>
                                High success rate prioritizes faster delivery. Lowest price prioritizes cost saving.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#2c3e5e]" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={pricingOption}
                        onChange={(e) => onOptionChange(Number(e.target.value) as 0 | 1)}
                        className="w-full pl-4 pr-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-[#2c3e5e] font-bold text-sm appearance-none focus:outline-none focus:border-[#2c3e5e]/30 transition-all shadow-sm cursor-pointer"
                    >
                        <option value={1}>Highest success rate (Recommended)</option>
                        <option value={0}>Lowest price</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
                </div>
            </div>
        </div>
    );
});

PriceInfo.displayName = 'PriceInfo';
