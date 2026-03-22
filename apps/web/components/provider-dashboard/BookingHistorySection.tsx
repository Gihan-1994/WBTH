"use client";

import { useState } from "react";
import { Booking } from "./types";
import { Eye, Check, X, Calendar, CreditCard, Banknote, ArrowRight, Copy, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface BookingHistorySectionProps {
    bookings: Booking[];
    accommodationCount?: number;
    onView: (booking: Booking) => void;
    onConfirm: (id: string) => void;
    onCancel: (id: string) => void;
    onMarkPaid?: (id: string) => void;
    onDelete?: (id: string) => void;
    onBulkDelete?: (ids: string[]) => void;
}

const ITEMS_PER_PAGE = 8;

export default function BookingHistorySection({
    bookings,
    accommodationCount = 1,
    onView,
    onConfirm,
    onCancel,
    onMarkPaid,
    onDelete,
    onBulkDelete
}: BookingHistorySectionProps) {
    const showPlaceColumn = accommodationCount > 1;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBookings = bookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedBookings.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedBookings.map(b => b.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };
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
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Booking History</h2>
                {selectedIds.length > 0 && (
                    <button
                        onClick={() => {
                            if (onBulkDelete) {
                                onBulkDelete(selectedIds);
                                setSelectedIds([]);
                            }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                        <Trash2 size={16} />
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    checked={paginatedBookings.length > 0 && selectedIds.length === paginatedBookings.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Period</th>
                            {showPlaceColumn && (
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                            )}
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tourist</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedBookings.map((booking) => (
                            <tr key={booking.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(booking.id) ? 'bg-indigo-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        checked={selectedIds.includes(booking.id)}
                                        onChange={() => toggleSelect(booking.id)}
                                    />
                                </td>
                                {/* Booking ID */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                                            #{booking.id.slice(0, 8)}
                                        </code>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(booking.id);
                                            }}
                                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            title="Copy full ID"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </td>
                                {/* Booking Period */}
                                <td className="px-6 py-4">
                                    <div className="text-sm">
                                        <div className="flex items-center gap-1 text-gray-900">
                                            <span>{new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <ArrowRight size={14} className="text-gray-400" />
                                            <span>{new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} nights
                                        </span>
                                    </div>
                                </td>
                                {showPlaceColumn && (
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">
                                            {booking.accommodation?.name || "—"}
                                        </span>
                                    </td>
                                )}
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
                                        <button
                                            onClick={() => onDelete?.(booking.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            {/* Pagination */}
            {bookings.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, bookings.length)} of {bookings.length} bookings
                    </p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm text-gray-600 px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
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
    );
}
