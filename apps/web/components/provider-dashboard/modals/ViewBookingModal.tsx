"use client";


import { Booking } from "../types";

interface ViewBookingModalProps {
    booking: Booking;
    onClose: () => void;
}

const ViewBookingModal = function ViewBookingModal({ booking, onClose }: ViewBookingModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">📄 Booking Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="text-sm text-gray-500 font-medium">Booking ID</div>
                            <div className="text-xs text-gray-400 font-mono bg-gray-200 px-2 py-1 rounded">{booking.id}</div>
                        </div>

                        <div className="pt-2 border-t border-gray-200"></div>

                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Accommodation</div>
                            <div className="font-semibold text-gray-800 text-lg">{booking.accommodation?.name || "N/A"}</div>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tourist info</div>
                            <div className="font-medium text-gray-800">{booking.user?.name || "N/A"}</div>
                            <div className="text-sm text-gray-600">{booking.user?.email || "N/A"}</div>
                            <div className="text-sm text-gray-600">{booking.user?.contact_no || "N/A"}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="text-xs text-blue-600 uppercase font-semibold mb-1">Check-in</div>
                            <div className="font-bold text-gray-800">{new Date(booking.start_date).toLocaleDateString()}</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="text-xs text-blue-600 uppercase font-semibold mb-1">Check-out</div>
                            <div className="font-bold text-gray-800">{new Date(booking.end_date).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                        <div>
                            <div className="text-xs text-green-700 uppercase font-semibold mb-1">Total Price</div>
                            <div className="text-2xl font-bold text-green-700">Rs {booking.price.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</div>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700 border border-green-200' :
                                booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                    'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                {booking.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors w-full sm:w-auto"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewBookingModal;
