"use client";

import { Booking } from "../types";
import { X, Calendar, User, Mail, Phone, DollarSign } from "lucide-react";

interface ViewBookingModalProps {
    booking: Booking;
    onClose: () => void;
}

export default function ViewBookingModal({ booking, onClose }: ViewBookingModalProps) {
    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-teal-50 text-teal-700 border-teal-200';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                            <Calendar size={20} className="text-teal-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
                            <p className="text-xs text-gray-500 font-mono">{booking.id.slice(0, 8)}...</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyles(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                    </div>

                    {/* Tourist Information */}
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                            <h3 className="text-sm font-semibold text-gray-700">Tourist Information</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <User size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Name</p>
                                    <p className="font-medium text-gray-900">{booking.user?.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Mail size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">{booking.user?.email || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Phone size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{booking.user?.contact_no || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Dates */}
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                            <h3 className="text-sm font-semibold text-gray-700">Schedule</h3>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {startDate.toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">{startDate.getFullYear()}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">End Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {endDate.toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-500">{endDate.getFullYear()}</p>
                                </div>
                            </div>
                            <div className="mt-3 p-3 bg-teal-50 rounded-lg text-center">
                                <span className="text-teal-700 font-medium">{days} day{days > 1 ? 's' : ''} tour</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                            <h3 className="text-sm font-semibold text-gray-700">Payment</h3>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                        <DollarSign size={18} className="text-teal-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium">Total Amount</span>
                                </div>
                                <span className="text-xl font-bold text-teal-700">
                                    Rs {booking.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
