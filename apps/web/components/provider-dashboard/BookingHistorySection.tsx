"use client";

import { Booking } from "./types";
import { Eye, Check, X, Calendar, CreditCard, Banknote } from "lucide-react";

interface BookingHistorySectionProps {
    bookings: Booking[];
    onView: (booking: Booking) => void;
    onConfirm: (id: string) => void;
    onCancel: (id: string) => void;
    onMarkPaid?: (id: string) => void;
}

export default function BookingHistorySection({
    bookings,
    onView,
    onConfirm,
    onCancel,
    onMarkPaid
}: BookingHistorySectionProps) {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'captured':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'authorized':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Booking History</h2>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                        <tr className="border-b border-gray-200">
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Period</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Accommodation</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tourist</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500 text-xs w-16">Check-in:</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(booking.start_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500 text-xs w-16">Check-out:</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(booking.end_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1">
                                            {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} nights
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900">
                                        {booking.accommodation?.name || "Unknown"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {booking.user?.name || "Unknown"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-emerald-600">
                                        Rs {booking.price.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border w-fit ${
                                            booking.payment_method === 'online'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {booking.payment_method === 'online' ? (
                                                <><CreditCard size={12} /> Online</>
                                            ) : (
                                                <><Banknote size={12} /> At Property</>
                                            )}
                                        </span>
                                        {booking.payment_method === 'pay_at_property' && booking.is_paid && (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase w-fit">
                                                Paid
                                            </span>
                                        )}
                                        {booking.payment_method === 'pay_at_property' && !booking.is_paid && booking.status !== 'cancelled' && (
                                            <button
                                                onClick={() => onMarkPaid?.(booking.id)}
                                                className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer w-fit"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize w-fit ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        {booking.payment_method === 'online' && booking.payments && booking.payments.length > 0 && (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase w-fit ${getStatusStyles(booking.payments[0].status)}`}>
                                                {booking.payments[0].status === 'captured' ? 'Paid' : booking.payments[0].status}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(booking)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => onConfirm(booking.id)}
                                                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Confirm"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onCancel(booking.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {bookings.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium mb-1">No bookings yet</p>
                        <p className="text-gray-500 text-sm">Bookings will appear here once tourists make reservations</p>
                    </div>
                )}
            </div>
        </div>
    );
}
