/**
 * DashboardHome
 */

import { useEffect, useState } from 'react';
import { MessageCircle, Smartphone, Wallet, ShoppingCart, Activity } from 'lucide-react';
import { HomeServiceCard, HomeStatCard } from '../../components/dashboard';
import { useWalletStore } from '../../stores/wallet-store';
import { useProfileStore } from '../../stores/profile-store';
import { useOrders } from '../../hooks/use-orders';
import { SEO } from '../../components/SEO';

const SimCardIcon = (props: any) => {
    return <Smartphone size={24} {...props} />;
};

const message = (props: any) => {
    return <MessageCircle size={24} {...props} />;
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
    const { wallet, fetchWallet } = useWalletStore();
    const { profile, fetchProfile } = useProfileStore();
    const { orders, fetchOrders } = useOrders();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchWallet();
        fetchProfile();
        fetchOrders();
    }, [fetchWallet, fetchProfile, fetchOrders]);

    const formatDateTime = (date: Date) => {
        const d = date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const t = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        return `${d} at ${t}`;
    };

    const activeOrders = orders.filter(o => o.status === 'pending').length;

    return (
        <div className="max-w-7xl mx-auto space-y-10 px-3 sm:px-4 pb-16">
            <SEO title="Dashboard" description="Overview of your deePlugg services and balance." />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-[#2c3e5e] rounded-3xl p-8 sm:p-12 text-white shadow-lg">
                <div className="relative z-10 space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Hello, {profile?.username || 'User'} 👋, welcome back
                    </h1>
                    <p className="text-zinc-300 font-medium text-sm lg:text-base opacity-95">
                        {formatDateTime(currentTime)}
                    </p>
                </div>
                {/* Abstract shape for flair */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HomeStatCard 
                    label="Wallet Balance" 
                    value={`₦${parseFloat(wallet?.balance || '0').toLocaleString()}`} 
                    icon={Wallet} 
                />
                <HomeStatCard 
                    label="Active Orders" 
                    value={activeOrders.toString()} 
                    icon={ShoppingCart} 
                />
                <HomeStatCard 
                    label="System Status" 
                    value="Optimal" 
                    icon={Activity} 
                />
            </div>

            {/* Service Grid */}
            <div className="space-y-6">
                <div className="flex items-end justify-between px-2">
                    <h2 className="text-xl font-semibold text-[#2c3e5e] tracking-tight">Explore Services</h2>
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
