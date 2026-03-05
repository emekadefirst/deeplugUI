import React from 'react';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    isReady: boolean;
    error: any;
}

export const VoiceStatus = React.memo(({ isReady, error }: Props) => {
    if (isReady) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full animate-in fade-in zoom-in">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Voice Ready</span>
                <Check className="w-3.5 h-3.5 text-green-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full animate-in fade-in zoom-in">
                <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">Engine Offline</span>
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
            <RefreshCw className="w-3 h-3 text-gray-400 animate-spin" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connecting...</span>
        </div>
    );
});

VoiceStatus.displayName = 'VoiceStatus';
