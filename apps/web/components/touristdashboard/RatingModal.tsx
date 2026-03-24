"use client";

import { useState, useEffect } from "react";
import { X, Star, Loader2 } from "lucide-react";

interface RatingModalProps {
    bookingId: string;
    providerName: string;
    currentRating?: number;
    currentComment?: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

export default function RatingModal({
    bookingId,
    providerName,
    currentRating = 0,
    currentComment = "",
    onClose,
    onSuccess,
}: RatingModalProps) {
    const [rating, setRating] = useState(currentRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(currentComment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/ratings/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, rating, comment }),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to submit rating");
            }
        } catch (err) {
            setError("An error occurred while submitting rating");
        } finally {
            setLoading(false);
        }
    };

    const activeRating = hoverRating || rating;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                className={`relative w-full max-w-md bg-white h-full shadow-xl flex flex-col transition-transform duration-200 ease-out ${
                    isVisible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Rate Your Experience</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Provider Info */}
                        <div className="mb-8">
                            <p className="text-sm text-gray-500 mb-1">You're rating</p>
                            <p className="text-base font-medium text-gray-900">{providerName}</p>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-8">
                            <p className="text-sm font-medium text-gray-700 mb-4">How was your stay?</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={`transition-colors ${
                                                star <= activeRating
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {activeRating > 0 && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {ratingLabels[activeRating]}
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Share your thoughts
                                <span className="font-normal text-gray-400 ml-1">(optional)</span>
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-gray-400"
                                placeholder="What did you like or dislike about your experience?"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    currentRating > 0 ? "Update" : "Submit"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
