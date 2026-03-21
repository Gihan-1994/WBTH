"use client";

import { useState } from "react";
import { GuideProfile } from "../types";
import { LANGUAGES, EXPERTISE, SRI_LANKA_CITIES, SRI_LANKA_PROVINCES } from "../constants";
import { X, Upload, Trash2, ChevronLeft, ChevronRight, User, DollarSign, Languages as LanguagesIcon, Briefcase } from "lucide-react";

interface EditProfileModalProps {
    profile: GuideProfile;
    onClose: () => void;
    onSave: () => void;
}

type Step = 1 | 2 | 3 | 4;

const STEPS = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Pricing", icon: DollarSign },
    { id: 3, title: "Skills", icon: LanguagesIcon },
    { id: 4, title: "Experience", icon: Briefcase },
];

export default function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [formData, setFormData] = useState({ ...profile, experience: profile.experience || [] });
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [experiences, setExperiences] = useState<string[]>(profile.experience || []);

    async function handleSubmit() {
        setUploading(true);
        try {
            // Upload profile picture if selected
            if (selectedImage) {
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
            }

            // Update profile
            const updatedFormData = { ...formData, experience: experiences };
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
        } finally {
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
            } else {
                alert("Failed to remove profile picture");
            }
        } catch (err) {
            alert("Error removing profile picture");
        }
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
    };

    const canProceed = () => {
        if (currentStep === 1) {
            return formData.name?.trim();
        }
        if (currentStep === 3) {
            return formData.languages && formData.languages.length > 0;
        }
        return true;
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Step Indicator */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => setCurrentStep(step.id as Step)}
                                        className={`flex flex-col items-center gap-1 ${
                                            isActive ? "text-teal-600" : isCompleted ? "text-teal-500" : "text-gray-400"
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            isActive ? "bg-teal-100" : isCompleted ? "bg-teal-50" : "bg-gray-100"
                                        }`}>
                                            <Icon size={18} />
                                        </div>
                                        <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                                    </button>
                                    {index < STEPS.length - 1 && (
                                        <div className={`w-8 sm:w-12 h-0.5 mx-1 ${
                                            isCompleted ? "bg-teal-500" : "bg-gray-200"
                                        }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    value={formData.contact_no || ""}
                                    onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <select
                                        value={formData.city || ""}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                    >
                                        <option value="">Select City</option>
                                        {SRI_LANKA_CITIES.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                                    <select
                                        value={formData.province || ""}
                                        onChange={e => setFormData({ ...formData, province: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                    >
                                        <option value="">Select Province</option>
                                        {SRI_LANKA_PROVINCES.map(province => (
                                            <option key={province} value={province}>{province}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select
                                    value={formData.gender || ""}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Pricing */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day (LKR) *</label>
                                <input
                                    type="number"
                                    value={formData.price || 0}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Price (LKR)</label>
                                <input
                                    type="number"
                                    value={formData.booking_price || 0}
                                    onChange={e => setFormData({ ...formData, booking_price: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                    placeholder="Leave empty to use Price per Day"
                                />
                                <p className="text-xs text-gray-500 mt-1.5">This will be used for bookings. If empty, Price per Day will be used.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account Number</label>
                                <input
                                    value={formData.account_no || ""}
                                    onChange={e => setFormData({ ...formData, account_no: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                    placeholder="Enter your bank account number"
                                />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Available for Booking</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Toggle to show availability to tourists</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.availability || false}
                                            onChange={e => setFormData({ ...formData, availability: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Languages & Expertise */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Languages * (Select all that apply)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {LANGUAGES.map(language => (
                                        <button
                                            key={language}
                                            type="button"
                                            onClick={() => handleLanguageToggle(language)}
                                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                                (formData.languages || []).includes(language)
                                                    ? "bg-teal-100 text-teal-700 border-2 border-teal-500"
                                                    : "bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100"
                                            }`}
                                        >
                                            {language}
                                        </button>
                                    ))}
                                </div>
                                {(!formData.languages || formData.languages.length === 0) && (
                                    <p className="text-xs text-red-500 mt-1.5">Select at least one language</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Expertise (Select all that apply)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {EXPERTISE.map(exp => (
                                        <button
                                            key={exp}
                                            type="button"
                                            onClick={() => handleExpertiseToggle(exp)}
                                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                                (formData.expertise || []).includes(exp)
                                                    ? "bg-purple-100 text-purple-700 border-2 border-purple-500"
                                                    : "bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100"
                                            }`}
                                        >
                                            {exp}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Profile Picture & Experience */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            {/* Profile Picture */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                {(selectedImage || formData.profile_picture) ? (
                                    <div className="relative inline-block group">
                                        <img
                                            src={selectedImage || formData.profile_picture || ""}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-xl object-cover border border-gray-200"
                                        />
                                        <label className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <div className="text-center text-white">
                                                <Upload size={20} className="mx-auto mb-1" />
                                                <span className="text-xs font-medium">Change</span>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all">
                                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Upload size={20} className="text-gray-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">Click to upload photo</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 2MB</p>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience (Max 5 entries)
                                </label>
                                <div className="space-y-3">
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                value={exp}
                                                onChange={e => handleExperienceChange(index, e.target.value)}
                                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
                                                placeholder={`Experience ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExperience(index)}
                                                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {experiences.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={addExperience}
                                            className="w-full px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors"
                                        >
                                            + Add Experience
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={currentStep === 1 ? onClose : prevStep}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={16} />
                        {currentStep === 1 ? "Cancel" : "Back"}
                    </button>

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={uploading || !canProceed()}
                            className="px-5 py-2.5 text-sm bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
