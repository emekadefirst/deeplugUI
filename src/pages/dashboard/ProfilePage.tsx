import { useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useProfileStore } from '../../stores/profile-store';

export const ProfilePage = () => {
    const { profile, isLoading, error, fetchProfile, refresh } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#2c3e5e]">Profile</h1>
                <button
                    onClick={refresh}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-[#2c3e5e] to-[#1f2d42] rounded-2xl p-8 text-white">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        {isLoading && !profile ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-8 bg-white/20 rounded w-48"></div>
                                <div className="h-4 bg-white/20 rounded w-32"></div>
                            </div>
                        ) : profile ? (
                            <>
                                <h2 className="text-3xl font-bold mb-1">{profile.username}</h2>
                                <p className="text-blue-100">{profile.email}</p>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#2c3e5e] mb-6">Account Information</h3>

                {isLoading && !profile ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                ) : profile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#2c3e5e] rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Username</p>
                                    <p className="font-semibold text-[#2c3e5e]">{profile.username}</p>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#2c3e5e] rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email Address</p>
                                    <p className="font-semibold text-[#2c3e5e]">{profile.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#2c3e5e] rounded-lg flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">WhatsApp Number</p>
                                    <p className="font-semibold text-[#2c3e5e]">{profile.whatsapp_number}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Created */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#2c3e5e] rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Account Created</p>
                                    <p className="font-semibold text-[#2c3e5e] text-sm">{formatDate(profile.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Last Login */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-[#2c3e5e] rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Last Login</p>
                                    <p className="font-semibold text-[#2c3e5e] text-sm">{formatDate(profile.last_login)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Account Status */}
            {profile && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-[#2c3e5e] mb-6">Account Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Active Status */}
                        <div className={`p-4 rounded-xl border-2 ${profile.is_active
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${profile.is_active ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {profile.is_active ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Account Status</p>
                                    <p className={`font-bold ${profile.is_active ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {profile.is_active ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verification Status */}
                        <div className={`p-4 rounded-xl border-2 ${profile.is_verified
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-yellow-50 border-yellow-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${profile.is_verified ? 'bg-blue-100' : 'bg-yellow-100'
                                    }`}>
                                    <Shield className={`w-5 h-5 ${profile.is_verified ? 'text-blue-600' : 'text-yellow-600'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Verification Status</p>
                                    <p className={`font-bold ${profile.is_verified ? 'text-blue-700' : 'text-yellow-700'
                                        }`}>
                                        {profile.is_verified ? 'Verified' : 'Not Verified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!profile.is_verified && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <p className="text-sm text-yellow-800">
                                <strong>Action Required:</strong> Please verify your account to access all features.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-[#2c3e5e] mb-4">Account Actions</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 px-6 py-3 bg-[#2c3e5e] text-white rounded-xl font-semibold hover:bg-[#1f2d42] transition-all">
                        Edit Profile
                    </button>
                    <button className="flex-1 px-6 py-3 border-2 border-gray-200 text-[#2c3e5e] rounded-xl font-semibold hover:bg-gray-50 transition-all">
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};
