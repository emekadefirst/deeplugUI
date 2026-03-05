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
        <div className="max-w-4xl mx-auto space-y-10 px-3 sm:px-4 pb-12">
            <SEO title="Profile" description="View and manage your account details and security settings." />
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-[#2c3e5e] tracking-tight uppercase">Identity Hub</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Credentials & Authentication</p>
                </div>
                <button
                    onClick={refresh}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#2c3e5e] hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Sync Profile
                </button>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border border-red-100 rounded-[2rem] text-sm text-red-600 font-bold flex items-center gap-3">
                    <XCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Profile Aura Card */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2c3e5e] to-[#1a263b] rounded-[3rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-[#2c3e5e] to-[#1a263b] rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-6 transition-transform">
                            <User className="w-12 h-12 text-white/50" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            {isLoading && !profile ? (
                                <div className="space-y-3">
                                    <div className="h-10 bg-white/10 rounded-2xl w-56 animate-pulse" />
                                    <div className="h-4 bg-white/10 rounded-xl w-40 animate-pulse" />
                                </div>
                            ) : profile ? (
                                <>
                                    <h2 className="text-4xl font-black tracking-tighter uppercase">{profile.username}</h2>
                                    <p className="text-blue-200/60 font-black text-[10px] uppercase tracking-[0.2em]">{profile.email}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg border border-white/10 mt-2">
                                        <Shield className="w-3.5 h-3.5 text-blue-300" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-100">Verified Operator</span>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Details */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-[#2c3e5e] uppercase tracking-[0.3em] ml-2 opacity-50">Operational Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {isLoading && !profile ? (
                            [1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-50 rounded-[2rem] animate-pulse" />)
                        ) : profile ? (
                            <>
                                <ProfileInfoItem label="Email Identity" value={profile.email} icon={Mail} />
                                <ProfileInfoItem label="Comms Channel" value={profile.whatsapp_number} icon={Phone} />
                                <ProfileInfoItem label="Join Date" value={formatDate(profile.created_at)} icon={Calendar} />
                                <ProfileInfoItem label="Last Access" value={formatDate(profile.last_login)} icon={Calendar} />
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Account Status */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-[#2c3e5e] uppercase tracking-[0.3em] ml-2 opacity-50">System Status</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {profile ? (
                            <>
                                <AccountStatusCard
                                    label="Account Vitality"
                                    status={profile.is_active ? 'Nominal' : 'Suspended'}
                                    icon={profile.is_active ? CheckCircle : XCircle}
                                    variant={profile.is_active ? 'success' : 'error'}
                                />
                                <AccountStatusCard
                                    label="Security Clearance"
                                    status={profile.is_verified ? 'Authorized' : 'Pending'}
                                    icon={Shield}
                                    variant={profile.is_verified ? 'info' : 'warning'}
                                />
                                {!profile.is_verified && (
                                    <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-center gap-4 animate-bounce-subtle">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Shield className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <p className="text-xs font-bold text-amber-800 leading-tight">
                                            Clearance Required: Complete KYC to unlock full hub potential.
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
