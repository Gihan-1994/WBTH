"use client";

import { useState } from "react";
import { Accommodation } from "../types";
import { X, ArrowRight, ArrowLeft, Check, MapPin, DollarSign, Home, Image as ImageIcon, Upload, Trash2 } from "lucide-react";
import {
    SRI_LANKA_DISTRICTS,
    SRI_LANKA_PROVINCES,
    ACCOMMODATION_TYPES,
    AMENITIES_LIST,
    TRAVEL_STYLES,
} from "../constants";

interface AccommodationModalProps {
    accommodation: Accommodation | null;
    onClose: () => void;
    onSave: () => void;
}

const STEPS = [
    { id: 1, title: "Basic Info", icon: MapPin },
    { id: 2, title: "Pricing", icon: DollarSign },
    { id: 3, title: "Type & Features", icon: Home },
    { id: 4, title: "Images", icon: ImageIcon },
];

const AccommodationModal = function AccommodationModal({ accommodation, onClose, onSave }: AccommodationModalProps) {
    const isEditing = !!accommodation;
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [images, setImages] = useState<string[]>(accommodation?.images || []);
    const [formData, setFormData] = useState<any>(accommodation || {
        name: "",
        district: "",
        location: "",
        type: [],
        amenities: [],
        budget: [],
        interests: [],
        travel_style: [],
        price_range_min: 0,
        price_range_max: 0,
        province: "",
        group_size: 0,
        account_no: "",
        booking_price: 0,
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) {
                alert("Please select image files only");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert("Each image must be less than 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const nextStep = () => {
        if (step < 4) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    async function handleSubmit() {
        setSaving(true);
        const url = isEditing
            ? `/api/accommodation-provider/accommodations/${accommodation.id}`
            : "/api/accommodation-provider/accommodations";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, images }),
            });
            if (res.ok) {
                alert(isEditing ? "Accommodation updated!" : "Accommodation created!");
                onSave();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save accommodation");
            }
        } catch (err) {
            alert("Error saving accommodation");
        } finally {
            setSaving(false);
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
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isEditing ? "Edit Accommodation" : "Add Accommodation"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2">
                        {STEPS.map((s, index) => {
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;
                            return (
                                <div key={s.id} className="flex items-center flex-1">
                                    <button
                                        onClick={() => setStep(s.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full ${
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700"
                                                : isCompleted
                                                    ? "text-emerald-600"
                                                    : "text-gray-400"
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                            isActive
                                                ? "bg-emerald-600 text-white"
                                                : isCompleted
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : "bg-gray-100 text-gray-400"
                                        }`}>
                                            {isCompleted ? <Check size={14} /> : s.id}
                                        </div>
                                        <span className="hidden sm:inline">{s.title}</span>
                                    </button>
                                    {index < STEPS.length - 1 && (
                                        <div className={`w-4 h-0.5 ${isCompleted ? "bg-emerald-300" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Accommodation Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    placeholder="Enter accommodation name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    District <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.district}
                                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                                >
                                    <option value="">Select District</option>
                                    {SRI_LANKA_DISTRICTS.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Province</label>
                                <select
                                    value={formData.province || ""}
                                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                                >
                                    <option value="">Select Province</option>
                                    {SRI_LANKA_PROVINCES.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address</label>
                                <textarea
                                    value={formData.location || ""}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                                    placeholder="e.g., 123 Beach Road, Matara"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Pricing */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Price (Rs)</label>
                                    <input
                                        type="number"
                                        value={formData.price_range_min}
                                        onChange={e => setFormData({ ...formData, price_range_min: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Price (Rs)</label>
                                    <input
                                        type="number"
                                        value={formData.price_range_max}
                                        onChange={e => setFormData({ ...formData, price_range_max: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Booking Price (Rs)</label>
                                <input
                                    type="number"
                                    value={formData.booking_price || 0}
                                    onChange={e => setFormData({ ...formData, booking_price: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    placeholder="0"
                                />
                                <p className="text-xs text-gray-500 mt-1">Price charged per booking</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Group Size</label>
                                <input
                                    type="number"
                                    value={formData.group_size || 0}
                                    onChange={e => setFormData({ ...formData, group_size: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Account Number</label>
                                <input
                                    value={formData.account_no || ""}
                                    onChange={e => setFormData({ ...formData, account_no: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-mono"
                                    placeholder="For receiving payments"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Type & Features */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Accommodation Type <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {ACCOMMODATION_TYPES.map(type => (
                                        <label
                                            key={type}
                                            className={`cursor-pointer px-4 py-2 rounded-lg border text-sm transition-all ${
                                                formData.type?.includes(type)
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.type?.includes(type) || false}
                                                onChange={e => {
                                                    const current = formData.type || [];
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, type: [...current, type] });
                                                    } else {
                                                        setFormData({ ...formData, type: current.filter((t: string) => t !== type) });
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {AMENITIES_LIST.map(amenity => (
                                        <label
                                            key={amenity}
                                            className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                                                formData.amenities?.includes(amenity)
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.amenities?.includes(amenity) || false}
                                                onChange={e => {
                                                    const current = formData.amenities || [];
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, amenities: [...current, amenity] });
                                                    } else {
                                                        setFormData({ ...formData, amenities: current.filter((a: string) => a !== amenity) });
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <span className="capitalize">{amenity.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Travel Style</label>
                                <div className="flex flex-wrap gap-2">
                                    {TRAVEL_STYLES.map(style => (
                                        <label
                                            key={style}
                                            className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-all ${
                                                formData.travel_style?.includes(style)
                                                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.travel_style?.includes(style) || false}
                                                onChange={e => {
                                                    const current = formData.travel_style || [];
                                                    if (e.target.checked) {
                                                        setFormData({ ...formData, travel_style: [...current, style] });
                                                    } else {
                                                        setFormData({ ...formData, travel_style: current.filter((s: string) => s !== style) });
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            {style}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Images */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Accommodation Images
                                </label>
                                <p className="text-sm text-gray-500 mb-4">
                                    Add photos to showcase your property. Max 2MB per image.
                                </p>

                                {/* Upload Area */}
                                <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all">
                                    <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                                    <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 2MB</p>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Image Preview Grid */}
                            {images.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                        Uploaded Images ({images.length})
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded font-medium">
                                                        Cover
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>

                        {step < 4 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Next
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Accommodation"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccommodationModal;
