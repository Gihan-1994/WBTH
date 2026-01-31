"use client";

import { Booking } from "../types";

interface ViewBookingModalProps {
    booking: Booking;
    onClose: () => void;
}

/**
 * Modal for viewing detailed information about a single booking
 */
export default function ViewBookingModal({ booking, onClose }: ViewBookingModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Booking Details</h2>
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Booking ID</div>
                        <div className="font-semibold text-gray-800">{booking.id}</div>
                    </div>
                    {booking.type === 'guide' ? (
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-gray-500 mb-1">Guide</div>
                            <div className="font-semibold text-gray-800">{booking.guide?.user?.name || "N/A"}</div>
                        </div>
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-gray-500 mb-1">Accommodation</div>
                            <div className="font-semibold text-gray-800">{booking.accommodation?.name || "N/A"}</div>
                        </div>
                    )}
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                        <div className="font-semibold text-gray-800">
                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Price</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Rs {booking.price.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' :
                            booking.status === 'pending'
                                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200' :
                                'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                            }`}>
                            {booking.status}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
