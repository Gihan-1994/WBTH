"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save } from "lucide-react";

interface AdminProfileData {
    id: string;
    name: string;
    email: string;
    contact_no: string | null;
    role: string;
}

export default function AdminProfileSection() {
    const [profile, setProfile] = useState<AdminProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [formData, setFormData] = useState({ name: "", email: "", contact_no: "" });
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/profile");
            if (response.ok) {
                const data = await response.json();
                setProfile(data.profile.user);
                setFormData({
                    name: data.profile.user.name,
                    email: data.profile.user.email,
                    contact_no: data.profile.user.contact_no || "",
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const response = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, email: formData.email, contact_no: formData.contact_no || null }),
            });

            if (response.ok) {
                alert("Profile updated successfully!");
                setEditing(false);
                fetchProfile();
            } else {
                const data = await response.json();
                alert(data.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            setSaving(true);
            const response = await fetch("/api/admin/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
            });

            if (response.ok) {
                alert("Password changed successfully!");
                setChangingPassword(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                const data = await response.json();
                alert(data.error || "Failed to change password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) return <div className="py-16 text-center text-gray-500">Failed to load profile</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                    {!editing && (
                        <button onClick={() => setEditing(true)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            Edit
                        </button>
                    )}
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            <User size={14} className="inline mr-1" /> Name
                        </label>
                        {editing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ) : (
                            <p className="text-gray-900 font-medium">{profile.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            <Mail size={14} className="inline mr-1" /> Email
                        </label>
                        {editing ? (
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ) : (
                            <p className="text-gray-900">{profile.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            <Phone size={14} className="inline mr-1" /> Contact
                        </label>
                        {editing ? (
                            <input
                                type="tel"
                                value={formData.contact_no}
                                onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="0771234567"
                            />
                        ) : (
                            <p className="text-gray-900">{profile.contact_no || "—"}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                        <span className="inline-flex px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            {profile.role.toUpperCase()}
                        </span>
                    </div>

                    {editing && (
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={() => { setEditing(false); setFormData({ name: profile.name, email: profile.email, contact_no: profile.contact_no || "" }); }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Password Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                </div>

                <div className="p-6">
                    {!changingPassword ? (
                        <button
                            onClick={() => setChangingPassword(true)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <Lock size={18} />
                            Change Password
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Current password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleChangePassword}
                                    disabled={saving}
                                    className="flex-1 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {saving ? "Updating..." : "Update Password"}
                                </button>
                                <button
                                    onClick={() => { setChangingPassword(false); setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}
