import React from 'react';
import { X, MessageSquare, Wifi, ArrowRight } from 'lucide-react';

interface Props {
    onClose: () => void;
    onNavigate: (path: string) => void;
}

export const NewOrderModal = React.memo(({ onClose, onNavigate }: Props) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c3e5e]/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-[#2c3e5e] tracking-tight">System Initialization</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Select Service Vector</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    {/* SMS Verification */}
                    <button
                        onClick={() => onNavigate('/dashboard/services/verify')}
                        className="w-full flex items-center justify-between p-5 rounded-[2rem] border-2 border-transparent bg-gray-50 hover:bg-white hover:border-[#2c3e5e]/20 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-7 h-7 text-blue-500" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-[#2c3e5e] uppercase tracking-tight">SMS Verifications</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-0.5">Global SMS Verification & OTP</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-[#2c3e5e] group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* eSIM */}
                    <button
                        onClick={() => onNavigate('/dashboard/services/esim')}
                        className="w-full flex items-center justify-between p-5 rounded-[2rem] border-2 border-transparent bg-gray-50 hover:bg-white hover:border-[#2c3e5e]/20 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Wifi className="w-7 h-7 text-purple-500" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-[#2c3e5e] uppercase tracking-tight">eSIMs</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-0.5">High-Speed Global Data Connect</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-[#2c3e5e] group-hover:translate-x-1 transition-all" />
                    </button>

                </div>
            </div>
        </div>
    );
});

NewOrderModal.displayName = 'NewOrderModal';


