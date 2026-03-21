"use client";

import { useState } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
    onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

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
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                            <Lock size={20} className="text-teal-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-800">
                                Choose a strong password with at least 6 characters. We recommend using a mix of letters, numbers, and symbols.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    required
                                    value={currentPassword}
                                    onChange={e => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                    placeholder="Enter new password"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${
                                        confirmPassword && confirmPassword !== newPassword
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-200"
                                    }`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {confirmPassword && confirmPassword !== newPassword && (
                                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (confirmPassword !== "" && confirmPassword !== newPassword)}
                            className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
