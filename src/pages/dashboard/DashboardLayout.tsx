import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    ShoppingBag,
    Receipt,
    LogOut,
    Menu,
    X,
    User,
    History,
} from 'lucide-react';

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
        { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
        { path: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
        { path: '/dashboard/payments', label: 'Payments', icon: History },
        { path: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    const handleLogout = () => {
        // Add logout logic here
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-zinc-200/50 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                        <Link to="/dashboard" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-[#2c3e5e] rounded-xl flex items-center justify-center shadow-md shadow-[#2c3e5e]/10">
                                <span className="text-white font-bold text-sm">D</span>
                            </div>
                            <span className="text-xl font-bold text-[#2c3e5e] tracking-tight">deePlugg</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-zinc-100 rounded-xl transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-500" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm
                                        transition-all duration-200
                                        ${isActive
                                            ? 'bg-[#2c3e5e] text-white shadow-md shadow-[#2c3e5e]/20'
                                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5 opacity-90" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-zinc-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-zinc-100 rounded-xl transition-colors"
                        >
                            <Menu className="w-6 h-6 text-zinc-600" />
                        </button>

                        <div className="flex-1" />

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard/profile')}
                                className="flex items-center gap-2 p-1 hover:bg-zinc-50 rounded-xl transition-all"
                            >
                                <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center border border-zinc-200/50">
                                    <User className="w-5 h-5 text-[#2c3e5e]" />
                                </div>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
