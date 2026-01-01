"use client";

import { useState } from "react";

interface ChangePasswordModalProps {
    onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                alert("Password changed successfully!");
                onClose();
            } else {
                alert(data.error || "Failed to change password");
            }
        } catch (err) {
            alert("Error changing password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all animate-slideUp">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🔒 Change Password</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            placeholder="Enter new password"
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
