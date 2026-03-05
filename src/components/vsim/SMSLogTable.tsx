import React from 'react';
import { ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react';
import type { VSimSMS } from '../../services/vsim-service';

interface Props {
    logs: VSimSMS[];
    onView?: (log: VSimSMS) => void;
}

export const SMSLogTable = React.memo(({ logs, onView }: Props) => {
    if (logs.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MessageSquare className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-[#2c3e5e] font-black uppercase tracking-tight">Silent Inbox</p>
                <p className="text-gray-400 text-xs mt-1 font-medium">Your message history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 text-[#2c3e5e] font-black uppercase tracking-widest text-[10px] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5">Flow</th>
                            <th className="px-6 py-5">Origin</th>
                            <th className="px-6 py-5">Target</th>
                            <th className="px-6 py-5">Payload</th>
                            <th className="px-6 py-5">Timestamp</th>
                            {onView && <th className="px-6 py-5 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${log.type === 'in'
                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                        {log.type === 'in' ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                                        {log.type === 'in' ? 'Inbound' : 'Outbound'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-[#2c3e5e] font-mono tracking-tight">{log.from_number}</td>
                                <td className="px-6 py-4 font-bold text-[#2c3e5e] font-mono tracking-tight">{log.to_number}</td>
                                <td className="px-6 py-4">
                                    <p className="text-gray-500 font-medium truncate max-w-[200px] lg:max-w-xs group-hover:text-[#2c3e5e] transition-colors" title={log.content}>
                                        {log.content}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                {onView && (
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onView(log)}
                                            className="px-4 py-2 bg-gray-50 text-[#2c3e5e] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2c3e5e] hover:text-white transition-all border border-gray-100"
                                        >
                                            View
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

SMSLogTable.displayName = 'SMSLogTable';
