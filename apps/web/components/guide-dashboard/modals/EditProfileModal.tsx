"use client";

import { useState } from "react";
import { GuideProfile } from "../types";
import { LANGUAGES, EXPERTISE, SRI_LANKA_CITIES, SRI_LANKA_PROVINCES } from "../constants";

interface EditProfileModalProps {
    profile: GuideProfile;
    onClose: () => void;
    onSave: () => void;
}

export default function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState({ ...profile, experience: profile.experience || [] });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [experiences, setExperiences] = useState<string[]>(profile.experience || []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            // First upload the profile picture if one was selected
            if (selectedImage) {
                setUploading(true);
                const uploadRes = await fetch("/api/guide/profile-picture", {
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

            // Update form data with experiences
            const updatedFormData = { ...formData, experience: experiences };

            // Then update the profile
            const res = await fetch("/api/guide/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedFormData),
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

    const handleLanguageToggle = (language: string) => {
        const current = formData.languages || [];
        setFormData({
            ...formData,
            languages: current.includes(language)
                ? current.filter((l: string) => l !== language)
                : [...current, language]
        });
    };

    const handleExpertiseToggle = (expertise: string) => {
        const current = formData.expertise || [];
        setFormData({
            ...formData,
            expertise: current.includes(expertise)
                ? current.filter((e: string) => e !== expertise)
                : [...current, expertise]
        });
    };

    const handleExperienceChange = (index: number, value: string) => {
        const newExperiences = [...experiences];
        newExperiences[index] = value;
        setExperiences(newExperiences);
    };

    const addExperience = () => {
        if (experiences.length < 5) {
            setExperiences([...experiences, ""]);
        }
    };

    const removeExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

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
            const res = await fetch("/api/guide/profile-picture", {
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
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">✏️ Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-4">📸 Profile Picture</label>
                        <div className="flex flex-col items-center gap-4">
                            {/* Image Preview */}
                            {(selectedImage || formData.profile_picture) ? (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-md opacity-75"></div>
                                    <img
                                        src={selectedImage || formData.profile_picture || ""}
                                        alt="Preview"
                                        className="relative w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-xl"
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                                    <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}

                            {/* Upload Buttons */}
                            <div className="flex gap-3">
                                <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold text-sm">
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
                                        className="bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Max size: 2MB • Formats: JPEG, PNG, WebP</p>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                            <input
                                value={formData.contact_no || ""}
                                onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                            <select
                                value={formData.city || ""}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            >
                                <option value="">Select City</option>
                                {SRI_LANKA_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
                            <select
                                value={formData.province || ""}
                                onChange={e => setFormData({ ...formData, province: e.target.value })}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            >
                                <option value="">Select Province</option>
                                {SRI_LANKA_PROVINCES.map(province => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                            <select
                                value={formData.gender || ""}
                                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Day (LKR) *</label>
                            <input
                                type="number"
                                required
                                value={formData.price || 0}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Account Number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Account Number</label>
                        <input
                            value={formData.account_no || ""}
                            onChange={e => setFormData({ ...formData, account_no: e.target.value })}
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            placeholder="Enter your bank account number"
                        />
                    </div>

                    {/* Availability */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.availability || false}
                                onChange={e => setFormData({ ...formData, availability: e.target.checked })}
                                className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">✅ Available for Booking</span>
                        </label>
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">🗣️ Languages * (Select all that apply)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border-2 border-gray-200 p-4 rounded-xl bg-gray-50">
                            {LANGUAGES.map(language => (
                                <label key={language} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={(formData.languages || []).includes(language)}
                                        onChange={() => handleLanguageToggle(language)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{language}</span>
                                </label>
                            ))}
                        </div>
                        {(formData.languages?.length === 0 || !formData.languages) && (
                            <p className="text-xs text-red-500 mt-2">⚠️ Select at least one language</p>
                        )}
                    </div>

                    {/* Expertise */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">🎯 Expertise (Select all that apply)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border-2 border-gray-200 p-4 rounded-xl bg-gray-50">
                            {EXPERTISE.map(exp => (
                                <label key={exp} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={(formData.expertise || []).includes(exp)}
                                        onChange={() => handleExpertiseToggle(exp)}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700">{exp}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            💼 Experience (Max 5 entries)
                        </label>
                        <div className="space-y-3">
                            {experiences.map((exp, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        value={exp}
                                        onChange={e => handleExperienceChange(index, e.target.value)}
                                        className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        placeholder={`Experience ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(index)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {experiences.length < 5 && (
                                <button
                                    type="button"
                                    onClick={addExperience}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold"
                                >
                                    + Add Experience
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={uploading || !formData.languages || formData.languages.length === 0}
                        >
                            {uploading ? "Uploading..." : "💾 Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
