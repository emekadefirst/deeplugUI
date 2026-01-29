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
    Bell,
    History,
    Headphones
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
        { path: '/dashboard/contact', label: 'Contact', icon: Headphones },
    ];

    const handleLogout = () => {
        // Add logout logic here
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#2c3e5e] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">D</span>
                            </div>
                            <span className="text-xl font-bold text-[#2c3e5e]">deePlugg</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
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
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-[#2c3e5e] text-white shadow-lg shadow-[#2c3e5e]/20'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex-1 lg:flex-none">
                            <h1 className="text-xl font-bold text-[#2c3e5e] lg:hidden"></h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <div className="w-8 h-8 bg-[#2c3e5e] rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
