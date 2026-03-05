/**
 * ContactPage — Support & Communications Hub.
 * 
 * Logic handled by useContactCenter hook.
 * UI decomposed and modernized with high-contrast elements.
 */

import {
    Smartphone, MessageSquare, Phone, ArrowLeft, RefreshCw, Eye, X, Send, Check
} from 'lucide-react';
import { useContactCenter } from '../../hooks/use-contact-center';
import { SupportCard } from '../../components/contact/SupportCard';
import {
    SMSLogTable,
    CallLogTable,
    NewMessageForm,
    DialerForm,
    VoiceStatus
} from '../../components/vsim';
import { SEO } from '../../components/SEO';

export const ContactPage = () => {
    const {
        view,
        setView,
        vsimOrders,
        loadingVsims,
        copiedId,
        isReady,
        voiceError,
        smsLogs,
        loadingLogs,
        purchasedNumbers,
        loadingPurchasedNumbers,
        callLogs,
        dialNumber,
        setDialNumber,
        dialCountryCode,
        setDialCountryCode,
        selectedCallFromNumber,
        setSelectedCallFromNumber,
        isDialing,
        newMessage,
        setNewMessage,
        toCountryCode,
        setToCountryCode,
        showNewMessageForm,
        setShowNewMessageForm,
        selectedSms,
        showSmsModal,
        setShowSmsModal,
        handleCopyNumber,
        openSmsModal,
        handleReply,
        handleSendSMS,
        handleCall,
    } = useContactCenter();

    // Base Header for sub-views
    const SubViewHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-5">
                <button
                    onClick={() => setView('menu')}
                    className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-[#2c3e5e]" />
                </button>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#2c3e5e] tracking-tight">{title}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
                        <Icon className="w-3 h-3" />
                        Operation Center
                    </p>
                </div>
            </div>
            {view === 'calls_list' && <VoiceStatus isReady={isReady} error={voiceError} />}
        </div>
    );

    if (view === 'sms_list') {
        return (
            <div className="max-w-6xl mx-auto px-1 sm:px-4 pb-12">
                <SEO title="SMS Log" description="View and manage your SMS transmissions." />
                <SubViewHeader title="Message Transmission" icon={MessageSquare} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-black text-[#2c3e5e] uppercase tracking-tighter">Command Terminal</h3>
                            {!showNewMessageForm && (
                                <button
                                    onClick={() => setShowNewMessageForm(true)}
                                    className="px-4 py-2 bg-[#2c3e5e] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-[#1a263b] transition-all"
                                >
                                    Compose
                                </button>
                            )}
                        </div>

                        {showNewMessageForm ? (
                            <NewMessageForm
                                numbers={purchasedNumbers}
                                loadingNumbers={loadingPurchasedNumbers}
                                formData={newMessage}
                                toCountryCode={toCountryCode}
                                onFormDataChange={setNewMessage}
                                onCountryCodeChange={setToCountryCode}
                                onSubmit={handleSendSMS}
                                onClose={() => setShowNewMessageForm(false)}
                            />
                        ) : (
                            <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center text-center space-y-4 shadow-sm h-[350px]">
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                                    <Send className="w-10 h-10 text-gray-200" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-[#2c3e5e] uppercase tracking-tight">Active Matrix</p>
                                    <p className="text-gray-400 text-xs font-medium max-w-[200px]">Waiting for outgoing transmission signal.</p>
                                </div>
                                <button
                                    onClick={() => setShowNewMessageForm(true)}
                                    className="px-6 py-3 bg-[#2c3e5e] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a263b] transition-all"
                                >
                                    New Transmission
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-black text-[#2c3e5e] uppercase tracking-tighter">Event Logs</h3>
                            {loadingLogs && <RefreshCw className="w-4 h-4 animate-spin text-gray-300" />}
                        </div>
                        {loadingLogs && smsLogs.length === 0 ? (
                            <div className="h-[400px] bg-white rounded-[2.5rem] border border-gray-100 flex items-center justify-center">
                                <RefreshCw className="w-8 h-8 animate-spin text-[#2c3e5e]/10" />
                            </div>
                        ) : (
                            <SMSLogTable logs={smsLogs} onView={openSmsModal} />
                        )}
                    </div>
                </div>

                {/* Detail Modal Extension */}
                {showSmsModal && selectedSms && (
                    <div className="fixed inset-0 bg-[#2c3e5e]/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
                            <div className="flex items-center justify-between p-8 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-black text-[#2c3e5e] uppercase tracking-tight flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 opacity-40" />
                                    Payload View
                                </h3>
                                <button onClick={() => setShowSmsModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Origin</p>
                                        <p className="font-black text-[#2c3e5e] font-mono tracking-tighter">{selectedSms.from_number}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target</p>
                                        <p className="font-black text-[#2c3e5e] font-mono tracking-tighter">{selectedSms.to_number}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Decoded Content</p>
                                    <div className="bg-[#2c3e5e] text-white/90 p-6 rounded-[2rem] font-bold text-sm leading-relaxed shadow-lg shadow-[#2c3e5e]/10">
                                        {selectedSms.content}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        onClick={handleReply}
                                        className="px-8 py-4 bg-[#2c3e5e] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a263b] flex items-center gap-3 transition-all active:scale-95"
                                    >
                                        <Send className="w-4 h-4" />
                                        Init Reply
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
            <div className="max-w-6xl mx-auto px-1 sm:px-4 pb-12">
                <SEO title="Call Log" description="Monitor your voice call frequencies and logs." />
                <SubViewHeader title="Voice Frequency" icon={Phone} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-5">
                        <DialerForm
                            numbers={purchasedNumbers}
                            loadingNumbers={loadingPurchasedNumbers}
                            dialNumber={dialNumber}
                            onDialNumberChange={setDialNumber}
                            dialCountryCode={dialCountryCode}
                            onCountryCodeChange={setDialCountryCode}
                            selectedFrom={selectedCallFromNumber}
                            onSelectedFromChange={setSelectedCallFromNumber}
                            isReady={isReady}
                            isDialing={isDialing}
                            activeCall={null} // activeCall state management could be added to hook
                            onCall={handleCall}
                            onEndCall={() => { }}
                        />
                    </div>
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-black text-[#2c3e5e] uppercase tracking-tighter">Frequency Logs</h3>
                            {loadingLogs && <RefreshCw className="w-4 h-4 animate-spin text-gray-300" />}
                        </div>
                        <CallLogTable logs={callLogs} />
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'vsim_list') {
        return (
            <div className="max-w-4xl mx-auto px-1 sm:px-4 pb-12">
                <SEO title="Virtual SIMs" description="Manage your active virtual cellular identities." />
                <SubViewHeader title="Active Identities" icon={Smartphone} />

                {loadingVsims ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-10 h-10 border-4 border-[#2c3e5e] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Querying Secure Database...</p>
                    </div>
                ) : vsimOrders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Smartphone className="w-10 h-10 text-gray-200" />
                        </div>
                        <p className="font-black text-[#2c3e5e] uppercase tracking-tight">No Active Nodes</p>
                        <p className="text-gray-400 text-xs font-medium mt-2">Initialize a virtual identity to begin operations.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {vsimOrders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between group hover:border-[#2c3e5e]/20 transition-all shadow-sm hover:shadow-xl hover:shadow-[#2c3e5e]/5">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#2c3e5e] transition-colors">
                                        <Smartphone className="w-7 h-7 text-[#2c3e5e] group-hover:text-white transition-all" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-[#2c3e5e] font-mono tracking-tighter">{order.phone_number}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Node Online</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCopyNumber(order.phone_number, order.id)}
                                    className="p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all shadow-none hover:shadow-sm"
                                >
                                    {copiedId === order.id ? <Check className="w-5 h-5 text-green-600" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-1 sm:px-4 pb-12">
            <SEO title="Contact Center" description="Get support and manage your communication assets." />
            <div className="space-y-2 mb-12">
                <h1 className="text-4xl font-black text-[#2c3e5e] tracking-tighter uppercase">Support Center</h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Communication & Asset Management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SupportCard
                    title="Neural Nodes"
                    description="Access securely encrypted virtual cellular identities and manage active nodes."
                    icon={Smartphone}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-500"
                    onClick={() => setView('vsim_list')}
                />

                <SupportCard
                    title="Transmission"
                    description="Monitor secure packet delivery and global SMS communication protocol."
                    icon={MessageSquare}
                    iconBg="bg-green-50"
                    iconColor="text-green-500"
                    onClick={() => setView('sms_list')}
                />

                <SupportCard
                    title="Frequencies"
                    description="Interface with global voice networks via encrypted frequency tunneling."
                    icon={Phone}
                    iconBg="bg-purple-50"
                    iconColor="text-purple-500"
                    onClick={() => setView('calls_list')}
                />
            </div>

            {/* Direct Support Secondary */}
            <div className="mt-12 p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <X className="w-7 h-7 text-gray-200" /> {/* Placeholder for a help icon if needed */}
                    </div>
                    <div>
                        <h4 className="font-black text-[#2c3e5e] uppercase tracking-tight">Technical Assistance</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Direct link to system operators</p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-white border border-gray-100 text-[#2c3e5e] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                    Open Support Ticket
                </button>
            </div>
        </div>
    );
};
