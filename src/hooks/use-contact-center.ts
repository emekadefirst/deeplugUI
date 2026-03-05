import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/order-service';
import { useVSimStore } from '../stores/vsim-store';
import { useProfileStore } from '../stores/profile-store';
import { useTwilioVoice } from './useTwilioVoice';
import type { VSimSMS } from '../services/vsim-service';
import type { Order } from '../types';

export function useContactCenter() {
    const [view, setView] = useState<'menu' | 'vsim_list' | 'sms_list' | 'calls_list'>('menu');
    const [vsimOrders, setVsimOrders] = useState<Order[]>([]);
    const [loadingVsims, setLoadingVsims] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { profile, fetchProfile } = useProfileStore();
    const { isReady, device, error: voiceError } = useTwilioVoice(profile?.id);

    const {
        smsLogs,
        loadingLogs,
        fetchSMSLogs,
        sendSMS,
        purchasedNumbers,
        fetchPurchasedNumbers,
        loadingPurchasedNumbers,
        callLogs,
        fetchCallLogs
    } = useVSimStore();

    const [dialNumber, setDialNumber] = useState('');
    const [dialCountryCode, setDialCountryCode] = useState('+234');
    const [selectedCallFromNumber, setSelectedCallFromNumber] = useState('');
    const [isDialing, setIsDialing] = useState(false);

    const [newMessage, setNewMessage] = useState({ to: '', body: '', from: '' });
    const [toCountryCode, setToCountryCode] = useState('+234');
    const [showNewMessageForm, setShowNewMessageForm] = useState(false);

    const [selectedSms, setSelectedSms] = useState<VSimSMS | null>(null);
    const [showSmsModal, setShowSmsModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const fetchVsimOrders = useCallback(async () => {
        setLoadingVsims(true);
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
            setLoadingVsims(false);
        }
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (view === 'vsim_list') {
            fetchVsimOrders();
        } else if (view === 'sms_list') {
            fetchSMSLogs();
            fetchPurchasedNumbers();
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
    }, [view, fetchSMSLogs, fetchPurchasedNumbers, fetchCallLogs, fetchVsimOrders]);

    const handleCopyNumber = useCallback(async (number: string, id: string) => {
        try {
            await navigator.clipboard.writeText(number);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }, []);

    const openSmsModal = useCallback((sms: VSimSMS) => {
        setSelectedSms(sms);
        setShowSmsModal(true);
    }, []);

    const handleReply = useCallback(() => {
        if (!selectedSms) return;
        const otherParty = selectedSms.type === 'in' ? selectedSms.from_number : selectedSms.to_number;
        const myNumber = selectedSms.type === 'in' ? selectedSms.to_number : selectedSms.from_number;

        setNewMessage({
            to: otherParty,
            body: '',
            from: myNumber
        });

        setShowSmsModal(false);
        setShowNewMessageForm(true);
    }, [selectedSms]);

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

            call.on('accept', () => setIsDialing(false));
            call.on('disconnect', () => {
                setIsDialing(false);
                setDialNumber('');
                fetchCallLogs();
            });
            call.on('error', () => setIsDialing(false));

        } catch (error) {
            setIsDialing(false);
        }
    }, [selectedCallFromNumber, dialNumber, dialCountryCode, device, fetchCallLogs]);

    return {
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
    };
}
