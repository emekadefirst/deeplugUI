/**
 * VSimCommunicationsPage — Orchestrator for SMS and Voice interactions.
 * 
 * Logic is handled by useVSimCommunications hook.
 * UI is decomposed into src/components/vsim/.
 */

import { Plus, RefreshCw, Send } from 'lucide-react';
import { useVSimCommunications } from '../../../hooks/use-vsim-communications';
import {
    CommTabs,
    VoiceStatus,
    NewMessageForm,
    SMSLogTable,
    DialerForm,
    CallLogTable
} from '../../../components/vsim';
import { SEO } from '../../../components/SEO';

export const VSimCommunicationsPage = () => {
    const {
        activeTab,
        setActiveTab,
        newMessage,
        setNewMessage,
        toCountryCode,
        setToCountryCode,
        dialNumber,
        setDialNumber,
        dialCountryCode,
        setDialCountryCode,
        selectedCallFromNumber,
        setSelectedCallFromNumber,
        showNewMessageForm,
        setShowNewMessageForm,
        isDialing,
        activeCall,
        isReady,
        voiceError,
        smsLogs,
        callLogs,
        loadingLogs,
        purchasedNumbers,
        loadingPurchasedNumbers,
        handleSendSMS,
        handleCall,
        handleEndCall,
    } = useVSimCommunications();

    return (
        <div className="max-w-7xl mx-auto space-y-8 px-3 sm:px-4 pb-12">
            <SEO title="Communications Center" description="Manage your virtual SIM voice calls and SMS transmissions." />
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#2c3e5e] tracking-tight">Terminal Center</h1>
                    <p className="text-gray-400 font-bold text-sm uppercase tracking-widest leading-none">Global Voice & Data Hub</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <VoiceStatus isReady={isReady} error={voiceError} />
                    <CommTabs active={activeTab} onChange={setActiveTab} />
                </div>
            </div>

            {/* Main Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: Forms */}
                <div className="lg:col-span-5 space-y-8 h-full">
                    {activeTab === 'sms' ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="font-black text-[#2c3e5e] text-lg tracking-tight">Secure Messaging</h2>
                                {!showNewMessageForm && (
                                    <button
                                        onClick={() => setShowNewMessageForm(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2c3e5e] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1a263b] transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
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
                                <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center">
                                        <Send className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-[#2c3e5e] uppercase tracking-tight">Ready to transmit</p>
                                        <p className="text-gray-400 text-xs font-medium max-w-[200px]">Send secure SMS globally from your virtual identities.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowNewMessageForm(true)}
                                        className="px-6 py-3 bg-[#2c3e5e] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#1a263b] transition-all shadow-lg shadow-[#2c3e5e]/10"
                                    >
                                        New Message
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
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
                            activeCall={activeCall}
                            onCall={handleCall}
                            onEndCall={handleEndCall}
                        />
                    )}

                    {/* Pro Tips / Stats */}
                    <div className="bg-blue-50/50 border border-blue-100/50 rounded-[2rem] p-8 space-y-4">
                        <h4 className="font-black text-[#2c3e5e] text-[10px] uppercase tracking-[0.2em] opacity-40">System Brief</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xl font-black text-[#2c3e5e]">{purchasedNumbers.length}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Lines</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-[#2c3e5e]">{activeTab === 'sms' ? smsLogs.length : callLogs.length}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Logs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Logs */}
                <div className="lg:col-span-7 h-full">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="font-black text-[#2c3e5e] text-lg tracking-tight">
                                {activeTab === 'sms' ? 'Transmission History' : 'Call Records'}
                            </h2>
                            {loadingLogs && <RefreshCw className="w-4 h-4 animate-spin text-gray-300" />}
                        </div>

                        {loadingLogs && (activeTab === 'sms' ? smsLogs.length === 0 : callLogs.length === 0) ? (
                            <div className="bg-white rounded-[2rem] border border-gray-100 p-24 flex flex-col items-center justify-center gap-4">
                                <RefreshCw className="w-10 h-10 animate-spin text-[#2c3e5e]/10" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Decrypting logs...</p>
                            </div>
                        ) : activeTab === 'sms' ? (
                            <SMSLogTable logs={smsLogs} />
                        ) : (
                            <CallLogTable logs={callLogs} />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
