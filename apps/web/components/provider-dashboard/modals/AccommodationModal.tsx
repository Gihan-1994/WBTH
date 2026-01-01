"use client";

import { useState } from "react";
import { Accommodation } from "../types";
import {
    SRI_LANKA_DISTRICTS,
    SRI_LANKA_PROVINCES,
    ACCOMMODATION_TYPES,
    AMENITIES_LIST,
    TRAVEL_STYLES,
    INTERESTS
} from "../constants";

interface AccommodationModalProps {
    accommodation: Accommodation | null;
    onClose: () => void;
    onSave: () => void;
}

const AccommodationModal = function AccommodationModal({ accommodation, onClose, onSave }: AccommodationModalProps) {
    const isEditing = !!accommodation;
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
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{isEditing ? "✏️ Edit" : "➕ Add"} Accommodation</h2>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Accommodation Name *</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="Enter pleasant name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">District *</label>
                            <select
                                value={formData.district}
                                onChange={e => setFormData({ ...formData, district: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                required
                            >
                                <option value="">Select District</option>
                                {SRI_LANKA_DISTRICTS.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Province</label>
                            <select
                                value={formData.province || ""}
                                onChange={e => setFormData({ ...formData, province: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="">Select Province</option>
                                {SRI_LANKA_PROVINCES.map(province => (
                                    <option key={province} value={province}>{province}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Address / Location</label>
                            <input
                                value={formData.location || ""}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="e.g., 123 Beach Road, Matara"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            💰 Pricing & Capacity
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Min Price ($)</label>
                                <input
                                    type="number"
                                    value={formData.price_range_min}
                                    onChange={e => setFormData({ ...formData, price_range_min: Number(e.target.value) })}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Price ($)</label>
                                <input
                                    type="number"
                                    value={formData.price_range_max}
                                    onChange={e => setFormData({ ...formData, price_range_max: Number(e.target.value) })}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Group Size</label>
                                <input
                                    type="number"
                                    value={formData.group_size || 0}
                                    onChange={e => setFormData({ ...formData, group_size: Number(e.target.value) })}
                                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Accommodation Type *</label>
                        <div className="flex flex-wrap gap-2">
                            {ACCOMMODATION_TYPES.map(type => (
                                <label key={type} className={`cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-all ${formData.type?.includes(type)
                                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                                    : 'border-gray-200 hover:border-blue-300 text-gray-600'
                                    }`}>
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

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Features & Amenities</label>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium text-sm text-gray-700">Amenities</div>
                            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                                {AMENITIES_LIST.map(amenity => (
                                    <label key={amenity} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
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
                                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                                        />
                                        <span className="text-sm text-gray-600 capitalize">{amenity.replace('_', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-medium text-sm text-gray-700">Travel Style</div>
                            <div className="p-4 flex flex-wrap gap-2">
                                {TRAVEL_STYLES.map(style => (
                                    <label key={style} className={`cursor-pointer px-3 py-1 rounded-full text-xs transition-all ${formData.travel_style?.includes(style)
                                        ? 'bg-purple-100 text-purple-700 font-medium'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
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

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Account Number</label>
                        <input
                            value={formData.account_no || ""}
                            onChange={e => setFormData({ ...formData, account_no: e.target.value })}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
                            placeholder="Account Number for payouts"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                            {isEditing ? "Save Changes" : "Create Accommodation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccommodationModal;
