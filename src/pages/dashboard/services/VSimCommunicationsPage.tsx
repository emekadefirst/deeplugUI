import { useEffect, useState } from 'react';
import { MessageSquare, Phone, Send, RefreshCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { useVSimStore } from '../../../stores/vsim-store';


export const VSimCommunicationsPage = () => {
    const {
        smsLogs,
        callLogs,
        loadingLogs,
        purchasedNumbers,
        loadingPurchasedNumbers,
        fetchSMSLogs,
        fetchCallLogs,
        fetchPurchasedNumbers,
        sendSMS,
        makeOutboundCall
    } = useVSimStore();

    // Replace with actual user ID from your auth store
    // const userId = "current-user-id";
    // Twilio voice is handled in ContactPage


    const [activeTab, setActiveTab] = useState<'sms' | 'calls'>('sms');
    const [newMessage, setNewMessage] = useState({ to: '', body: '', from: '' });
    const [dialNumber, setDialNumber] = useState('');
    const [selectedCallFromNumber, setSelectedCallFromNumber] = useState('');
    const [showNewMessageForm, setShowNewMessageForm] = useState(false);
    const [isDialing, setIsDialing] = useState(false);

    useEffect(() => {
        fetchPurchasedNumbers();
    }, [fetchPurchasedNumbers]);

    useEffect(() => {
        if (activeTab === 'sms') {
            fetchSMSLogs();
        } else {
            fetchCallLogs();
        }
    }, [activeTab, fetchSMSLogs, fetchCallLogs]);

    const handleSendSMS = async (e: React.FormEvent) => {
        e.preventDefault();
        // You'll need to know which number to send FROM. 
        // For now user manually inputs 'from', ideally select from purchased numbers.
        const success = await sendSMS(newMessage.to, newMessage.body, newMessage.from);
        if (success) {
            setNewMessage({ to: '', body: '', from: '' });
            setShowNewMessageForm(false);
            fetchSMSLogs();
        }
    };

    const handleCall = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCallFromNumber || !dialNumber) return;

        setIsDialing(true);
        try {
            const success = await makeOutboundCall(dialNumber, selectedCallFromNumber);
            if (success) {
                setDialNumber('');
                await fetchCallLogs();
            }
        } finally {
            setIsDialing(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#2c3e5e]">Communications</h1>


            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('sms')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'sms'
                        ? 'border-[#2c3e5e] text-[#2c3e5e]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        SMS Logs
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('calls')}
                    className={`pb-3 px-4 font-medium transition-colors border-b-2 ${activeTab === 'calls'
                        ? 'border-[#2c3e5e] text-[#2c3e5e]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call Book
                    </div>
                </button>
            </div>

            {/* SMS Tab Content */}
            {activeTab === 'sms' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-700">Message History</h2>
                        <button
                            onClick={() => setShowNewMessageForm(!showNewMessageForm)}
                            className="bg-[#2c3e5e] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#1f2d42] transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            New Message
                        </button>
                    </div>

                    {showNewMessageForm && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-2">
                            <form onSubmit={handleSendSMS} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">From Number</label>
                                        <select
                                            value={newMessage.from}
                                            onChange={(e) => setNewMessage({ ...newMessage, from: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20"
                                            disabled={loadingPurchasedNumbers}
                                            required
                                        >
                                            <option value="">Select a number</option>
                                            {purchasedNumbers.map((order) => (
                                                <option key={order.id} value={order.phone_number}>
                                                    {order.phone_number}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingPurchasedNumbers && (
                                            <p className="text-xs text-gray-500 mt-1">Loading numbers...</p>
                                        )}
                                        {!loadingPurchasedNumbers && purchasedNumbers.length === 0 && (
                                            <p className="text-xs text-amber-600 mt-1">No purchased numbers found</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">To Number</label>
                                        <input
                                            type="text"
                                            value={newMessage.to}
                                            onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20"
                                            placeholder="+1987654321"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        value={newMessage.body}
                                        onChange={(e) => setNewMessage({ ...newMessage, body: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20"
                                        rows={3}
                                        placeholder="Type your message..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewMessageForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[#2c3e5e] text-white rounded-lg text-sm font-medium hover:bg-[#1f2d42]"
                                    >
                                        Send SMS
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loadingLogs ? (
                        <div className="flex justify-center p-12">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-300" />
                        </div>
                    ) : smsLogs.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3">Direction</th>
                                        <th className="px-6 py-3">From</th>
                                        <th className="px-6 py-3">To</th>
                                        <th className="px-6 py-3">Message</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {smsLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {log.type === 'in' ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                                                    {log.type === 'in' ? 'Inbound' : 'Outbound'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-600">{log.from_number}</td>
                                            <td className="px-6 py-4 font-mono text-gray-600">{log.to_number}</td>
                                            <td className="px-6 py-4 truncate max-w-xs">{log.content}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No SMS history found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Calls Tab Content */}
            {activeTab === 'calls' && (
                <div className="space-y-6">
                    {/* Dialer */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Make a Call</h2>
                        <form onSubmit={handleCall} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From Number</label>
                                <select
                                    value={selectedCallFromNumber}
                                    onChange={(e) => setSelectedCallFromNumber(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20"
                                    disabled={loadingPurchasedNumbers}
                                    required
                                >
                                    <option value="">Select your number</option>
                                    {purchasedNumbers.map((order) => (
                                        <option key={order.id} value={order.phone_number}>
                                            {order.phone_number}
                                        </option>
                                    ))}
                                </select>
                                {loadingPurchasedNumbers && (
                                    <p className="text-xs text-gray-500 mt-1">Loading numbers...</p>
                                )}
                                {!loadingPurchasedNumbers && purchasedNumbers.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1">No purchased numbers found</p>
                                )}
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={dialNumber}
                                    onChange={(e) => setDialNumber(e.target.value)}
                                    placeholder="Enter Phone Number (+1...)"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c3e5e]/20 text-lg"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isDialing || !selectedCallFromNumber || !dialNumber}
                                className={`w-full px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-all ${!isDialing && selectedCallFromNumber && dialNumber
                                    ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20'
                                    : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                {isDialing ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Calling...
                                    </>
                                ) : (
                                    <>
                                        <Phone className="w-5 h-5" />
                                        Call
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Call History */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Call History</h2>
                        {loadingLogs ? (
                            <div className="flex justify-center p-12">
                                <RefreshCw className="w-8 h-8 animate-spin text-gray-300" />
                            </div>
                        ) : callLogs.length > 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3">Direction</th>
                                            <th className="px-6 py-3">From</th>
                                            <th className="px-6 py-3">To</th>
                                            <th className="px-6 py-3">Duration</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {callLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {log.type === 'in' ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                                                        {log.type === 'in' ? 'Inbound' : 'Outbound'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-gray-600">{log.from_number}</td>
                                                <td className="px-6 py-4 font-mono text-gray-600">{log.to_number}</td>
                                                <td className="px-6 py-4">{log.duration}s</td>
                                                <td className="px-6 py-4 capitalize">{log.status}</td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No call history found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
