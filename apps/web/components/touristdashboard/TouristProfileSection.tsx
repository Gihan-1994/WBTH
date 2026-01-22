"use client";

import { User, Mail, Phone, Globe, Calendar, Edit, Lock } from "lucide-react";
import { UserProfile } from "./types";

interface TouristProfileSectionProps {
    profile: UserProfile | null;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    onEditProfile: () => void;
    onChangePassword: () => void;
}

/**
 * Section displaying the tourist's profile information
 */
export default function TouristProfileSection({
    profile,
    setProfile,
    onEditProfile,
    onChangePassword
}: TouristProfileSectionProps) {
    if (!profile) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-2 rounded-lg">
                    <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            </div>

            <div className="space-y-4">
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                    {profile.profile_picture ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75"></div>
                            <img
                                src={profile.profile_picture}
                                alt="Profile"
                                className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                            <span className="text-gray-400 text-4xl font-bold">
                                {profile.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <User size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Name</div>
                        <div className="font-semibold text-gray-800">{profile.name}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Email</div>
                        <div className="font-semibold text-gray-800 break-all">{profile.email}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Phone</div>
                        <div className="font-semibold text-gray-800">{profile.contact_no || "Not provided"}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Globe size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Country</div>
                        <div className="font-semibold text-gray-800">{profile.country || "Not provided"}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Calendar size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Date of Birth</div>
                        <div className="font-semibold text-gray-800">
                            {profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
                        </div>
                    </div>
                </div>

                {/* Email Notification Toggle */}
                <div className="pt-4 border-t border-gray-200">
                    <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Mail size={16} className="text-blue-600" />
                            Email Notifications
                        </span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={profile.email_notifications_enabled}
                                onChange={async (e) => {
                                    const enabled = e.target.checked;
                                    try {
                                        const res = await fetch('/api/user/email-preferences', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ email_notifications_enabled: enabled }),
                                        });
                                        if (res.ok) {
                                            setProfile(prev => prev ? { ...prev, email_notifications_enabled: enabled } : prev);
                                            alert(enabled ? 'Email notifications enabled' : 'Email notifications disabled');
                                        } else {
                                            alert('Failed to update preference');
                                        }
                                    } catch (error) {
                                        alert('Error updating preference');
                                    }
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                        </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-2 px-3">
                        {profile.email_notifications_enabled
                            ? 'You will receive booking updates via email'
                            : 'You will only receive in-app notifications'}
                    </p>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={onEditProfile}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <Edit size={16} />
                        Edit Profile
                    </button>
                    <button
                        onClick={onChangePassword}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
                    >
                        <Lock size={16} />
                        Password
                    </button>
                </div>
            </div>
        </div>
    );
}
