"use client";

import { Booking } from "./types";

interface BookingHistorySectionProps {
    bookings: Booking[];
    onView: (booking: Booking) => void;
    onConfirm: (id: string) => void;
    onCancel: (id: string) => void;
}

export default function BookingHistorySection({
    bookings,
    onView,
    onConfirm,
    onCancel
}: BookingHistorySectionProps) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
            case 'pending':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
            case 'cancelled':
                return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Booking History</h2>

            <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Tourist
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-lg font-medium">No bookings found</p>
                                            <p className="text-sm">Your booking history will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="font-medium">
                                                {new Date(booking.start_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                to {new Date(booking.end_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {booking.user?.name || "Unknown"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {booking.user?.email || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                            ${booking.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(booking.status)}`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => onView(booking)}
                                                className="text-blue-600 hover:text-blue-900 hover:underline transition-colors"
                                            >
                                                👁️ View
                                            </button>
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => onConfirm(booking.id)}
                                                        className="text-green-600 hover:text-green-900 hover:underline transition-colors"
                                                    >
                                                        ✅ Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => onCancel(booking.id)}
                                                        className="text-red-600 hover:text-red-900 hover:underline transition-colors"
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
