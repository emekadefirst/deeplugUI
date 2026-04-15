/**
 * DashboardHome — The cockpit of the application.
 * 
 * Logic uses useWalletStore.
 * UI decomposed into src/components/dashboard/ with premium aesthetics.
 */

import { useEffect } from 'react';
import { MessageCircle, CardSim } from 'lucide-react';
import { HomeServiceCard } from '../../components/dashboard';
import { useWalletStore } from '../../stores/wallet-store';
import { useProfileStore } from '../../stores/profile-store';
import { SEO } from '../../components/SEO';

const SimCardIcon = (props: any) => {
    return <CardSim size={24} color="#061a3aff" {...props} />;
};

const message = (props: any) => {
    return <MessageCircle size={24} color="#061a3aff" {...props} />;
};

const SERVICES = [
    {
        id: 'verify',
        title: 'SMS Verification',
        description: 'Rent numbers to recieve codes for your social media accounts',
        icon: message,
        features: ['Priority Routing', 'Multi-Regiona Security', 'Atomic Delivery'],
        path: '/dashboard/services/verify',
        color: '#061a3aff',
    },

    {
        id: 'esim',
        title: 'eSIMs',
        description: 'High-speed global data tunneling via instantly activated virtual sims.',
        icon: SimCardIcon,
        features: ['Zero Latency', 'Worldwide Mesh', 'Unlimited providers'],
        path: '/dashboard/services/esim',
        color: '#061a3aff',
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

            {/* Command Header */}
            <div className="relative group">
                <div className="absolute inset-0 bg-[#2c3e5e] rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative bg-[#2c3e5e] rounded-[3.5rem] p-12 text-white overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl animate-pulse" />
                    <div className="relative z-10 space-y-4">
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                            Welcome back, {profile?.username || 'Operator'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Service Grid */}
            <div className="space-y-8">
                <div className="flex items-end justify-between px-2">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-[#2c3e5e] uppercase tracking-tighter">Available Services</h2>
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
