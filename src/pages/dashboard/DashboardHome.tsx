import { useEffect } from 'react';
import { Phone, Smartphone, Wifi, ArrowRight, Zap, Shield, Clock, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../../stores/wallet-store';

export const DashboardHome = () => {
    const { wallet, fetchWallet } = useWalletStore();

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet]);

    const services = [
        {
            id: 'verify',
            title: 'Account Verification',
            description: 'Get a virtual number to receive OTP for account verification',
            icon: Shield,
            features: ['Instant delivery', 'Multiple countries', 'One-time use'],
            path: '/dashboard/services/verify'
        },
        {
            id: 'rent',
            title: 'Rent Number',
            description: 'Rent a virtual number for a specific period of time',
            icon: Clock,
            features: ['Flexible duration', 'SMS & Calls', 'Privacy protection'],
            path: '/dashboard/services/rent'
        },
        {
            id: 'esim',
            title: 'Buy eSIM',
            description: 'Purchase eSIM for global connectivity',
            icon: Wifi,
            features: ['Global coverage', 'Instant activation', 'Data plans'],
            path: '/dashboard/services/esim'
        }
    ];

    const formatBalance = (balance: string) => {
        const num = parseFloat(balance);
        return num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const stats = [
        { label: 'Active Orders', value: '0', icon: Smartphone },
        {
            label: 'Wallet Balance',
            value: wallet ? `₦${formatBalance(wallet.balance)}` : '₦0.00',
            icon: Wallet
        },
        { label: 'Total Transactions', value: '0', icon: Zap },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#2c3e5e] to-[#1f2d42] rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome{wallet ? `, ${wallet.username}` : ' to deePlug'}
                </h1>
                <p className="text-blue-100 text-lg">Choose a service to get started with your virtual connectivity needs</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-[#2c3e5e]">{stat.value}</p>
                                </div>
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-[#2c3e5e]" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Services Section */}
            <div>
                <h2 className="text-2xl font-bold text-[#2c3e5e] mb-6">Our Services</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Link
                                key={service.id}
                                to={service.path}
                                className="group bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-[#2c3e5e] hover:shadow-xl hover:shadow-[#2c3e5e]/10 transition-all duration-300"
                            >
                                {/* Icon Header */}
                                <div className="bg-white p-6 border-b border-gray-200">
                                    <div className="w-16 h-16 bg-[#2c3e5e] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2c3e5e] mb-2">{service.title}</h3>
                                    <p className="text-gray-600 text-sm">{service.description}</p>
                                </div>

                                {/* Features */}
                                <div className="p-6 bg-gray-50">
                                    <ul className="space-y-3 mb-6">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-1.5 h-1.5 bg-[#2c3e5e] rounded-full"></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center gap-2 text-[#2c3e5e] font-semibold text-sm group-hover:gap-3 transition-all">
                                        Get Started
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#2c3e5e] mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/dashboard/wallet"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-[#2c3e5e] rounded-lg flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-[#2c3e5e]">Add Funds</p>
                            <p className="text-xs text-gray-500">Top up your wallet</p>
                        </div>
                    </Link>
                    <Link
                        to="/dashboard/orders"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-[#2c3e5e] rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-[#2c3e5e]">View Orders</p>
                            <p className="text-xs text-gray-500">Check your active orders</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
