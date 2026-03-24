"use client";


import { Booking } from "../types";
import { X, Calendar, User, MapPin, Phone, Mail, Clock, CreditCard, Receipt, Trash2 } from "lucide-react";

interface ViewBookingModalProps {
    booking: Booking;
    onClose: () => void;
    onDelete?: (id: string) => void;
}

const ViewBookingModal = function ViewBookingModal({ booking, onClose, onDelete }: ViewBookingModalProps) {
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
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 transition-opacity backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span>Booking Details</span>
                        </h2>
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
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</span>
                            <code className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-1">
                                #{booking.id.slice(0, 12)}...
                            </code>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(booking.status)}`}>
                            {booking.status}
                        </span>
                    </div>

                    {/* Accommodation Info */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-500" />
                            Accommodation
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="font-semibold text-gray-900">{booking.accommodation?.name || "N/A"}</p>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-tight">Accommodation Property</p>
                        </div>
                    </section>

                    {/* Tourist Info */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <User size={16} className="text-indigo-500" />
                            Tourist Details
                        </h3>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {booking.user?.name?.charAt(0) || "T"}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{booking.user?.name || "N/A"}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Mail size={12} />
                                        <span>{booking.user?.email || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 pl-1">
                                <Phone size={14} className="text-gray-400" />
                                <span>{booking.user?.contact_no || "N/A"}</span>
                            </div>
                        </div>
                    </section>

                    {/* Dates */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-500" />
                            Reservation Dates
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-[10px] text-indigo-600 font-bold uppercase mb-1">Check-in</p>
                                <p className="font-bold text-gray-800">{new Date(booking.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p className="text-[10px] text-indigo-600 font-bold uppercase mb-1">Check-out</p>
                                <p className="font-bold text-gray-800">{new Date(booking.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
                            <Clock size={12} />
                            <span>Duration: {Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                        </div>
                    </section>

                    {/* Payment Info */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard size={16} className="text-indigo-500" />
                            Payment Summary
                        </h3>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Receipt size={18} className="text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-800">Total Amount Paid</span>
                                </div>
                                <span className="text-xl font-bold text-emerald-700">Rs {booking.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        Close Details
                    </button>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(booking.id)}
                            className="w-full py-3 px-4 bg-white text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} />
                            Delete Booking
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewBookingModal;
