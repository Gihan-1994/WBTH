"use client";

import { useState } from "react";
import { ProviderProfile } from "../types";

interface EditProfileModalProps {
    profile: ProviderProfile;
    onClose: () => void;
    onSave: () => void;
}

const EditProfileModal = function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState(profile);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image size must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setSelectedImage(result);
            setFormData({ ...formData, logo: result });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setFormData({ ...formData, logo: null });
    };

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            const res = await fetch("/api/accommodation-provider/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Profile updated!");
                onSave();
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            alert("Error updating profile");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo Upload */}
                    <div className="flex flex-col items-center">
                        <label className="block text-sm font-semibold text-gray-700 mb-3 self-start">Company Logo</label>
                        <div className="flex flex-col items-center gap-4 w-full bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                            {(selectedImage || formData.logo) ? (
                                <img
                                    src={selectedImage || formData.logo || ""}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                                    <span className="text-gray-400 text-4xl font-bold">
                                        {formData.company_name?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
                                    Choose Image
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {(formData.logo || selectedImage) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 text-sm font-medium transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Max size: 2MB. Formats: JPEG, PNG, WebP</p>
                        </div>
                    </div>

                    <div className="grid gap-5">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                            <input
                                value={formData.company_name}
                                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter company name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Owner Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter owner name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Location</label>
                            <input
                                value={formData.location || ""}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g., Colombo, Western Province"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                            <input
                                value={formData.contact_no || ""}
                                onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter contact number"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
