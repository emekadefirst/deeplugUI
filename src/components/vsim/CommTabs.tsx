import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

interface Props {
    active: 'sms' | 'calls';
    onChange: (tab: 'sms' | 'calls') => void;
}

export const CommTabs = React.memo(({ active, onChange }: Props) => {
    return (
        <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-fit">
            <button
                onClick={() => onChange('sms')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${active === 'sms'
                        ? 'bg-white text-[#2c3e5e] shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                <MessageSquare className={`w-4 h-4 transition-transform ${active === 'sms' ? 'scale-110' : ''}`} />
                SMS Logs
            </button>
            <button
                onClick={() => onChange('calls')}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${active === 'calls'
                        ? 'bg-white text-[#2c3e5e] shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                <Phone className={`w-4 h-4 transition-transform ${active === 'calls' ? 'scale-110' : ''}`} />
                Call Book
            </button>
        </div>
    );
});

CommTabs.displayName = 'CommTabs';
