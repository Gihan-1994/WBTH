"use client";

import { useState, useEffect } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { EventData } from "../types";

interface EditEventModalProps {
    event: EventData;
    onClose: () => void;
    onSuccess: () => void;
}

/**
 * Modal for editing an existing event
 */
export default function EditEventModal({ event, onClose, onSuccess }: EditEventModalProps) {
    const [formData, setFormData] = useState({
        title: event.title,
        category: event.category,
        date: new Date(event.date).toISOString().slice(0, 16),
        location: event.location,
        description: event.description.length > 0 ? event.description : [""],
    });
    const [eventImages, setEventImages] = useState<string[]>(event.eventImages || []);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDescriptionChange = (index: number, value: string) => {
        const newDescription = [...formData.description];
        newDescription[index] = value;
        setFormData({ ...formData, description: newDescription });
    };

    const addDescriptionField = () => {
        setFormData({
            ...formData,
            description: [...formData.description, ""],
        });
    };

    const removeDescriptionField = (index: number) => {
        const newDescription = formData.description.filter((_, i) => i !== index);
        setFormData({ ...formData, description: newDescription });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            // Validate file type
            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                alert(`Invalid file type: ${file.name}. Only JPG, PNG, and WebP are allowed.`);
                return;
            }

            // Validate file size (2MB max for original file)
            if (file.size > 2 * 1024 * 1024) {
                alert(`File too large: ${file.name}. Maximum size is 2MB.`);
                return;
            }

            // Compress and convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas for compression
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    // Calculate new dimensions (max 1200px width/height)
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 1200;

                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height / width) * maxDimension;
                            width = maxDimension;
                        } else {
                            width = (width / height) * maxDimension;
                            height = maxDimension;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression (0.7 quality for JPEG)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                    // Check if compressed image is still too large
                    if (compressedBase64.length > 1.5 * 1024 * 1024) {
                        alert(`Compressed image is still too large: ${file.name}. Please use a smaller image.`);
                        return;
                    }

                    setEventImages((prev) => [...prev, compressedBase64]);
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setEventImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.date || !formData.location) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/admin/events/${event.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    description: formData.description.filter((d) => d.trim() !== ""),
                    eventImages,
                }),
            });

            if (response.ok) {
                alert("Event updated successfully!");
                onSuccess();
            } else {
                const data = await response.json();
                alert(data.error || "Failed to update event");
            }
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Error updating event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Edit Event</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter event title"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Festival, Concert, Workshop"
                            required
                        />
                    </div>

                    {/* Date and Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Event location"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        {formData.description.map((desc, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={desc}
                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder={`Description point ${index + 1}`}
                                />
                                {formData.description.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDescriptionField(index)}
                                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addDescriptionField}
                            className="text-green-600 hover:text-green-700 text-sm font-semibold"
                        >
                            + Add Description Point
                        </button>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Event Images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <Upload className="text-gray-400" size={32} />
                                <span className="text-sm text-gray-600">
                                    Click to upload images (JPG, PNG, WebP - Max 2MB each)
                                </span>
                            </label>
                        </div>

                        {/* Image Previews */}
                        {eventImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {eventImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Event ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
