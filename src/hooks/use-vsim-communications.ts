import { useState, useEffect, useCallback } from 'react';
import { useVSimStore } from '../stores/vsim-store';
import { useProfileStore } from '../stores/profile-store';
import { useTwilioVoice } from './useTwilioVoice';

export function useVSimCommunications() {
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
    } = useVSimStore();

    const { profile, fetchProfile } = useProfileStore();
    const { isReady, device, error: voiceError } = useTwilioVoice(profile?.id);

    const [activeTab, setActiveTab] = useState<'sms' | 'calls'>('sms');
    const [newMessage, setNewMessage] = useState({ to: '', body: '', from: '' });
    const [toCountryCode, setToCountryCode] = useState('+234');
    const [dialNumber, setDialNumber] = useState('');
    const [dialCountryCode, setDialCountryCode] = useState('+234');
    const [selectedCallFromNumber, setSelectedCallFromNumber] = useState('');
    const [showNewMessageForm, setShowNewMessageForm] = useState(false);
    const [isDialing, setIsDialing] = useState(false);
    const [activeCall, setActiveCall] = useState<any>(null);

    useEffect(() => {
        fetchProfile();
        fetchPurchasedNumbers();
    }, [fetchProfile, fetchPurchasedNumbers]);

    useEffect(() => {
        if (activeTab === 'sms') {
            fetchSMSLogs();
        } else {
            fetchCallLogs();
        }
    }, [activeTab, fetchSMSLogs, fetchCallLogs]);

    const handleSendSMS = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        let finalTo = newMessage.to.trim();
        if (!finalTo.startsWith('+')) {
            finalTo = `${toCountryCode}${finalTo.startsWith('0') ? finalTo.substring(1) : finalTo}`;
        }

        const success = await sendSMS(finalTo, newMessage.body, newMessage.from);
        if (success) {
            setNewMessage({ to: '', body: '', from: '' });
            setShowNewMessageForm(false);
            fetchSMSLogs();
        }
    }, [newMessage, toCountryCode, sendSMS, fetchSMSLogs]);

    const handleCall = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCallFromNumber || !dialNumber || !device) return;

        let finalTo = dialNumber.trim();
        if (!finalTo.startsWith('+')) {
            finalTo = `${dialCountryCode}${finalTo.startsWith('0') ? finalTo.substring(1) : finalTo}`;
        }

        setIsDialing(true);
        try {
            const call = await device.connect({
                params: {
                    to_num: finalTo,
                    phone_number: selectedCallFromNumber,
                    dial_target: finalTo
                }
            });

            setActiveCall(call);

            call.on('accept', () => {
                setIsDialing(false);
            });

            call.on('disconnect', () => {
                setIsDialing(false);
                setActiveCall(null);
                setDialNumber('');
                fetchCallLogs();
            });

            call.on('error', () => {
                setIsDialing(false);
                setActiveCall(null);
            });
        } catch (error) {
            setIsDialing(false);
            setActiveCall(null);
        }
    }, [selectedCallFromNumber, dialNumber, dialCountryCode, device, fetchCallLogs]);

    const handleEndCall = useCallback(() => {
        if (activeCall) {
            activeCall.disconnect();
            setActiveCall(null);
            setIsDialing(false);
        }
    }, [activeCall]);

    return {
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
    };
}
