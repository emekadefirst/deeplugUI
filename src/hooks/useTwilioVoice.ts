import { Device } from '@twilio/voice-sdk';
import { useState, useEffect, useRef } from 'react';
import { vsimService } from '../services/vsim-service';

export const useTwilioVoice = (userId: string | undefined) => {
    const [isReady, setIsReady] = useState(false);
    const deviceRef = useRef<Device | null>(null);

    useEffect(() => {
        const setupDevice = async () => {
            if (!userId) return;

            try {
                // 1. GET THE TOKEN from your backend
                const data = await vsimService.getVoiceToken(userId);
                const token = data.token;

                // 2. INITIALIZE THE DEVICE
                // Avoid re-initializing if device already exists
                if (deviceRef.current) {
                    deviceRef.current.destroy();
                }

                const device = new Device(token, {
                    // Options
                    codecPreferences: ['opus', 'pcmu'] as any,
                });

                // 3. REGISTER LISTENERS
                device.on('registered', () => {
                    console.log('Twilio Device is ready to make calls!');
                    setIsReady(true);
                });

                device.on('error', (error) => {
                    console.error('Twilio Device Error:', error);
                });

                // Actually register the device with Twilio
                device.register();
                deviceRef.current = device;

            } catch (err) {
                console.error("Failed to setup voice:", err);
            }
        };

        if (userId) {
            setupDevice();
        }

        // Cleanup on unmount
        return () => {
            if (deviceRef.current) {
                deviceRef.current.destroy();
                deviceRef.current = null;
            }
        };
    }, [userId]);

    return { isReady, device: deviceRef.current };
};
