"use client";

import { ProviderProfile } from "./types";
import { MapPin, Mail, Phone, Pencil, Lock, Bell } from "lucide-react";

interface CompanyProfileCardProps {
    profile: ProviderProfile | null;
    onEditProfile: () => void;
    onChangePassword: () => void;
    onProfileUpdate: (enabled: boolean) => void;
}

export default function CompanyProfileCard({
    profile,
    onEditProfile,
    onChangePassword,
    onProfileUpdate
}: CompanyProfileCardProps) {
    if (!profile) return null;

    const handleEmailToggle = async (enabled: boolean) => {
        try {
            const res = await fetch('/api/user/email-preferences', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_notifications_enabled: enabled }),
            });
            if (res.ok) {
                onProfileUpdate(enabled);
                alert(enabled ? 'Email notifications enabled' : 'Email notifications disabled');
            } else {
                alert('Failed to update preference');
            }
        } catch (error) {
            alert('Error updating preference');
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Company Profile</h2>
                </div>

                <div className="p-6">
                    {/* Logo and Name */}
                    <div className="flex items-center gap-4 mb-6">
                        {profile.logo ? (
                            <img
                                src={profile.logo}
                                alt="Company Logo"
                                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200">
                                <span className="text-emerald-600 text-2xl font-bold">
                                    {profile.company_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">{profile.company_name}</h3>
                            <p className="text-gray-500">{profile.name}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-gray-900">{profile.location || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-gray-900">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone size={18} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-gray-900">{profile.contact_no || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Email Notifications */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Bell size={18} className="text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-500">
                                        {profile.email_notifications_enabled
                                            ? 'Receive booking updates via email'
                                            : 'Only in-app notifications'}
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={profile.email_notifications_enabled}
                                    onChange={(e) => handleEmailToggle(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </div>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={onEditProfile}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                            <Pencil size={16} />
                            Edit Profile
                        </button>
                        <button
                            onClick={onChangePassword}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            <Lock size={16} />
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
