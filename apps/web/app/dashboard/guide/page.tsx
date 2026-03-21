"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { GuideProfile, Booking, Stats } from "@/components/guide-dashboard/types";
import {
    Home,
    Calendar,
    BarChart3,
    User,
    LogOut,
    Loader2,
    Compass
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

// Display Components
import GuideProfileCard from "@/components/guide-dashboard/GuideProfileCard";
import StatisticsCard from "@/components/guide-dashboard/StatisticsCard";
import BookingHistorySection from "@/components/guide-dashboard/BookingHistorySection";

// Modal Components
import EditProfileModal from "@/components/guide-dashboard/modals/EditProfileModal";
import ChangePasswordModal from "@/components/guide-dashboard/modals/ChangePasswordModal";
import ViewBookingModal from "@/components/guide-dashboard/modals/ViewBookingModal";

type TabType = "bookings" | "statistics" | "profile";

export default function GuideDashboard() {
    const router = useRouter();

    // Data State
    const [profile, setProfile] = useState<GuideProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("bookings");

    // Modal State
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            const [profileRes, bookingsRes] = await Promise.all([
                fetch("/api/guide/profile"),
                fetch("/api/guide/bookings"),
            ]);

            if (profileRes.ok) setProfile(await profileRes.json());

            if (bookingsRes.ok) {
                const data = await bookingsRes.json();
                setBookings(data.bookings || []);
                setStats(data.stats || null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handlers
    const handleConfirmBooking = useCallback(async (id: string) => {
        if (!confirm("Confirm this booking and capture payment?")) return;

        try {
            const paymentRes = await fetch(`/api/payments/by-booking/${id}`);
            if (!paymentRes.ok) {
                alert("Payment not found for this booking");
                return;
            }

            const { payment } = await paymentRes.json();

            const res = await fetch("/api/payments/capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId: payment.id }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(`Payment captured! You received $${data.providerAmount}`);
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to capture payment");
            }
        } catch (error) {
            console.error("Error confirming booking:", error);
            alert("Error confirming booking");
        }
    }, [fetchData]);

    const handleCancelBooking = useCallback(async (id: string) => {
        if (!confirm("Are you sure you want to reject this booking and release payment authorization?")) return;

        try {
            const paymentRes = await fetch(`/api/payments/by-booking/${id}`);
            if (!paymentRes.ok) {
                alert("Payment not found for this booking");
                return;
            }

            const { payment } = await paymentRes.json();

            const res = await fetch("/api/payments/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId: payment.id }),
            });

            if (res.ok) {
                alert("Booking rejected and payment authorization released");
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to cancel payment");
            }
        } catch (error) {
            console.error("Error rejecting booking:", error);
            alert("Error rejecting booking");
        }
    }, [fetchData]);

    const tabs = [
        { id: "bookings" as TabType, label: "Bookings", icon: Calendar },
        { id: "statistics" as TabType, label: "Statistics", icon: BarChart3 },
        { id: "profile" as TabType, label: "Profile", icon: User },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="animate-spin" size={24} />
                    <span className="font-medium">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                                <Compass size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Guide Portal</h1>
                                <p className="text-xs text-gray-500">Tourism Hub</p>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="hidden md:flex items-center gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            activeTab === tab.id
                                                ? "bg-teal-50 text-teal-700"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            <NotificationBell />
                            <button
                                onClick={() => router.push("/")}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Go to Home"
                            >
                                <Home size={20} />
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? "bg-teal-50 text-teal-700"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Welcome Banner */}
            {profile && (
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            {profile.profile_picture ? (
                                <img
                                    src={profile.profile_picture}
                                    alt={profile.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-100"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center border-2 border-teal-100">
                                    <User size={24} className="text-teal-600" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Welcome back, {profile.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {profile.availability
                                        ? "You are currently available for bookings"
                                        : "You are currently unavailable for bookings"}
                                </p>
                            </div>
                            {profile.rating && (
                                <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
                                    <span className="text-amber-500">&#9733;</span>
                                    <span className="text-sm font-medium text-amber-700">
                                        {profile.rating.toFixed(1)} Rating
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "bookings" && (
                    <BookingHistorySection
                        bookings={bookings}
                        onView={setSelectedBooking}
                        onConfirm={handleConfirmBooking}
                        onCancel={handleCancelBooking}
                    />
                )}

                {activeTab === "statistics" && (
                    <StatisticsCard stats={stats} />
                )}

                {activeTab === "profile" && (
                    <GuideProfileCard
                        profile={profile}
                        onEditProfile={() => setShowEditProfile(true)}
                        onChangePassword={() => setShowChangePassword(true)}
                        onProfileUpdate={(enabled) =>
                            setProfile((prev) =>
                                prev ? { ...prev, email_notifications_enabled: enabled } : prev
                            )
                        }
                    />
                )}
            </main>

            {/* Modals */}
            {showEditProfile && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditProfile(false)}
                    onSave={() => {
                        setShowEditProfile(false);
                        fetchData();
                    }}
                />
            )}

            {showChangePassword && (
                <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
            )}

            {selectedBooking && (
                <ViewBookingModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
}
