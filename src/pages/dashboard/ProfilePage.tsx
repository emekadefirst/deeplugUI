/**
 * ProfilePage — User profile Management.
 * 
 * Logic uses useProfileStore.
 * UI decomposed and modernized with high-contrast elements.
 */

import { useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useProfileStore } from '../../stores/profile-store';
import { ProfileInfoItem, AccountStatusCard } from '../../components/profile';
import { SEO } from '../../components/SEO';

export const ProfilePage = () => {
    const { profile, isLoading, error, fetchProfile, refresh } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 px-3 sm:px-4 pb-12">
            <SEO title="Profile" description="Manage your account details and settings." />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-[#2c3e5e] tracking-tight">Profile</h1>
                    <p className="text-sm text-zinc-500">Manage your account information and security.</p>
                </div>
                <button
                    onClick={refresh}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-all shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-sm text-red-600 font-bold flex items-center gap-3">
                    <XCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Profile Card */}
            <div className="bg-white border border-zinc-200/50 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200/50 shrink-0">
                        <User className="w-10 h-10 text-zinc-400" />
                    </div>
                    <div className="text-center md:text-left space-y-2 flex-1">
                        {isLoading && !profile ? (
                            <div className="space-y-3">
                                <div className="h-8 bg-zinc-100 rounded-lg w-48 animate-pulse" />
                                <div className="h-4 bg-zinc-100 rounded-md w-32 animate-pulse" />
                            </div>
                        ) : profile ? (
                            <>
                                <h2 className="text-2xl font-semibold text-[#2c3e5e] tracking-tight">{profile.username}</h2>
                                <p className="text-zinc-500 text-sm">{profile.email}</p>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 rounded-lg border border-zinc-200/50 mt-1">
                                    <Shield className="w-3.5 h-3.5 text-zinc-600" />
                                    <span className="text-xs font-medium text-zinc-700">Verified Account</span>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#2c3e5e] ml-1">Account Details</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {isLoading && !profile ? (
                            [1, 2, 3].map((i) => <div key={i} className="h-20 bg-zinc-50 rounded-2xl animate-pulse" />)
                        ) : profile ? (
                            <>
                                <ProfileInfoItem label="Email Address" value={profile.email} icon={Mail} />
                                <ProfileInfoItem label="Phone Number" value={profile.whatsapp_number} icon={Phone} />
                                <ProfileInfoItem label="Member Since" value={formatDate(profile.created_at)} icon={Calendar} />
                                <ProfileInfoItem label="Last Login" value={formatDate(profile.last_login)} icon={Calendar} />
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Account Status */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#2c3e5e] ml-1">Account Status</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {profile ? (
                            <>
                                <AccountStatusCard
                                    label="Account Status"
                                    status={profile.is_active ? 'Active' : 'Suspended'}
                                    icon={profile.is_active ? CheckCircle : XCircle}
                                    variant={profile.is_active ? 'success' : 'error'}
                                />
                                <AccountStatusCard
                                    label="Verification"
                                    status={profile.is_verified ? 'Verified' : 'Unverified'}
                                    icon={Shield}
                                    variant={profile.is_verified ? 'info' : 'warning'}
                                />
                                {!profile.is_verified && (
                                    <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-2xl flex gap-3">
                                        <Shield className="w-5 h-5 text-amber-600 shrink-0" />
                                        <p className="text-sm text-amber-800">
                                            Please verify your account to unlock all features.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
