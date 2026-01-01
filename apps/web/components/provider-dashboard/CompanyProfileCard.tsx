"use client";

import { ProviderProfile } from "./types";

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
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🏢 Company Profile</h2>

            {/* Logo Display */}
            <div className="flex justify-center mb-6">
                {profile.logo ? (
                    <img
                        src={profile.logo}
                        alt="Company Logo"
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-green-200"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center ring-4 ring-green-200">
                        <span className="text-green-600 text-4xl font-bold">
                            {profile.company_name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Company Name</div>
                    <div className="font-semibold text-gray-800">{profile.company_name}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">📍 Location</div>
                    <div className="font-semibold text-gray-800">{profile.location || "Not provided"}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Owner Name</div>
                    <div className="font-semibold text-gray-800">{profile.name}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">✉️ Email</div>
                    <div className="font-semibold text-gray-800 break-all">{profile.email}</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">📞 Phone</div>
                    <div className="font-semibold text-gray-800">{profile.contact_no || "Not provided"}</div>
                </div>

                {/* Email Notification Toggle */}
                <div className="pt-4 border-t border-gray-200">
                    <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-semibold text-gray-700">
                            📧 Email Notifications
                        </span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={profile.email_notifications_enabled}
                                onChange={(e) => handleEmailToggle(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-600 peer-checked:to-blue-600"></div>
                        </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-2 px-3">
                        {profile.email_notifications_enabled
                            ? 'You will receive booking updates via email'
                            : 'You will only receive in-app notifications'}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={onEditProfile}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        ✏️ Edit Profile
                    </button>
                    <button
                        onClick={onChangePassword}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                    >
                        🔒 Password
                    </button>
                </div>
            </div>
        </div>
    );
}
