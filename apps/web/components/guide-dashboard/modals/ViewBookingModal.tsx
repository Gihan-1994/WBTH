"use client";

import { Booking } from "../types";

interface ViewBookingModalProps {
    booking: Booking;
    onClose: () => void;
}

export default function ViewBookingModal({ booking, onClose }: ViewBookingModalProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all animate-slideUp">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Booking Details</h2>

                <div className="space-y-4">
                    {/* Booking ID */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500 font-medium mb-1">Booking ID</div>
                        <div className="text-sm font-mono text-gray-800">{booking.id}</div>
                    </div>

                    {/* Tourist Information */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="text-xs text-blue-700 font-bold mb-3">👤 TOURIST INFORMATION</div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Name:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {booking.user?.name || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Email:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {booking.user?.email || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Phone:</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {booking.user?.contact_no || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="text-xs text-purple-700 font-bold mb-3">📅 BOOKING DETAILS</div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Start Date:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {new Date(booking.start_date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">End Date:</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {new Date(booking.end_date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                                <span className="text-sm text-gray-600">Total Price:</span>
                                <span className="text-lg font-bold text-green-600">
                                    Rs {booking.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(booking.status)}`}>
                            {booking.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
