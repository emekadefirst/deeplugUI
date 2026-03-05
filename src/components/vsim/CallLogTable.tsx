import React from 'react';
import { ArrowRight, ArrowLeft, Phone, Clock } from 'lucide-react';
import type { VSimCall } from '../../services/vsim-service';

interface Props {
    logs: VSimCall[];
}

export const CallLogTable = React.memo(({ logs }: Props) => {
    if (logs.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200 shadow-inner">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Phone className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-[#2c3e5e] font-black uppercase tracking-tight">Empty Callbook</p>
                <p className="text-gray-400 text-xs mt-1 font-medium">Your voice call history will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 text-[#2c3e5e] font-black uppercase tracking-widest text-[10px] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-5">Direction</th>
                            <th className="px-6 py-5">Origin</th>
                            <th className="px-6 py-5">Target</th>
                            <th className="px-6 py-5">Duration</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5">Timestamp</th>
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
                                    <div className="flex items-center gap-1.5 text-gray-500 font-bold text-xs uppercase">
                                        <Clock className="w-3.5 h-3.5" />
                                        {log.duration}s
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                                        }`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {new Date(log.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

CallLogTable.displayName = 'CallLogTable';
