import React from 'react';
import { Send, ChevronDown, X } from 'lucide-react';
import { COUNTRY_CODES } from '../../utils/country-codes';
import type { VSimOrderResponse } from '../../services/vsim-service';

interface Props {
    numbers: VSimOrderResponse[];
    loadingNumbers: boolean;
    formData: { to: string; body: string; from: string };
    toCountryCode: string;
    onFormDataChange: (data: any) => void;
    onCountryCodeChange: (code: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export const NewMessageForm = React.memo(({
    numbers, loadingNumbers, formData, toCountryCode,
    onFormDataChange, onCountryCodeChange, onSubmit, onClose
}: Props) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-[#2c3e5e]/5 animate-slide-up relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -z-0" />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-[#2c3e5e] uppercase tracking-tighter">Draft Message</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">From Number</label>
                            <div className="relative">
                                <select
                                    value={formData.from}
                                    onChange={(e) => onFormDataChange({ ...formData, from: e.target.value })}
                                    className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2c3e5e]/20 transition-all font-bold text-[#2c3e5e] appearance-none cursor-pointer"
                                    required
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
                            {loadingNumbers && <p className="text-[10px] text-blue-500 font-bold ml-1 animate-pulse">Syncing numbers...</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">To Number</label>
                            <div className="flex gap-2">
                                <div className="relative w-28 shrink-0">
                                    <select
                                        value={toCountryCode}
                                        onChange={(e) => onCountryCodeChange(e.target.value)}
                                        className="w-full pl-3 pr-8 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2c3e5e]/20 transition-all font-bold text-[#2c3e5e] appearance-none cursor-pointer text-sm"
                                    >
                                        {COUNTRY_CODES.map((c) => (
                                            <option key={c.iso} value={c.code}>
                                                {c.flag} {c.code}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.to}
                                    onChange={(e) => onFormDataChange({ ...formData, to: e.target.value })}
                                    className="flex-1 px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#2c3e5e]/20 transition-all font-bold text-[#2c3e5e]"
                                    placeholder="Number..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Content</label>
                        <textarea
                            value={formData.body}
                            onChange={(e) => onFormDataChange({ ...formData, body: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:border-[#2c3e5e]/20 transition-all font-medium text-[#2c3e5e] min-h-[120px]"
                            placeholder="Type your message here..."
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="px-8 py-4 bg-[#2c3e5e] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1a263b] transition-all shadow-lg shadow-[#2c3e5e]/20 flex items-center gap-3 group"
                        >
                            Broadcast SMS
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

NewMessageForm.displayName = 'NewMessageForm';
