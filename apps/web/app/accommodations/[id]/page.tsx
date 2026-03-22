"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    MapPin,
    Star,
    Check,
    User,
    Calendar,
    X,
    Home,
    ChevronLeft,
    ChevronRight,
    Phone,
    Mail,
    Shield,
    Heart,
    CalendarX
} from "lucide-react";
import PaymentModal from "@/components/payments/PaymentModal";
import Footer from "@/components/Footer";

interface Accommodation {
    id: string;
    name: string;
    location: string;
    price_range_min: number;
    price_range_max: number;
    booking_price: number;
    images: string[];
    rating: number;
    type: string[];
    amenities: string[];
    interests: string[];
    travel_style: string[];
    description: string;
    online_payment_enabled: boolean;
    provider: {
        user: {
            name: string;
            email: string;
            contact_no: string;
        };
    };
}

export default function AccommodationDetailsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [createdBooking, setCreatedBooking] = useState<any>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: "",
        price: 0,
        paymentMethod: "online" as "online" | "pay_at_property",
    });
    const [blockedDates, setBlockedDates] = useState<{ date: string; reason: string | null }[]>([]);

    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const res = await fetch(`/api/accommodations/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAccommodation(data);
                    setBookingData(prev => ({
                        ...prev,
                        price: data.booking_price || data.price_range_min || 0,
                        paymentMethod: data.online_payment_enabled !== false ? "online" : "pay_at_property",
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch accommodation", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAccommodation();
    }, [id]);

    // Fetch blocked dates when booking modal opens
    useEffect(() => {
        const fetchBlockedDates = async () => {
            if (!showBookingModal || !id) return;
            try {
                const res = await fetch(`/api/accommodations/${id}/bookings`);
                if (res.ok) {
                    const data = await res.json();
                    setBlockedDates(data.blockedDates || []);
                }
            } catch (error) {
                console.error("Failed to fetch blocked dates", error);
            }
        };
        fetchBlockedDates();
    }, [showBookingModal, id]);

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
                    itemId: accommodation?.id,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    price: bookingData.price,
                    location: accommodation?.location,
                    paymentMethod: bookingData.paymentMethod,
                }),
            });

            if (res.ok) {
                const booking = await res.json();
                setCreatedBooking(booking);
                setShowBookingModal(false);

                if (bookingData.paymentMethod === "online") {
                    setShowPaymentModal(true);
                } else {
                    // Pay at property - show success and redirect
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

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!accommodation) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Accommodation not found</h2>
                    <p className="text-gray-500 mb-6">This accommodation may have been removed or doesn't exist.</p>
                    <Link href="/accommodations" className="text-indigo-600 font-medium hover:underline">
                        ← Back to accommodations
                    </Link>
                </div>
            </div>
        );
    }

    const images = accommodation.images?.length > 0 ? accommodation.images : [];
    const hasMultipleImages = images.length > 1;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
                        <span>/</span>
                        <Link href="/accommodations" className="hover:text-gray-900 transition">Accommodations</Link>
                        <span>/</span>
                        <span className="text-gray-900 truncate max-w-[200px]">{accommodation.name}</span>
                    </nav>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
                <div className="relative aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100">
                    {images.length > 0 ? (
                        <>
                            <img
                                src={images[currentImageIndex]}
                                alt={accommodation.name}
                                className="w-full h-full object-cover"
                            />
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Home size={48} className="text-gray-300" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {accommodation.type.map(t => (
                                    <span key={t} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                {accommodation.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={16} className="text-gray-400" />
                                    {accommodation.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                                    <span className="font-medium text-gray-900">{accommodation.rating || "New"}</span>
                                </span>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        {/* About */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">About this place</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {accommodation.description || `Experience a wonderful stay at ${accommodation.name}. Located in ${accommodation.location}, this accommodation offers exceptional comfort and amenities for an unforgettable experience.`}
                            </p>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        {/* Amenities */}
                        {accommodation.amenities?.length > 0 && (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">What this place offers</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {accommodation.amenities.map((amenity) => (
                                            <div key={amenity} className="flex items-center gap-3 text-gray-700">
                                                <Check size={18} className="text-gray-400 flex-shrink-0" />
                                                <span>{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <hr className="border-gray-100 mb-8" />
                            </>
                        )}

                        {/* Tags */}
                        {(accommodation.travel_style?.length > 0 || accommodation.interests?.length > 0) && (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {accommodation.travel_style?.map((style) => (
                                            <span key={style} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                                                {style}
                                            </span>
                                        ))}
                                        {accommodation.interests?.map((interest) => (
                                            <span key={interest} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <hr className="border-gray-100 mb-8" />
                            </>
                        )}

                        {/* Host */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hosted by</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                                    {accommodation.provider.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{accommodation.provider.user.name}</p>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Phone size={14} />
                                            {accommodation.provider.user.contact_no}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0">
                        <div className="sticky top-6 border border-gray-200 rounded-xl p-6 shadow-sm">
                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900">
                                        LKR {(accommodation.booking_price || accommodation.price_range_min || 0).toLocaleString()}
                                    </span>
                                    <span className="text-gray-500">/ night</span>
                                </div>
                                {accommodation.price_range_max && accommodation.price_range_max !== accommodation.price_range_min && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Range: LKR {accommodation.price_range_min?.toLocaleString()} - {accommodation.price_range_max?.toLocaleString()}
                                    </p>
                                )}
                            </div>

                            {/* Book Button */}
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition mb-6"
                            >
                                Reserve
                            </button>

                            {/* Features */}
                            <div className="space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <Shield size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">Secure booking</p>
                                        <p className="text-gray-500 text-sm">Your payment is protected</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Heart size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">Free cancellation</p>
                                        <p className="text-gray-500 text-sm">Cancel anytime before check-in</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <a
                                    href={`tel:${accommodation.provider.user.contact_no}`}
                                    className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
                                >
                                    <Phone size={16} />
                                    Contact Host
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Drawer */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 transition-opacity"
                        onClick={() => setShowBookingModal(false)}
                    />

                    {/* Drawer */}
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Reserve your stay</h2>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <form onSubmit={handleBookingSubmit} className="space-y-5">
                                {/* Fully Booked Dates Section */}
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
                                            This property is fully booked on these dates. Please select different dates.
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
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
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
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                                                value={bookingData.endDate}
                                                onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Price per night</span>
                                        <span className="font-medium">LKR {bookingData.price.toLocaleString()}</span>
                                    </div>
                                    {bookingData.startDate && bookingData.endDate && (
                                        <>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">
                                                    {Math.max(1, Math.ceil((new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24)))} nights
                                                </span>
                                                <span className="text-gray-600">
                                                    LKR {bookingData.price.toLocaleString()} x {Math.max(1, Math.ceil((new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24)))}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold text-indigo-600">
                                                    LKR {(bookingData.price * Math.max(1, Math.ceil((new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString()}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Payment Method Selection */}
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
                                                        ? "border-indigo-500 bg-indigo-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="online"
                                                    checked={bookingData.paymentMethod === "online"}
                                                    onChange={() => setBookingData({ ...bookingData, paymentMethod: "online" })}
                                                    className="w-4 h-4 text-indigo-600"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">Pay now (Card)</p>
                                                    <p className="text-xs text-gray-500">Secure payment via Stripe</p>
                                                </div>
                                            </label>
                                            <label
                                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                                                    bookingData.paymentMethod === "pay_at_property"
                                                        ? "border-indigo-500 bg-indigo-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="pay_at_property"
                                                    checked={bookingData.paymentMethod === "pay_at_property"}
                                                    onChange={() => setBookingData({ ...bookingData, paymentMethod: "pay_at_property" })}
                                                    className="w-4 h-4 text-indigo-600"
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
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
                                >
                                    {bookingData.paymentMethod === "online" ? "Continue to Payment" : "Confirm Reservation"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && createdBooking && accommodation && (
                <PaymentModal
                    bookingId={createdBooking.id}
                    bookingDetails={{
                        providerName: accommodation.name,
                        startDate: createdBooking.start_date,
                        endDate: createdBooking.end_date,
                        location: accommodation.location,
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

            <Footer />
        </div>
    );
}
