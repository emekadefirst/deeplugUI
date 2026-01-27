import { useEffect, useState, useRef } from 'react';
import { Device, Call } from '@twilio/voice-sdk';
import { vsimService } from '../services/vsim-service';

export const useTwilioVoice = (userId: string) => {
    const [isReady, setIsReady] = useState(false);
    const [activeCall, setActiveCall] = useState<Call | null>(null);
    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const deviceRef = useRef<Device | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const { token } = await vsimService.getVoiceToken(userId);

                const device = new Device(token, {
                    logLevel: 1,
                    codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
                });

                device.on('registered', () => {
                    console.log('Twilio Device Registered');
                    setIsReady(true);
                });

                device.on('error', (error) => {
                    console.error('Twilio Device Error:', error);
                });

                device.on('incoming', (call: Call) => {
                    setIncomingCall(call);

                    call.on('disconnect', () => {
                        setIncomingCall(null);
                        setActiveCall(null);
                    });
                });

                await device.register();
                deviceRef.current = device;
            } catch (err) {
                console.error("Twilio Device Init Failed", err);
            }
        };

        if (userId) {
            fetchToken();
        }

        return () => {
            deviceRef.current?.destroy();
        };
    }, [userId]);

    const makeCall = async (phoneNumber: string) => {
        if (deviceRef.current) {
            try {
                const call = await deviceRef.current.connect({ params: { To: phoneNumber } });
                setActiveCall(call);

                call.on('disconnect', () => {
                    setActiveCall(null);
                });
            } catch (error) {
                console.error('Error making call:', error);
            }
        }
    };

    const acceptCall = () => {
        if (incomingCall) {
            incomingCall.accept();
            setActiveCall(incomingCall);
            setIncomingCall(null);
        }
    };

    const rejectCall = () => {
        if (incomingCall) {
            incomingCall.reject();
            setIncomingCall(null);
        }
    };

    const endCall = () => {
        if (activeCall) {
            activeCall.disconnect();
            setActiveCall(null);
        }
    };

    return {
        isReady,
        makeCall,
        activeCall,
        incomingCall,
        acceptCall,
        rejectCall,
        endCall
    };
};
