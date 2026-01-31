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
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Booking History</h2>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-left border-b-2 border-gray-200">
                            <th className="pb-4 font-semibold text-gray-700">Date</th>
                            <th className="pb-4 font-semibold text-gray-700">Accommodation</th>
                            <th className="pb-4 font-semibold text-gray-700">Tourist</th>
                            <th className="pb-4 font-semibold text-gray-700">Amount</th>
                            <th className="pb-4 font-semibold text-gray-700">Status</th>
                            <th className="pb-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="py-3">
                                    {new Date(booking.start_date).toLocaleDateString()}
                                </td>
                                <td className="py-3">
                                    {booking.accommodation?.name || "Unknown"}
                                </td>
                                <td className="py-3">
                                    {booking.user?.name || "Unknown"}
                                </td>
                                <td className="py-3">
                                    <span className="font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                        Rs {booking.price.toLocaleString()}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' :
                                        booking.status === 'pending'
                                            ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200' :
                                            'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onView(booking)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                        >
                                            👁️ View
                                        </button>
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => onConfirm(booking.id)}
                                                    className="text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                                                >
                                                    ✅ Confirm
                                                </button>
                                                <button
                                                    onClick={() => onCancel(booking.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                                                >
                                                    ❌ Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <div className="text-6xl mb-4">📅</div>
                                    <p className="text-xl text-gray-600 font-medium mb-2">No bookings yet</p>
                                    <p className="text-gray-500">Bookings will appear here once tourists make reservations</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
