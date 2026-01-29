
import { useState, useEffect } from 'react';
import { Smartphone, MessageSquare, Phone, ArrowLeft, Copy, Check, Send, ArrowRight, RefreshCw, Eye, X } from 'lucide-react';
import { orderService } from '../../services/order-service';
import { useVSimStore } from '../../stores/vsim-store';
import type { VSimSMS } from '../../services/vsim-service';
import type { Order } from '../../types';

export const ContactPage = () => {
    const [view, setView] = useState<'menu' | 'vsim_list' | 'sms_list' | 'calls_list'>('menu');
    const [vsimOrders, setVsimOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // VSim Store for SMS
    const {
        smsLogs,
        loadingLogs,
        fetchSMSLogs,
        sendSMS,
        purchasedNumbers,
        fetchPurchasedNumbers,
        loadingPurchasedNumbers,
        callLogs,
        fetchCallLogs,
        makeOutboundCall
    } = useVSimStore();

    const [dialNumber, setDialNumber] = useState('');
    const [selectedCallFromNumber, setSelectedCallFromNumber] = useState('');
    const [isDialing, setIsDialing] = useState(false);

    const [newMessage, setNewMessage] = useState({ to: '', body: '', from: '' });
    const [showNewMessageForm, setShowNewMessageForm] = useState(false);

    const fetchVsimOrders = async () => {
        setLoading(true);
        try {
            const response = await orderService.getOrders({
                order_type: 'vsim',
                page: 1,
                page_size: 10
            });
            setVsimOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch vSim orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (view === 'vsim_list') {
            fetchVsimOrders();
        } else if (view === 'sms_list') {
            fetchSMSLogs();
            fetchPurchasedNumbers();

            // Poll for new SMS logs every 5 seconds (only when visible)
            interval = setInterval(() => {
                if (document.visibilityState === 'visible') {
                    fetchSMSLogs({ background: true });
                }
            }, 5000);
        } else if (view === 'calls_list') {
            fetchCallLogs();
            fetchPurchasedNumbers();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [view, fetchSMSLogs, fetchPurchasedNumbers, fetchCallLogs]);

    const handleCopyNumber = async (number: string, id: string) => {
        try {
            await navigator.clipboard.writeText(number);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const [selectedSms, setSelectedSms] = useState<VSimSMS | null>(null);
    const [showSmsModal, setShowSmsModal] = useState(false);

    const openSmsModal = (sms: VSimSMS) => {
        setSelectedSms(sms);
        setShowSmsModal(true);
    };

    const handleReply = () => {
        if (!selectedSms) return;

        // Determine the other party's number (to) and my number (from)
        // If inbound: from_number is other, to_number is me
        // If outbound: to_number is other, from_number is me
        const otherParty = selectedSms.type === 'in' ? selectedSms.from_number : selectedSms.to_number;
        const myNumber = selectedSms.type === 'in' ? selectedSms.to_number : selectedSms.from_number;

        setNewMessage({
            to: otherParty,
            body: '',
            from: myNumber
        });

        setShowSmsModal(false);
        setShowNewMessageForm(true);
    };

    const handleSendSMS = async (e: React.FormEvent) => {
        e.preventDefault();
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

    if (view === 'sms_list') {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('menu')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-[#2c3e5e]">My SMS</h1>
                    </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c3e5e]"></div>
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
                                    <th className="px-6 py-3">Actions</th>
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
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => openSmsModal(log)}
                                                className="text-[#2c3e5e] hover:text-[#1f2d42] flex items-center gap-1 text-xs font-medium bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <Eye className="w-3 h-3" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No SMS history found</p>
                    </div>
                )}

                {/* SMS Detail Modal */}
                {showSmsModal && selectedSms && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-[#2c3e5e] flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Message Details
                                </h3>
                                <button
                                    onClick={() => setShowSmsModal(false)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">From</p>
                                        <p className="font-mono text-sm text-[#2c3e5e]">{selectedSms.from_number}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">To</p>
                                        <p className="font-mono text-sm text-[#2c3e5e]">{selectedSms.to_number}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                    <p className="text-sm text-gray-700">{new Date(selectedSms.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-2">Message Content</p>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {selectedSms.content}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={() => setShowSmsModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleReply}
                                        className="px-4 py-2 bg-[#2c3e5e] text-white rounded-lg text-sm font-medium hover:bg-[#1f2d42] flex items-center gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (view === 'calls_list') {

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('menu')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-[#2c3e5e]">My Calls</h1>
                    </div>
                </div>

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
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${log.direction === 'inbound' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {log.direction === 'inbound' ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                                                    {log.direction}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-600">{log.from}</td>
                                            <td className="px-6 py-4 font-mono text-gray-600">{log.to}</td>
                                            <td className="px-6 py-4">{log.duration}s</td>
                                            <td className="px-6 py-4 capitalize">{log.status}</td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No call history found</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (view === 'vsim_list') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView('menu')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#2c3e5e]">My Virtual SIMs</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c3e5e]"></div>
                    </div>
                ) : vsimOrders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No active Virtual SIM numbers found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {vsimOrders.map((order) => (
                            <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between group hover:border-[#2c3e5e] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Smartphone className="w-5 h-5 text-[#2c3e5e]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2c3e5e]">{order.phone_number}</p>
                                        <p className="text-xs text-gray-500">Status: <span className="capitalize">{order.status}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCopyNumber(order.phone_number, order.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-[#2c3e5e]"
                                    title="Copy Number"
                                >
                                    {copiedId === order.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#2c3e5e]">Contact Support</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    onClick={() => setView('vsim_list')}
                    className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2c3e5e] transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2c3e5e] transition-colors">
                        <Smartphone className="w-6 h-6 text-[#2c3e5e] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-[#2c3e5e] mb-2">My SIM</h3>
                    <p className="text-gray-600 text-sm">View your active numbers</p>
                </div>

                <div
                    onClick={() => setView('sms_list')}
                    className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2c3e5e] transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2c3e5e] transition-colors">
                        <MessageSquare className="w-6 h-6 text-[#2c3e5e] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-[#2c3e5e] mb-2">SMS</h3>
                    <p className="text-gray-600 text-sm">Help with message delivery</p>
                </div>

                <div
                    onClick={() => setView('calls_list')}
                    className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2c3e5e] transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#2c3e5e] transition-colors">
                        <Phone className="w-6 h-6 text-[#2c3e5e] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-[#2c3e5e] mb-2">Calls</h3>
                    <p className="text-gray-600 text-sm">Assistance with voice calls</p>
                </div>
            </div>
        </div>
    );
};
