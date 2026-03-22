"use client";

import { GuideProfile } from "./types";
import { MapPin, Mail, Phone, Pencil, Lock, Bell, User, Shield, DollarSign, Languages, Award, Star } from "lucide-react";
import { useToast } from "@/components/Toast";

interface GuideProfileCardProps {
    profile: GuideProfile | null;
    onEditProfile: () => void;
    onChangePassword: () => void;
    onProfileUpdate: (enabled: boolean) => void;
}

export default function GuideProfileCard({
    profile,
    onEditProfile,
    onChangePassword,
    onProfileUpdate
}: GuideProfileCardProps) {
    const toast = useToast();

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
                toast.success(enabled ? 'Email notifications enabled' : 'Email notifications disabled');
            } else {
                toast.error('Failed to update preference');
            }
        } catch (error) {
            toast.error('Error updating preference');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Guide Info */}
            <div className="lg:col-span-2 space-y-6">
                {/* Guide Details Card */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
                        <button
                            onClick={onEditProfile}
                            className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start gap-5 mb-6">
                            {profile.profile_picture ? (
                                <img
                                    src={profile.profile_picture}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200">
                                    <User size={32} className="text-teal-600" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
                                <p className="text-gray-500 mt-1">Tour Guide</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        profile.availability
                                            ? "bg-teal-50 text-teal-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}>
                                        {profile.availability ? "Available" : "Unavailable"}
                                    </span>
                                    {profile.rating && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                            <Star size={12} className="fill-amber-500 text-amber-500" />
                                            {profile.rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-500">Location</span>
                                </div>
                                <p className="text-gray-900 font-medium ml-7">
                                    {profile.city && profile.province
                                        ? `${profile.city}, ${profile.province}`
                                        : profile.city || profile.province || "Not provided"}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-500">Email</span>
                                </div>
                                <p className="text-gray-900 font-medium ml-7">{profile.email}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Phone size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-500">Phone</span>
                                </div>
                                <p className="text-gray-900 font-medium ml-7">{profile.contact_no || "Not provided"}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <DollarSign size={16} className="text-gray-400" />
                                    <span className="text-sm text-gray-500">Price per Day</span>
                                </div>
                                <p className="text-gray-900 font-medium ml-7">LKR {profile.price?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Languages & Expertise */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Languages size={16} className="text-gray-400" />
                                <h2 className="text-base font-semibold text-gray-900">Languages</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {profile.languages.map((lang) => (
                                    <span
                                        key={lang}
                                        className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium"
                                    >
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Award size={16} className="text-gray-400" />
                                <h2 className="text-base font-semibold text-gray-900">Expertise</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {profile.expertise.map((exp) => (
                                    <span
                                        key={exp}
                                        className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                                    >
                                        {exp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-900">Notification Settings</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                    <Bell size={18} className="text-gray-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                    <p className="text-sm text-gray-500">
                                        Receive booking confirmations and updates via email
                                    </p>
                                </div>
                            </div>
                            <label className="relative cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={profile.email_notifications_enabled}
                                    onChange={(e) => handleEmailToggle(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Security & Quick Actions */}
            <div className="space-y-6">
                {/* Security Card */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-900">Security</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                <Shield size={18} className="text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Password</p>
                                <p className="text-sm text-gray-500">Last changed: Unknown</p>
                            </div>
                        </div>

                        <button
                            onClick={onChangePassword}
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            <Lock size={16} />
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        <button
                            onClick={onEditProfile}
                            className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                        >
                            <Pencil size={16} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Account Info */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Account Status</p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status</span>
                            <span className={`text-sm font-medium ${profile.availability ? "text-teal-600" : "text-gray-500"}`}>
                                {profile.availability ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Account Type</span>
                            <span className="text-sm font-medium text-gray-900">Guide</span>
                        </div>
                        {profile.booking_price && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Booking Price</span>
                                <span className="text-sm font-medium text-teal-600">
                                    LKR {profile.booking_price.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
