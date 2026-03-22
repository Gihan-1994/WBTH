"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { UserProfile, Booking, Stats } from "@/components/touristdashboard/types";
import {
    Home,
    Calendar,
    BarChart3,
    User,
    LogOut,
    Loader2,
    Plane
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

// Display Components
import TouristProfileSection from "@/components/touristdashboard/TouristProfileSection";
import TouristStatisticsSection from "@/components/touristdashboard/TouristStatisticsSection";
import BookingHistorySection from "@/components/touristdashboard/BookingHistorySection";

// Modal Components
import EditProfileModal from "@/components/touristdashboard/modals/EditProfileModal";
import ChangePasswordModal from "@/components/touristdashboard/modals/ChangePasswordModal";
import ViewBookingModal from "@/components/touristdashboard/modals/ViewBookingModal";
import ConfirmationModal from "@/components/touristdashboard/modals/ConfirmationModal";

type TabType = "bookings" | "statistics" | "profile";

export default function TouristDashboard() {
    const router = useRouter();

    // Data State
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>("bookings");

    // Modal State
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: "danger" | "warning" | "info" | "success";
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
    });

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            const [profileRes, bookingsRes] = await Promise.all([
                fetch("/api/tourist/profile"),
                fetch("/api/tourist/bookings"),
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
    const handleCancelBooking = useCallback(async (id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Cancel Booking",
            message: "Are you sure you want to cancel this booking? This action cannot be undone.",
            variant: "danger",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/bookings/${id}/cancel`, {
                        method: "PATCH",
                    });
                    if (res.ok) {
                        fetchData();
                        if (selectedBooking?.id === id) setSelectedBooking(null);
                    } else {
                        const data = await res.json();
                        alert(data.error || "Failed to cancel booking");
                    }
                } catch (error) {
                    alert("Error cancelling booking");
                }
            }
        });
    }, [fetchData, selectedBooking]);

    const handleDeleteBooking = useCallback(async (id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Delete Booking",
            message: "Are you sure you want to delete this booking from your history? This action cannot be undone.",
            variant: "danger",
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/tourist/bookings/${id}`, {
                        method: "DELETE",
                    });
                    if (res.ok) {
                        fetchData();
                        if (selectedBooking?.id === id) setSelectedBooking(null);
                    } else {
                        const data = await res.json();
                        alert(data.error || "Failed to delete booking");
                    }
                } catch (error) {
                    alert("Error deleting booking");
                }
            }
        });
    }, [fetchData, selectedBooking]);

    const handleBulkDeleteBookings = useCallback(async (ids: string[]) => {
        setConfirmation({
            isOpen: true,
            title: "Bulk Delete Bookings",
            message: `Are you sure you want to delete ${ids.length} bookings from your history?`,
            variant: "danger",
            onConfirm: async () => {
                try {
                    const res = await fetch("/api/tourist/bookings/bulk-delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ids }),
                    });
                    if (res.ok) {
                        fetchData();
                        if (selectedBooking && ids.includes(selectedBooking.id)) {
                            setSelectedBooking(null);
                        }
                    } else {
                        const data = await res.json();
                        alert(data.error || "Failed to delete bookings");
                    }
                } catch (error) {
                    alert("Error bulk deleting bookings");
                }
            }
        });
    }, [fetchData, selectedBooking]);

    const tabs = [
        { id: "bookings" as TabType, label: "My Bookings", icon: Calendar },
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
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Plane size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Tourist Portal</h1>
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
                                                ? "bg-blue-50 text-blue-700"
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
                                            ? "bg-blue-50 text-blue-700"
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
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                                    <User size={24} className="text-blue-600" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Welcome back, {profile.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {stats?.total ? `You have ${stats.total} booking${stats.total > 1 ? 's' : ''}` : 'Ready to explore Sri Lanka?'}
                                </p>
                            </div>
                            {stats && stats.pending > 0 && (
                                <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
                                    <span className="text-sm font-medium text-amber-700">
                                        {stats.pending} pending booking{stats.pending > 1 ? 's' : ''}
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
                        onViewBooking={setSelectedBooking}
                        onCancelBooking={handleCancelBooking}
                        onDeleteBooking={handleDeleteBooking}
                        onBulkDeleteBookings={handleBulkDeleteBookings}
                        onRefresh={fetchData}
                    />
                )}

                {activeTab === "statistics" && (
                    <TouristStatisticsSection stats={stats} />
                )}

                {activeTab === "profile" && (
                    <TouristProfileSection
                        profile={profile}
                        setProfile={setProfile}
                        onEditProfile={() => setShowEditProfile(true)}
                        onChangePassword={() => setShowChangePassword(true)}
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
                    onCancel={handleCancelBooking}
                    onDelete={handleDeleteBooking}
                />
            )}

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                variant={confirmation.variant}
            />
        </div>
    );
}
