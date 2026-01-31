"use client";

import { useState } from "react";
import { Eye, Star } from "lucide-react";
import { Booking } from "./types";
import RatingModal from "./RatingModal";

interface BookingHistorySectionProps {
    bookings: Booking[];
    onViewBooking: (booking: Booking) => void;
    onCancelBooking: (id: string) => void;
    onRefresh?: () => void;
}

/**
 * Section displaying the tourist's booking history
 */
export default function BookingHistorySection({
    bookings,
    onViewBooking,
    onCancelBooking,
    onRefresh
}: BookingHistorySectionProps) {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const handleRateClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowRatingModal(true);
    };

    const handleRatingSuccess = () => {
        setShowRatingModal(false);
        setSelectedBooking(null);
        if (onRefresh) onRefresh();
        alert("Rating submitted successfully!");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex-1 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h2>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-left border-b-2 border-gray-200">
                            <th className="pb-4 font-semibold text-gray-700">Date</th>
                            <th className="pb-4 font-semibold text-gray-700">Details</th>
                            <th className="pb-4 font-semibold text-gray-700">Amount</th>
                            <th className="pb-4 font-semibold text-gray-700">Status</th>
                            <th className="pb-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="py-4 text-gray-700">
                                    {new Date(booking.start_date).toLocaleDateString()}
                                </td>
                                <td className="py-4">
                                    <div className="font-semibold text-gray-800">
                                        {booking.type === 'guide'
                                            ? (booking.guide?.user?.name || "Guide Booking")
                                            : (booking.accommodation?.name || "Accommodation Booking")}
                                    </div>
                                    <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                                        {booking.type}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Rs {booking.price.toLocaleString()}
                                    </span>
                                </td>
                                <td className="py-4">
                                    <div className="flex flex-col gap-1">
                                        {/* Booking Status */}
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' :
                                            booking.status === 'pending'
                                                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200' :
                                                'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        {/* Payment Status */}
                                        {(booking as any).payments?.[0] && (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${(booking as any).payments[0].status === 'captured'
                                                ? 'bg-green-50 text-green-600 border border-green-200' :
                                                (booking as any).payments[0].status === 'authorized'
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                                    (booking as any).payments[0].status === 'cancelled'
                                                        ? 'bg-red-50 text-red-600 border border-red-200' :
                                                        'bg-gray-50 text-gray-600 border border-gray-200'
                                                }`}>
                                                💳 {(booking as any).payments[0].status}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onViewBooking(booking)}
                                            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                        {booking.status === 'pending' && (
                                            <button
                                                onClick={() => onCancelBooking(booking.id)}
                                                className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleRateClick(booking)}
                                                className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1 hover:underline"
                                            >
                                                <Star size={16} className={(booking as any).rating ? "fill-yellow-400" : ""} />
                                                {(booking as any).rating ? 'Update Rating' : 'Rate'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center">
                                    <div className="text-6xl mb-4">📅</div>
                                    <p className="text-xl text-gray-600 font-medium mb-2">No bookings yet</p>
                                    <p className="text-gray-500">Start exploring and make your first booking!</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Rating Modal */}
            {showRatingModal && selectedBooking && (
                <RatingModal
                    bookingId={selectedBooking.id}
                    providerName={
                        selectedBooking.type === 'guide'
                            ? (selectedBooking.guide?.user?.name || "Guide")
                            : (selectedBooking.accommodation?.name || "Accommodation")
                    }
                    currentRating={(selectedBooking as any).rating?.rating || 0}
                    currentComment={(selectedBooking as any).rating?.comment || ""}
                    onClose={() => setShowRatingModal(false)}
                    onSuccess={handleRatingSuccess}
                />
            )}
        </div>
    );
}
