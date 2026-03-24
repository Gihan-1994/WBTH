"use client";

import { useState } from "react";
import {
    X,
    Type,
    Palette,
    Layers,
    Save,
    Eye,
    Plus,
    Trash2,
    Check
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface WebsiteData {
    description: string;
    tagline: string;
    check_in_time: string;
    check_out_time: string;
    house_rules: string[];
    theme_color: string;
    hero_image_index: number;
    template_style: string;
    custom_sections: {
        facilities: { id: string; name: string; description: string }[];
        testimonials: { id: string; name: string; text: string; rating: number }[];
    };
}

interface WebsiteEditorModalProps {
    accommodation: {
        id: string;
        name: string;
        images: string[];
        description?: string | null;
        tagline?: string | null;
        check_in_time?: string | null;
        check_out_time?: string | null;
        house_rules?: string[];
        theme_color?: string | null;
        hero_image_index?: number | null;
        template_style?: string | null;
        custom_sections?: any;
    };
    onClose: () => void;
    onSave: () => void;
}

const PRESET_COLORS = [
    "#4F46E5", // Indigo
    "#0EA5E9", // Sky
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#F97316", // Orange
    "#6366F1", // Indigo 500
    "#84CC16", // Lime
    "#1F2937", // Gray 800
];

const TEMPLATES = [
    {
        id: "modern",
        name: "Modern",
        description: "Clean and minimal design with full-width hero",
        preview: "bg-gradient-to-br from-white to-gray-100",
    },
    {
        id: "classic",
        name: "Classic",
        description: "Traditional hotel website with tabbed navigation",
        preview: "bg-gradient-to-br from-gray-800 to-gray-900",
    },
    {
        id: "luxury",
        name: "Luxury",
        description: "Premium look with dark header and large typography",
        preview: "bg-gradient-to-br from-amber-900 to-gray-900",
    },
];

export default function WebsiteEditorModal({
    accommodation,
    onClose,
    onSave,
}: WebsiteEditorModalProps) {
    const [activeTab, setActiveTab] = useState<"content" | "design" | "sections">("content");
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    const [data, setData] = useState<WebsiteData>({
        description: accommodation.description || "",
        tagline: accommodation.tagline || "",
        check_in_time: accommodation.check_in_time || "2:00 PM",
        check_out_time: accommodation.check_out_time || "11:00 AM",
        house_rules: accommodation.house_rules || [],
        theme_color: accommodation.theme_color || "#4F46E5",
        hero_image_index: accommodation.hero_image_index || 0,
        template_style: accommodation.template_style || "modern",
        custom_sections: accommodation.custom_sections || {
            facilities: [],
            testimonials: [],
        },
    });

    const [newRule, setNewRule] = useState("");
    const [newFacility, setNewFacility] = useState({ name: "", description: "" });
    const [newTestimonial, setNewTestimonial] = useState({ name: "", text: "", rating: 5 });

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/accommodation-provider/accommodations/${accommodation.id}/website`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success("Website settings saved!");
                onSave();
                onClose();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to save");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const addHouseRule = () => {
        if (newRule.trim()) {
            setData({ ...data, house_rules: [...data.house_rules, newRule.trim()] });
            setNewRule("");
        }
    };

    const removeHouseRule = (index: number) => {
        setData({
            ...data,
            house_rules: data.house_rules.filter((_, i) => i !== index),
        });
    };

    const addFacility = () => {
        if (newFacility.name.trim()) {
            setData({
                ...data,
                custom_sections: {
                    ...data.custom_sections,
                    facilities: [
                        ...data.custom_sections.facilities,
                        { id: Date.now().toString(), ...newFacility },
                    ],
                },
            });
            setNewFacility({ name: "", description: "" });
        }
    };

    const removeFacility = (id: string) => {
        setData({
            ...data,
            custom_sections: {
                ...data.custom_sections,
                facilities: data.custom_sections.facilities.filter((f) => f.id !== id),
            },
        });
    };

    const addTestimonial = () => {
        if (newTestimonial.name.trim() && newTestimonial.text.trim()) {
            setData({
                ...data,
                custom_sections: {
                    ...data.custom_sections,
                    testimonials: [
                        ...data.custom_sections.testimonials,
                        { id: Date.now().toString(), ...newTestimonial },
                    ],
                },
            });
            setNewTestimonial({ name: "", text: "", rating: 5 });
        }
    };

    const removeTestimonial = (id: string) => {
        setData({
            ...data,
            custom_sections: {
                ...data.custom_sections,
                testimonials: data.custom_sections.testimonials.filter((t) => t.id !== id),
            },
        });
    };

    const tabs = [
        { id: "content", label: "Content", icon: Type },
        { id: "design", label: "Design", icon: Palette },
        { id: "sections", label: "Sections", icon: Layers },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit Website
                        </h2>
                        <p className="text-sm text-gray-500">{accommodation.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`/accommodations/${accommodation.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Eye size={16} />
                            Preview
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 px-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                    activeTab === tab.id
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Content Tab */}
                    {activeTab === "content" && (
                        <div className="space-y-6">
                            {/* Tagline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    value={data.tagline}
                                    onChange={(e) => setData({ ...data, tagline: e.target.value })}
                                    placeholder="e.g., Your gateway to paradise"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">A short marketing phrase displayed on your page</p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    About / Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    rows={5}
                                    placeholder="Tell visitors about your accommodation..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                                />
                            </div>

                            {/* Check-in/out Times */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-in Time
                                    </label>
                                    <input
                                        type="text"
                                        value={data.check_in_time}
                                        onChange={(e) => setData({ ...data, check_in_time: e.target.value })}
                                        placeholder="e.g., 2:00 PM"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-out Time
                                    </label>
                                    <input
                                        type="text"
                                        value={data.check_out_time}
                                        onChange={(e) => setData({ ...data, check_out_time: e.target.value })}
                                        placeholder="e.g., 11:00 AM"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* House Rules */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    House Rules
                                </label>
                                <div className="space-y-2 mb-3">
                                    {data.house_rules.map((rule, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <span className="flex-1 text-gray-700">{rule}</span>
                                            <button
                                                onClick={() => removeHouseRule(idx)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newRule}
                                        onChange={(e) => setNewRule(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addHouseRule()}
                                        placeholder="Add a house rule..."
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    <button
                                        onClick={addHouseRule}
                                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Design Tab */}
                    {activeTab === "design" && (
                        <div className="space-y-8">
                            {/* Template Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Template Style
                                </label>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {TEMPLATES.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => setData({ ...data, template_style: template.id })}
                                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                                                data.template_style === template.id
                                                    ? "border-indigo-600 bg-indigo-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            {data.template_style === template.id && (
                                                <span className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                    <Check size={12} className="text-white" />
                                                </span>
                                            )}
                                            <div className={`h-20 rounded-lg mb-3 ${template.preview}`} />
                                            <p className="font-medium text-gray-900">{template.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Brand Color
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setData({ ...data, theme_color: color })}
                                            className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                                                data.theme_color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={data.theme_color}
                                            onChange={(e) => setData({ ...data, theme_color: e.target.value })}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <div
                                            className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center"
                                            style={{ backgroundColor: data.theme_color }}
                                        >
                                            <Plus size={14} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Current:</span>
                                    <span
                                        className="px-3 py-1 rounded text-sm font-mono text-white"
                                        style={{ backgroundColor: data.theme_color }}
                                    >
                                        {data.theme_color}
                                    </span>
                                </div>
                            </div>

                            {/* Hero Image Selection */}
                            {accommodation.images.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Hero Image
                                    </label>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                        {accommodation.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setData({ ...data, hero_image_index: idx })}
                                                className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                                                    data.hero_image_index === idx
                                                        ? "ring-2 ring-indigo-600 ring-offset-2"
                                                        : "opacity-60 hover:opacity-100"
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Image ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {data.hero_image_index === idx && (
                                                    <span className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                        <Check size={12} className="text-white" />
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sections Tab */}
                    {activeTab === "sections" && (
                        <div className="space-y-8">
                            {/* Facilities */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-4">
                                    Additional Facilities
                                </h3>
                                <div className="space-y-3 mb-4">
                                    {data.custom_sections.facilities.map((facility) => (
                                        <div
                                            key={facility.id}
                                            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{facility.name}</p>
                                                {facility.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{facility.description}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFacility(facility.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                                    <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                        <input
                                            type="text"
                                            value={newFacility.name}
                                            onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                                            placeholder="Facility name"
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={newFacility.description}
                                            onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
                                            placeholder="Description (optional)"
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={addFacility}
                                        className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700"
                                    >
                                        <Plus size={16} />
                                        Add Facility
                                    </button>
                                </div>
                            </div>

                            {/* Testimonials */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-4">
                                    Testimonials
                                </h3>
                                <div className="space-y-3 mb-4">
                                    {data.custom_sections.testimonials.map((testimonial) => (
                                        <div
                                            key={testimonial.id}
                                            className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-xs ${i < testimonial.rating ? "text-amber-400" : "text-gray-300"}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600">"{testimonial.text}"</p>
                                            </div>
                                            <button
                                                onClick={() => removeTestimonial(testimonial.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                                    <div className="space-y-3 mb-3">
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={newTestimonial.name}
                                                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                                placeholder="Guest name"
                                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">Rating:</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                                                            className={`text-xl ${star <= newTestimonial.rating ? "text-amber-400" : "text-gray-300"}`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <textarea
                                            value={newTestimonial.text}
                                            onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                            placeholder="Their review..."
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                                        />
                                    </div>
                                    <button
                                        onClick={addTestimonial}
                                        className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700"
                                    >
                                        <Plus size={16} />
                                        Add Testimonial
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
