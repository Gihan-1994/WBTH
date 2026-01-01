"use client";

import { useState } from "react";
import { Accommodation } from "../types";

interface AccommodationImagesModalProps {
    accommodation: Accommodation;
    onClose: () => void;
    onSave: () => void;
}

const AccommodationImagesModal = function AccommodationImagesModal({ accommodation, onClose, onSave }: AccommodationImagesModalProps) {
    const [images, setImages] = useState<string[]>(accommodation.images || []);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];
        let processed = 0;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) return;
            if (file.size > 2 * 1024 * 1024) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result as string);
                processed++;
                if (processed === files.length) {
                    setImages([...images, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    async function handleSave() {
        setUploading(true);
        try {
            const res = await fetch(`/api/accommodation-provider/accommodations/${accommodation.id}/images`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images }),
            });
            if (res.ok) {
                alert("Images updated successfully!");
                onSave();
            } else {
                alert("Failed to update images");
            }
        } catch (err) {
            alert("Error updating images");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Manage Images</h2>
                        <p className="text-sm text-gray-500 mt-1">For {accommodation.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                    {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
                            <img
                                src={img}
                                alt={`Accommodation ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white transform hover:scale-105"
                                title="Remove image"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    <label className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group">
                        <div className="bg-blue-50 text-blue-500 p-3 rounded-full mb-2 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add Images</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Upload Guidelines</h4>
                    <p className="text-xs text-blue-600">
                        • Supported formats: JPEG, PNG, WebP<br />
                        • Maximum file size: 2MB per image<br />
                        • Recommended aspect ratio: 4:3 or 16:9
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccommodationImagesModal;
