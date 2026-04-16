/**
 * DashboardHome
 */

import { useEffect } from 'react';
import { MessageCircle, CardSim } from 'lucide-react';
import { HomeServiceCard } from '../../components/dashboard';
import { useWalletStore } from '../../stores/wallet-store';
import { useProfileStore } from '../../stores/profile-store';
import { SEO } from '../../components/SEO';

const SimCardIcon = (props: any) => {
    return <CardSim size={24} className="text-zinc-600" {...props} />;
};

const message = (props: any) => {
    return <MessageCircle size={24} className="text-zinc-600" {...props} />;
};

const SERVICES = [
    {
        id: 'verify',
        title: 'SMS Verification',
        description: 'Rent virtual numbers to receive SMS codes for verification',
        icon: message,
        features: ['Priority Routing', 'Multi-Regional Security', 'Atomic Delivery'],
        path: '/dashboard/services/verify',
        color: '#2c3e5e',
    },
    {
        id: 'esim',
        title: 'eSIMs',
        description: 'High-speed global data via instantly activated virtual sims.',
        icon: SimCardIcon,
        features: ['Zero Latency', 'Worldwide Mesh', 'Multiple Providers'],
        path: '/dashboard/services/esim',
        color: '#2c3e5e',
    },
] as const;



export const DashboardHome = () => {
    const { fetchWallet } = useWalletStore();
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchWallet();
        fetchProfile();
    }, [fetchWallet, fetchProfile]);

    return (
        <div className="max-w-7xl mx-auto space-y-12 px-3 sm:px-4 pb-16">
            <SEO title="Dashboard" description="Overview of your deePlugg services and balance." />

            <div className="relative group">
                <div className="relative bg-[#2c3e5e] rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-sm">
                    <div className="relative z-10 space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Welcome back, {profile?.username || 'User'}
                        </h1>
                        <p className="text-zinc-400">View your active services and manage your account.</p>
                    </div>
                </div>
            </div>

            {/* Service Grid */}
            <div className="space-y-6">
                <div className="flex items-end justify-between px-2">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold text-[#2c3e5e] tracking-tight">Available Services</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SERVICES.map((service) => (
                        <HomeServiceCard key={service.id} {...service} />
                    ))}
                </div>
            </div>


        </div>
    );
};
