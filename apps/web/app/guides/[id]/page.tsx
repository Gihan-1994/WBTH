"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    MapPin,
    Star,
    Globe,
    Award,
    User,
    Calendar,
    X,
    Briefcase,
    Phone,
    Mail,
    ArrowLeft,
    Clock,
    Languages,
    BadgeCheck,
    Loader2
} from "lucide-react";
import PaymentModal from "@/components/payments/PaymentModal";
import Footer from "@/components/Footer";
import { useToast } from "@/components/Toast";

interface Guide {
    user_id: string;
    experience: string[];
    languages: string[];
    expertise: string[];
    rating: number;
    price: number;
    booking_price: number;
    city: string;
    province: string;
    profile_picture: string;
    bio?: string;
    user: {
        name: string;
        email: string;
        contact_no: string;
    };
}

export default function GuideDetailsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const toast = useToast();
    const id = params.id as string;
    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingDrawer, setShowBookingDrawer] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [createdBooking, setCreatedBooking] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: "",
        price: 0,
    });

    const themeColor = "#2563EB"; // Blue theme for guides

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const res = await fetch(`/api/guides/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setGuide(data);
                    setBookingData(prev => ({ ...prev, price: data.booking_price || data.price || 0 }));
                }
            } catch (error) {
                console.error("Failed to fetch guide", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchGuide();
    }, [id]);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            router.push("/login");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "guide",
                    itemId: guide?.user_id,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    price: bookingData.price,
                    location: guide?.city,
                }),
            });

            if (res.ok) {
                const booking = await res.json();
                setCreatedBooking(booking);
                setShowBookingDrawer(false);
                setShowPaymentModal(true);
            } else {
                const errorData = await res.json();
                toast.error(errorData.error || "Booking failed");
            }
        } catch (error) {
            console.error("Booking error", error);
            toast.error("An error occurred while booking");
        } finally {
            setSubmitting(false);
        }
    };

    const calculateDays = () => {
        if (!bookingData.startDate || !bookingData.endDate) return 0;
        return Math.max(1, Math.ceil(
            (new Date(bookingData.endDate).getTime() - new Date(bookingData.startDate).getTime()) / (1000 * 60 * 60 * 24)
        ) + 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading guide profile...</p>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={28} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Guide not found</h2>
                    <p className="text-gray-500 mb-6">This guide profile may have been removed or doesn't exist.</p>
                    <Link
                        href="/guides"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                    >
                        <ArrowLeft size={16} />
                        Back to guides
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/guides"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">All Guides</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            {guide.user.contact_no && (
                                <a
                                    href={`tel:${guide.user.contact_no}`}
                                    className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900"
                                >
                                    <Phone size={16} />
                                    <span className="text-sm">{guide.user.contact_no}</span>
                                </a>
                            )}
                            <button
                                onClick={() => setShowBookingDrawer(true)}
                                className="px-5 py-2 text-white font-medium rounded-lg transition-transform hover:scale-105"
                                style={{ backgroundColor: themeColor }}
                            >
                                Book Guide
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-16 md:pt-28 md:pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Content */}
                        <div className="order-2 lg:order-1">
                            {/* Expertise Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {guide.expertise.slice(0, 3).map((exp) => (
                                    <span
                                        key={exp}
                                        className="text-xs font-medium px-3 py-1 rounded-full"
                                        style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                    >
                                        {exp}
                                    </span>
                                ))}
                            </div>

                            {/* Name */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                                {guide.user.name}
                            </h1>

                            {/* Title */}
                            <p className="text-lg text-gray-600 mb-4">Professional Tour Guide</p>

                            {/* Location & Rating */}
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={18} className="text-gray-400" />
                                    {guide.city ? `${guide.city}, ${guide.province}` : guide.province || "Sri Lanka"}
                                </span>
                                {guide.rating && (
                                    <span className="flex items-center gap-1.5">
                                        <Star size={18} className="text-amber-400" fill="currentColor" />
                                        <span className="font-semibold text-gray-900">{guide.rating.toFixed(1)}</span>
                                    </span>
                                )}
                            </div>

                            {/* Bio */}
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {guide.bio || `Hi, I'm ${guide.user.name}, a professional tour guide with expertise in ${guide.expertise.slice(0, 2).join(" and ")}. I speak ${guide.languages.join(", ")} and have experience in ${guide.experience.slice(0, 2).join(" and ")}. Let me show you the best of Sri Lanka!`}
                            </p>

                            {/* Price & CTA */}
                            <div className="flex flex-wrap items-center gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Starting from</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        LKR {(guide.booking_price || guide.price).toLocaleString()}
                                        <span className="text-sm font-normal text-gray-500"> / day</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowBookingDrawer(true)}
                                    className="px-8 py-3 text-white font-semibold rounded-lg transition-transform hover:scale-105"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 rounded-full blur-3xl opacity-20"
                                    style={{ backgroundColor: themeColor }}
                                />
                                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                    {guide.profile_picture ? (
                                        <img
                                            src={guide.profile_picture}
                                            alt={guide.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                            <User size={80} className="text-blue-300" />
                                        </div>
                                    )}
                                </div>
                                {/* Verified Badge */}
                                <div
                                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    <BadgeCheck size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Why Choose Me
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            With extensive experience and local knowledge, I provide personalized tours that create unforgettable memories.
                        </p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${themeColor}15` }}
                            >
                                <Languages size={20} style={{ color: themeColor }} />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Languages</p>
                            <p className="font-semibold text-gray-900">
                                {guide.languages.length} {guide.languages.length === 1 ? "Language" : "Languages"}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${themeColor}15` }}
                            >
                                <Award size={20} style={{ color: themeColor }} />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Expertise Areas</p>
                            <p className="font-semibold text-gray-900">
                                {guide.expertise.length} {guide.expertise.length === 1 ? "Specialty" : "Specialties"}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${themeColor}15` }}
                            >
                                <Briefcase size={20} style={{ color: themeColor }} />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Experience</p>
                            <p className="font-semibold text-gray-900">
                                {guide.experience.length} {guide.experience.length === 1 ? "Type" : "Types"}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${themeColor}15` }}
                            >
                                <Clock size={20} style={{ color: themeColor }} />
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Availability</p>
                            <p className="font-semibold text-gray-900">Flexible Schedule</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Areas of Expertise
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {guide.expertise.map((exp) => (
                            <div
                                key={exp}
                                className="flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-colors hover:shadow-md"
                                style={{ borderColor: themeColor, color: themeColor }}
                            >
                                <Award size={18} />
                                <span className="font-medium">{exp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Languages Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Languages I Speak
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {guide.languages.map((lang) => (
                            <div
                                key={lang}
                                className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm"
                            >
                                <Globe size={18} className="text-blue-500" />
                                <span className="font-medium text-gray-900">{lang}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Tour Experience
                    </h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {guide.experience.map((exp) => (
                            <div
                                key={exp}
                                className="flex items-center gap-2 px-5 py-3 bg-purple-50 text-purple-700 rounded-full"
                            >
                                <Briefcase size={18} />
                                <span className="font-medium">{exp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact/CTA Section */}
            <section className="py-16 bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to Explore Sri Lanka?
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Book your personalized tour today and discover the hidden gems of Sri Lanka with a knowledgeable local guide.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setShowBookingDrawer(true)}
                            className="px-8 py-3 text-white font-semibold rounded-lg transition-transform hover:scale-105"
                            style={{ backgroundColor: themeColor }}
                        >
                            Book Now - LKR {(guide.booking_price || guide.price).toLocaleString()}/day
                        </button>
                        {guide.user.contact_no && (
                            <a
                                href={`tel:${guide.user.contact_no}`}
                                className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg transition-transform hover:scale-105 flex items-center gap-2"
                            >
                                <Phone size={18} />
                                Call Now
                            </a>
                        )}
                    </div>
                    {guide.user.email && (
                        <p className="mt-6 text-gray-500 flex items-center justify-center gap-2">
                            <Mail size={16} />
                            {guide.user.email}
                        </p>
                    )}
                </div>
            </section>

            <Footer />

            {/* Booking Drawer */}
            {showBookingDrawer && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/40 transition-opacity"
                        onClick={() => setShowBookingDrawer(false)}
                    />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Book Your Guide</h2>
                                <button
                                    onClick={() => setShowBookingDrawer(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Guide Info */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                {guide.profile_picture ? (
                                    <img
                                        src={guide.profile_picture}
                                        alt={guide.user.name}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                                        <User size={24} className="text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{guide.user.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {guide.city ? `${guide.city}, ${guide.province}` : "Tour Guide"}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleBookingSubmit} className="space-y-5">
                                {/* Date Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Tour Dates</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5">Start Date</label>
                                            <input
                                                type="date"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                                value={bookingData.startDate}
                                                onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1.5">End Date</label>
                                            <input
                                                type="date"
                                                required
                                                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                                value={bookingData.endDate}
                                                onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Price per day</span>
                                        <span className="font-medium">LKR {bookingData.price.toLocaleString()}</span>
                                    </div>
                                    {bookingData.startDate && bookingData.endDate && (
                                        <>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-gray-600">{calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                                                <span className="text-gray-600">
                                                    LKR {bookingData.price.toLocaleString()} x {calculateDays()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold" style={{ color: themeColor }}>
                                                    LKR {(bookingData.price * calculateDays()).toLocaleString()}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Continue to Payment"
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-500">
                                    You will be redirected to complete payment
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && createdBooking && guide && (
                <PaymentModal
                    bookingId={createdBooking.id}
                    bookingDetails={{
                        providerName: guide.user.name,
                        startDate: createdBooking.start_date,
                        endDate: createdBooking.end_date,
                        location: guide.city || guide.province,
                        price: createdBooking.price,
                        type: "guide",
                    }}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        router.push("/dashboard/tourist");
                    }}
                />
            )}
        </div>
    );
}
