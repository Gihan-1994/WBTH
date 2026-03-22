"use client";

import { useState } from "react";
import { UserProfile } from "../types";
import { User, Phone, Globe, Calendar, Camera, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/Toast";

interface EditProfileModalProps {
    profile: UserProfile;
    onClose: () => void;
    onSave: () => void;
}

export default function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState(profile);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const toast = useToast();

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            // First upload the profile picture if one was selected
            if (selectedImage) {
                setUploading(true);
                const uploadRes = await fetch("/api/tourist/profile-picture", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: selectedImage }),
                });

                if (!uploadRes.ok) {
                    const error = await uploadRes.json();
                    toast.error(error.error || "Failed to upload profile picture");
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

            // Then update the profile
            const res = await fetch("/api/tourist/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                toast.success("Profile updated successfully!");
                onSave();
            } else {
                toast.error("Failed to update profile");
            }
        } catch (err) {
            toast.error("Error updating profile");
            setUploading(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;

        try {
            const res = await fetch("/api/tourist/profile-picture", {
                method: "DELETE",
            });

            if (res.ok) {
                setSelectedImage(null);
                setFormData({ ...formData, profile_picture: null });
                toast.success("Profile picture removed");
                onSave();
            } else {
                toast.error("Failed to remove profile picture");
            }
        } catch (err) {
            toast.error("Error removing profile picture");
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 transition-opacity backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Profile Picture Upload */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Camera size={14} className="text-blue-500" />
                                Profile Picture
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    {(selectedImage || formData.profile_picture) ? (
                                        <img
                                            src={(selectedImage || formData.profile_picture) as string}
                                            alt="Preview"
                                            className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200">
                                            <User size={24} className="text-blue-600" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex gap-2">
                                            <label className="cursor-pointer inline-flex items-center gap-2 bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-sm">
                                                <Camera size={14} />
                                                Choose
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            {(formData.profile_picture || selectedImage) && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Max 2MB. JPEG, PNG, WebP</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Personal Information */}
                        <section className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} className="text-blue-500" />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <User size={14} className="text-gray-400" />
                                        <label className="text-xs text-gray-500 font-medium">Full Name</label>
                                    </div>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Phone size={14} className="text-gray-400" />
                                        <label className="text-xs text-gray-500 font-medium">Phone Number</label>
                                    </div>
                                    <input
                                        value={formData.contact_no || ""}
                                        onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
                                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Globe size={14} className="text-gray-400" />
                                        <label className="text-xs text-gray-500 font-medium">Country</label>
                                    </div>
                                    <input
                                        value={formData.country || ""}
                                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your country"
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        <label className="text-xs text-gray-500 font-medium">Date of Birth</label>
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ""}
                                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={uploading}
                        className="w-full py-3 px-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
