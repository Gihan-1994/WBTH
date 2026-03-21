"use client";

import { useState } from "react";
import { Accommodation } from "../types";
import { X } from "lucide-react";
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

const AccommodationModal = function AccommodationModal({ accommodation, onClose, onSave }: AccommodationModalProps) {
    const isEditing = !!accommodation;
    const [saving, setSaving] = useState(false);
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
    });

    async function handleSubmit(e: any) {
        e.preventDefault();
        setSaving(true);
        const url = isEditing
            ? `/api/accommodation-provider/accommodations/${accommodation.id}`
            : "/api/accommodation-provider/accommodations";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isEditing ? "Edit Accommodation" : "Add Accommodation"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">Fill in the details below</p>
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
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Accommodation Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Enter accommodation name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        District <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.district}
                                        onChange={e => setFormData({ ...formData, district: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                                        required
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
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                                    >
                                        <option value="">Select Province</option>
                                        {SRI_LANKA_PROVINCES.map(province => (
                                            <option key={province} value={province}>{province}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address / Location</label>
                                <input
                                    value={formData.location || ""}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="e.g., 123 Beach Road, Matara"
                                />
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900 mb-4">Pricing & Capacity</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Min Price (Rs)</label>
                                    <input
                                        type="number"
                                        value={formData.price_range_min}
                                        onChange={e => setFormData({ ...formData, price_range_min: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Max Price (Rs)</label>
                                    <input
                                        type="number"
                                        value={formData.price_range_max}
                                        onChange={e => setFormData({ ...formData, price_range_max: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Booking Price (Rs)</label>
                                    <input
                                        type="number"
                                        value={formData.booking_price || 0}
                                        onChange={e => setFormData({ ...formData, booking_price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Max Group Size</label>
                                    <input
                                        type="number"
                                        value={formData.group_size || 0}
                                        onChange={e => setFormData({ ...formData, group_size: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Accommodation Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Accommodation Type <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ACCOMMODATION_TYPES.map(type => (
                                    <label
                                        key={type}
                                        className={`cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-all ${
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

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                            <div className="border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto bg-white">
                                <div className="grid grid-cols-2 gap-2">
                                    {AMENITIES_LIST.map(amenity => (
                                        <label key={amenity} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded">
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
                                                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 border-gray-300"
                                            />
                                            <span className="text-sm text-gray-600 capitalize">{amenity.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Travel Style */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Travel Style</label>
                            <div className="flex flex-wrap gap-2">
                                {TRAVEL_STYLES.map(style => (
                                    <label
                                        key={style}
                                        className={`cursor-pointer px-3 py-1.5 rounded-full text-sm transition-all ${
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

                        {/* Bank Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Account Number</label>
                            <input
                                value={formData.account_no || ""}
                                onChange={e => setFormData({ ...formData, account_no: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
                                placeholder="Account number for payouts"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Accommodation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccommodationModal;
