"use client";

import { useState } from "react";
import {
    Eye,
    Star,
    CreditCard,
    Banknote,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Calendar,
    ArrowRight,
    Copy,
    Search,
    Filter,
    XCircle
} from "lucide-react";
import { Booking } from "./types";
import RatingModal from "./RatingModal";

interface BookingHistorySectionProps {
    bookings: Booking[];
    onViewBooking: (booking: Booking) => void;
    onCancelBooking: (id: string) => void;
    onDeleteBooking?: (id: string) => void;
    onBulkDeleteBookings?: (ids: string[]) => void;
    onRefresh?: () => void;
}

const ITEMS_PER_PAGE = 8;

export default function BookingHistorySection({
    bookings,
    onViewBooking,
    onCancelBooking,
    onDeleteBooking,
    onBulkDeleteBookings,
    onRefresh
}: BookingHistorySectionProps) {
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredBookings = bookings.filter(booking => {
        const name = booking.type === 'guide'
            ? (booking.guide?.user?.name || "")
            : (booking.accommodation?.name || "");
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedBookings.length && paginatedBookings.length > 0) {
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

    const handleRateClick = (booking: Booking) => {
        setSelectedBookingForRating(booking);
        setShowRatingModal(true);
    };

    const handleRatingSuccess = () => {
        setShowRatingModal(false);
        setSelectedBookingForRating(null);
        if (onRefresh) onRefresh();
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-4">
            {/* Header & Controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">My Bookings</h2>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={() => {
                                onBulkDeleteBookings?.(selectedIds);
                                setSelectedIds([]);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            <Trash2 size={16} />
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-3 text-left w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 transition-colors cursor-pointer"
                                        checked={paginatedBookings.length > 0 && selectedIds.length === paginatedBookings.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Destination / Guide</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Period</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedBookings.map((booking) => (
                                <tr key={booking.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(booking.id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 transition-colors cursor-pointer"
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
                                                onClick={() => navigator.clipboard.writeText(booking.id)}
                                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                title="Copy full ID"
                                            >
                                                <Copy size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    {/* Destination / Guide */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {booking.type === 'guide'
                                                    ? (booking.guide?.user?.name || "Guide Booking")
                                                    : (booking.accommodation?.name || "Accommodation Booking")}
                                            </span>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">
                                                {booking.type}
                                            </span>
                                        </div>
                                    </td>
                                    {/* Period */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="flex items-center gap-1 text-gray-900">
                                                <span>{new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                <ArrowRight size={14} className="text-gray-400" />
                                                <span>{new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Amount */}
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-blue-600">
                                            Rs {booking.price.toLocaleString()}
                                        </span>
                                    </td>
                                    {/* Payment */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase border w-fit ${
                                                booking.payment_method === 'online'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {booking.payment_method === 'online' ? (
                                                    <><CreditCard size={12} /> Online</>
                                                ) : (
                                                    <><Banknote size={12} /> Property</>
                                                )}
                                            </span>
                                            {booking.payment_method === 'online' && booking.payments?.[0] && (
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border w-fit ${
                                                    booking.payments[0].status === 'captured'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                    {booking.payments[0].status === 'captured' ? 'Paid' : booking.payments[0].status}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border capitalize w-fit ${getStatusStyles(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onViewBooking(booking)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleRateClick(booking)}
                                                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title={(booking as any).rating ? 'Update Rating' : 'Rate'}
                                                >
                                                    <Star size={18} className={(booking as any).rating ? "fill-amber-400 text-amber-400" : ""} />
                                                </button>
                                            )}
                                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                <button
                                                    onClick={() => onCancelBooking(booking.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            {booking.status === 'cancelled' && (
                                                <button
                                                    onClick={() => onDeleteBooking?.(booking.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete from history"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredBookings.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
                        <p className="text-sm text-gray-600">
                            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length} bookings
                        </p>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-sm text-gray-700 font-medium px-2">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {filteredBookings.length === 0 && (
                    <div className="py-20 text-center bg-white">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={28} className="text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-semibold mb-1">No bookings found</h3>
                        <p className="text-gray-500 text-sm">
                            {searchTerm ? "Try adjusting your search filters" : "Start exploring and make your first booking!"}
                        </p>
                    </div>
                )}
            </div>

            {/* Rating Modal */}
            {showRatingModal && selectedBookingForRating && (
                <RatingModal
                    bookingId={selectedBookingForRating.id}
                    providerName={
                        selectedBookingForRating.type === 'guide'
                            ? (selectedBookingForRating.guide?.user?.name || "Guide")
                            : (selectedBookingForRating.accommodation?.name || "Accommodation")
                    }
                    currentRating={(selectedBookingForRating as any).rating?.rating || 0}
                    currentComment={(selectedBookingForRating as any).rating?.comment || ""}
                    onClose={() => setShowRatingModal(false)}
                    onSuccess={handleRatingSuccess}
                />
            )}
        </div>
    );
}
