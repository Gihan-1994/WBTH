"use client";

import { Booking } from "./types";
import { Eye, Check, X, Calendar, ClipboardList } from "lucide-react";

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
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-teal-50 text-teal-700';
            case 'pending':
                return 'bg-amber-50 text-amber-700';
            case 'cancelled':
                return 'bg-red-50 text-red-700';
            case 'captured':
                return 'bg-blue-50 text-blue-700';
            case 'authorized':
                return 'bg-purple-50 text-purple-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <h2 className="text-base font-semibold text-gray-900">Booking History</h2>
                </div>
                <span className="text-sm text-gray-500">{bookings.length} total</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Range
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tourist
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <ClipboardList size={28} className="text-gray-400" />
                                        </div>
                                        <p className="text-base font-medium text-gray-600">No bookings found</p>
                                        <p className="text-sm text-gray-400 mt-1">Your booking history will appear here</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr
                                    key={booking.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {new Date(booking.start_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
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
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {booking.user?.email || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900">
                                            Rs {booking.price.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full w-fit ${getStatusStyles(booking.status)}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                            {booking.payments && booking.payments.length > 0 && (
                                                <span className={`px-2 py-0.5 inline-flex text-[10px] font-bold rounded-full uppercase w-fit ${getStatusStyles(booking.payments[0].status)}`}>
                                                    {booking.payments[0].status === 'captured' ? 'Paid' : booking.payments[0].status}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onView(booking)}
                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                title="View details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => onConfirm(booking.id)}
                                                        className="p-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                                                        title="Confirm booking"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => onCancel(booking.id)}
                                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Reject booking"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
