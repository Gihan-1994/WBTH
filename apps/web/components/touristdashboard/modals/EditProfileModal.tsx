"use client";

import { useState } from "react";
import { UserProfile } from "../types";

interface EditProfileModalProps {
    profile: UserProfile;
    onClose: () => void;
    onSave: () => void;
}

/**
 * Modal for editing tourist profile details
 */
export default function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState(profile);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

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
                    alert(error.error || "Failed to upload profile picture");
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
                alert("Profile updated successfully!");
                onSave();
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            alert("Error updating profile");
            setUploading(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Image size must be less than 2MB");
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
                alert("Profile picture removed!");
                onSave();
            } else {
                alert("Failed to remove profile picture");
            }
        } catch (err) {
            alert("Error removing profile picture");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture Upload */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-3">📸 Profile Picture</label>
                        <div className="flex flex-col items-center gap-3">
                            {/* Image Preview */}
                            {(selectedImage || formData.profile_picture) ? (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75"></div>
                                    <img
                                        src={(selectedImage || formData.profile_picture) as string}
                                        alt="Preview"
                                        className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                                    <span className="text-gray-400 text-4xl font-bold">
                                        {formData.name?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}

                            {/* Upload Buttons */}
                            <div className="flex gap-2">
                                <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold text-sm">
                                    Choose Image
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
                                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Max size: 2MB • Formats: JPEG, PNG, WebP</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                        <input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <input
                            value={formData.contact_no || ""}
                            onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                        <input
                            value={formData.country || ""}
                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                        <input
                            type="date"
                            value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ""}
                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Uploading..." : "💾 Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
