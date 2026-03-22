"use client";

import { Booking } from "../types";
import { X, Calendar, MapPin, Clock, CreditCard, Receipt, Trash2, XCircle } from "lucide-react";

interface ViewBookingModalProps {
    booking: Booking;
    onClose: () => void;
    onCancel?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const ViewBookingModal = function ViewBookingModal({ booking, onClose, onCancel, onDelete }: ViewBookingModalProps) {
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

    const isAccommodation = booking.type !== 'guide';

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 transition-opacity backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Booking ID & Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking ID</span>
                            <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1">
                                #{booking.id.slice(0, 12)}...
                            </code>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(booking.status)}`}>
                            {booking.status}
                        </span>
                    </div>

                    {/* Main Info (Accommodation or Guide) */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={14} className="text-blue-500" />
                            {isAccommodation ? 'Accommodation' : 'Tour Guide'}
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="font-semibold text-gray-900 text-lg">
                                {isAccommodation
                                    ? (booking.accommodation?.name || "N/A")
                                    : (booking.guide?.user?.name || "N/A")
                                }
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {isAccommodation ? 'Property Reservation' : 'Guided Tour Service'}
                            </p>
                        </div>
                    </section>

                    {/* Travel Dates */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" />
                            Travel Period
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Check-in</p>
                                <p className="font-bold text-gray-800">{new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Check-out</p>
                                <p className="font-bold text-gray-800">{new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
                            <Clock size={12} />
                            <span>Duration: {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                        </div>
                    </section>

                    {/* Payment Summary */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <CreditCard size={14} className="text-blue-500" />
                            Payment Summary
                        </h3>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-emerald-100/50">
                                <div className="flex items-center gap-2">
                                    <Receipt size={16} className="text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-800">Total Price</span>
                                </div>
                                <span className="text-lg font-bold text-emerald-700">Rs {booking.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-emerald-600 font-medium">Payment Method</span>
                                <span className="text-emerald-700 font-bold uppercase">
                                    {booking.payment_method === 'online' ? 'Online Payment' : 'Pay at Property'}
                                </span>
                            </div>
                            {booking.payment_method === 'online' && booking.payments?.[0] && (
                                <div className="flex justify-between items-center text-xs pt-1">
                                    <span className="text-emerald-600 font-medium">Payment Status</span>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase">
                                        {booking.payments[0].status === 'captured' ? 'Paid' : booking.payments[0].status}
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
                    >
                        Close Details
                    </button>

                    {(booking.status === 'pending' || booking.status === 'confirmed') && onCancel && (
                        <button
                            onClick={() => onCancel(booking.id)}
                            className="w-full py-3 px-4 bg-white text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <XCircle size={18} />
                            Cancel Booking
                        </button>
                    )}

                    {booking.status === 'cancelled' && onDelete && (
                        <button
                            onClick={() => onDelete(booking.id)}
                            className="w-full py-3 px-4 bg-white text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} />
                            Remove from History
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewBookingModal;
