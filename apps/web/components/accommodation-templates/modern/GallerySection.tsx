"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { AccommodationData } from "../types";

interface GallerySectionProps {
    accommodation: AccommodationData;
    themeColor: string;
}

export default function GallerySection({ accommodation, themeColor }: GallerySectionProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const images = accommodation.images;

    if (images.length === 0) return null;

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section id="facilities" className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Gallery
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Take a look at our beautiful property
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => openLightbox(idx)}
                            className={`relative overflow-hidden rounded-xl hover:opacity-90 transition-opacity ${
                                idx === 0 ? "col-span-2 row-span-2" : ""
                            }`}
                        >
                            <div className={`${idx === 0 ? "aspect-square" : "aspect-square"}`}>
                                <img
                                    src={img}
                                    alt={`Gallery ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* House Rules */}
                {accommodation.house_rules && accommodation.house_rules.length > 0 && (
                    <div className="mt-16">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">House Rules</h3>
                        <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-sm">
                            <div className="space-y-3">
                                {accommodation.house_rules.map((rule, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span
                                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
                                            style={{ backgroundColor: themeColor }}
                                        >
                                            {idx + 1}
                                        </span>
                                        <p className="text-gray-700">{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <ChevronLeft size={40} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <ChevronRight size={40} />
                            </button>
                        </>
                    )}

                    <img
                        src={images[lightboxIndex]}
                        alt={`Gallery ${lightboxIndex + 1}`}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                    />

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {lightboxIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}
