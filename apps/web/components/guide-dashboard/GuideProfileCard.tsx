"use client";

import { GuideProfile } from "./types";

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
    if (!profile) return null;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 My Profile</h2>

            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
                {profile.profile_picture ? (
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-md opacity-75"></div>
                        <img
                            src={profile.profile_picture}
                            alt="Profile"
                            className="relative w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                        <span className="text-gray-400 text-5xl font-bold">
                            {profile.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                    </div>
                )}
            </div>

            {/* Profile Details */}
            <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">📛 Name:</span>
                    <span className="text-gray-800 font-semibold">{profile.name}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">📧 Email:</span>
                    <span className="text-gray-800">{profile.email}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">📞 Phone:</span>
                    <span className="text-gray-800">{profile.contact_no || "N/A"}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">🏙️ City:</span>
                    <span className="text-gray-800">{profile.city || "N/A"}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">🗺️ Province:</span>
                    <span className="text-gray-800">{profile.province || "N/A"}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">⚧️ Gender:</span>
                    <span className="text-gray-800 capitalize">{profile.gender || "N/A"}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">💰 Price/Day:</span>
                    <span className="text-green-600 font-bold">LKR {profile.price}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">🏦 Account:</span>
                    <span className="text-gray-800 font-mono text-xs">{profile.account_no || "Not provided"}</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">📅 Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {profile.availability ? "✅ Available" : "❌ Unavailable"}
                    </span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="text-gray-500 min-w-[100px] font-medium">⭐ Rating:</span>
                    <span className="text-yellow-600 font-bold">
                        {profile.rating ? `${profile.rating}/5.0` : "No rating yet"}
                    </span>
                </div>
            </div>

            {/* Languages */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">🗣️ Languages</div>
                <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
                        <span
                            key={lang}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
                        >
                            {lang}
                        </span>
                    ))}
                </div>
            </div>

            {/* Expertise */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">🎯 Expertise</div>
                <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((exp) => (
                        <span
                            key={exp}
                            className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
                        >
                            {exp}
                        </span>
                    ))}
                </div>
            </div>

            {/* Email Notification Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">
                        📧 Email Notifications
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
                                        onProfileUpdate(enabled);
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                    {profile.email_notifications_enabled
                        ? 'You will receive booking updates via email'
                        : 'You will only receive in-app notifications'}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={onEditProfile}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold"
                >
                    ✏️ Edit Profile
                </button>
                <button
                    onClick={onChangePassword}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                    🔒 Change Password
                </button>
            </div>
        </div>
    );
}
