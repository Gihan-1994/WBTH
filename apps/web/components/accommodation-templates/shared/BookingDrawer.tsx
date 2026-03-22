"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { X, CalendarX } from "lucide-react";
import { AccommodationData } from "../types";
import PaymentModal from "@/components/payments/PaymentModal";

interface BookingDrawerProps {
    accommodation: AccommodationData;
    isOpen: boolean;
    onClose: () => void;
    themeColor: string;
}

export default function BookingDrawer({
    accommodation,
    isOpen,
    onClose,
    themeColor,
}: BookingDrawerProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [createdBooking, setCreatedBooking] = useState<any>(null);
    const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string | null }[]>([]);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: "",
        price: accommodation.booking_price || accommodation.price_range_min || 0,
        paymentMethod: (accommodation.online_payment_enabled !== false ? "online" : "pay_at_property") as "online" | "pay_at_property",
    });

    useEffect(() => {
        const fetchBlockedDates = async () => {
            if (!isOpen || !accommodation.id) return;
            try {
                const res = await fetch(`/api/accommodations/${accommodation.id}/bookings`);
                if (res.ok) {
                    const data = await res.json();
                    setBlockedDates(data.blockedDates || []);
                }
            } catch (error) {
                console.error("Failed to fetch blocked dates", error);
            }
        };
        fetchBlockedDates();
    }, [isOpen, accommodation.id]);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "accommodation",
                    itemId: accommodation.id,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    price: bookingData.price,
                    location: accommodation.location,
                    paymentMethod: bookingData.paymentMethod,
                }),
            });

            if (res.ok) {
                const booking = await res.json();
                setCreatedBooking(booking);
                onClose();

                if (bookingData.paymentMethod === "online") {
                    setShowPaymentModal(true);
                } else {
                    alert("Booking confirmed! You will pay at the property upon arrival.");
                    router.push("/dashboard/tourist");
                }
            } else {
                const error = await res.json();
                alert(`Booking failed: ${error.error}`);
            }
        } catch (error) {
            console.error("Booking error", error);
            alert("An error occurred while booking.");
        }
    };

    const calculateNights = () => {
        if (!bookingData.startDate || !bookingData.endDate) return 0;
        return Math.max(1, Math.ceil(
            (new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24)
        ));
    };

    if (!isOpen && !showPaymentModal) return null;

    return (
        <>
            {/* Booking Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/40 transition-opacity"
                        onClick={onClose}
                    />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Reserve your stay</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form onSubmit={handleBookingSubmit} className="space-y-5">
                                {/* Fully Booked Dates */}
                                {blockedDates.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CalendarX size={18} className="text-red-600" />
                                            <h3 className="font-medium text-red-800">Fully Booked Dates</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                            {blockedDates.map((blocked, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                                                >
                                                    {new Date(blocked.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-red-600 mt-3">
                                            This property is fully booked on these dates.
                                        </p>
                                    </div>
                                )}

                                {/* Date Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Dates</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5">Check-in</label>
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none text-sm"
                                                style={{ "--tw-ring-color": themeColor } as any}
                                                value={bookingData.startDate}
                                                onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5">Check-out</label>
                                            <input
                                                type="date"
                                                required
                                                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent outline-none text-sm"
                                                style={{ "--tw-ring-color": themeColor } as any}
                                                value={bookingData.endDate}
                                                onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Check-in/out Times */}
                                {(accommodation.check_in_time || accommodation.check_out_time) && (
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        {accommodation.check_in_time && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Check-in time</span>
                                                <span className="font-medium">{accommodation.check_in_time}</span>
                                            </div>
                                        )}
                                        {accommodation.check_out_time && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Check-out time</span>
                                                <span className="font-medium">{accommodation.check_out_time}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Price Summary */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Price per night</span>
                                        <span className="font-medium">LKR {bookingData.price.toLocaleString()}</span>
                                    </div>
                                    {bookingData.startDate && bookingData.endDate && (
                                        <>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">{calculateNights()} nights</span>
                                                <span className="text-gray-600">
                                                    LKR {bookingData.price.toLocaleString()} x {calculateNights()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold" style={{ color: themeColor }}>
                                                    LKR {(bookingData.price * calculateNights()).toLocaleString()}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                                    {accommodation.online_payment_enabled === false ? (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                            <p className="text-sm text-amber-700">
                                                This property accepts payment at arrival only
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label
                                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                                                    bookingData.paymentMethod === "online"
                                                        ? "border-2"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                style={bookingData.paymentMethod === "online" ? { borderColor: themeColor, backgroundColor: `${themeColor}10` } : {}}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="online"
                                                    checked={bookingData.paymentMethod === "online"}
                                                    onChange={() => setBookingData({ ...bookingData, paymentMethod: "online" })}
                                                    className="w-4 h-4"
                                                    style={{ accentColor: themeColor }}
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">Pay now (Card)</p>
                                                    <p className="text-xs text-gray-500">Secure payment via Stripe</p>
                                                </div>
                                            </label>
                                            <label
                                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                                                    bookingData.paymentMethod === "pay_at_property"
                                                        ? "border-2"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                style={bookingData.paymentMethod === "pay_at_property" ? { borderColor: themeColor, backgroundColor: `${themeColor}10` } : {}}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="pay_at_property"
                                                    checked={bookingData.paymentMethod === "pay_at_property"}
                                                    onChange={() => setBookingData({ ...bookingData, paymentMethod: "pay_at_property" })}
                                                    className="w-4 h-4"
                                                    style={{ accentColor: themeColor }}
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">Pay at property</p>
                                                    <p className="text-xs text-gray-500">Pay upon arrival</p>
                                                </div>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full text-white py-3 rounded-lg font-semibold transition-colors"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    {bookingData.paymentMethod === "online" ? "Continue to Payment" : "Confirm Reservation"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && createdBooking && (
                <PaymentModal
                    bookingId={createdBooking.id}
                    bookingDetails={{
                        providerName: accommodation.name,
                        startDate: createdBooking.start_date,
                        endDate: createdBooking.end_date,
                        location: accommodation.location || "",
                        price: createdBooking.price,
                        type: "accommodation",
                    }}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        router.push("/dashboard/tourist");
                    }}
                />
            )}
        </>
    );
}
