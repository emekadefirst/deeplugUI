import { Device } from '@twilio/voice-sdk';
import { useState, useEffect, useRef } from 'react';
import { vsimService } from '../services/vsim-service';

export const useTwilioVoice = (userId: string | undefined) => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const deviceRef = useRef<Device | null>(null);

    useEffect(() => {
        const setupDevice = async () => {
            if (!userId) return;

            try {
                // 1. GET THE TOKEN from your backend
                console.log('[Twilio] Fetching voice token for user:', userId);
                const data = await vsimService.getVoiceToken(userId);
                const token = data.token;

                if (!token || typeof token !== 'string') {
                    throw new Error('Invalid token format received from backend');
                }

                // 2. INITIALIZE THE DEVICE
                if (deviceRef.current) {
                    await deviceRef.current.destroy();
                }

                const device = new Device(token, {
                    codecPreferences: ['opus', 'pcmu'] as any,
                });

                // 3. REGISTER LISTENERS
                device.on('registered', () => {
                    console.log('[Twilio] Device ready to make calls');
                    setIsReady(true);
                    setError(null);
                });

                device.on('error', (twilioError: any) => {
                    console.error('[Twilio] Device Error:', twilioError);
                    setIsReady(false);
                    setError(twilioError.message || 'Twilio Device Error');
                });

                // Actually register the device with Twilio
                await device.register();
                deviceRef.current = device;

            } catch (err: any) {
                console.error("[Twilio] Failed to setup voice:", err);
                setIsReady(false);
                setError(err.message || 'Failed to initialize voice service');
            }
        };

        setupDevice();

        // Cleanup on unmount
        return () => {
            if (deviceRef.current) {
                deviceRef.current.destroy();
                deviceRef.current = null;
            }
        };
    }, [userId]);

    return { isReady, device: deviceRef.current, error };
};
