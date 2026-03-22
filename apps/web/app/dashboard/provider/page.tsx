"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ProviderProfile, Accommodation, Booking, Stats } from "@/components/provider-dashboard/types";
import {
    Building2,
    CalendarCheck,
    BarChart3,
    UserCog,
    Home,
    LogOut,
    Hotel,
    ChevronDown,
} from "lucide-react";

// Display Components
import CompanyProfileCard from "@/components/provider-dashboard/CompanyProfileCard";
import StatisticsCard from "@/components/provider-dashboard/StatisticsCard";
import AccommodationsSection from "@/components/provider-dashboard/AccommodationsSection";
import BookingHistorySection from "@/components/provider-dashboard/BookingHistorySection";

// Modal Components
import EditProfileModal from "@/components/provider-dashboard/modals/EditProfileModal";
import ChangePasswordModal from "@/components/provider-dashboard/modals/ChangePasswordModal";
import AccommodationModal from "@/components/provider-dashboard/modals/AccommodationModal";
import AccommodationImagesModal from "@/components/provider-dashboard/modals/AccommodationImagesModal";
import ViewBookingModal from "@/components/provider-dashboard/modals/ViewBookingModal";
import BlockedDatesModal from "@/components/provider-dashboard/modals/BlockedDatesModal";
import ConfirmationModal from "@/components/provider-dashboard/modals/ConfirmationModal";

export default function ProviderDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState("accommodations");
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Data State
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAddAccommodation, setShowAddAccommodation] = useState(false);
    const [showEditAccommodation, setShowEditAccommodation] = useState<Accommodation | null>(null);
    const [showImagesModal, setShowImagesModal] = useState<Accommodation | null>(null);
    const [showBlockedDatesModal, setShowBlockedDatesModal] = useState<Accommodation | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => Promise<void>;
        variant?: "danger" | "warning" | "info" | "success";
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: async () => {},
    });

    const tabs = [
        { id: "accommodations", label: "Accommodations", icon: Hotel },
        { id: "bookings", label: "Bookings", icon: CalendarCheck },
        { id: "statistics", label: "Statistics", icon: BarChart3 },
        { id: "profile", label: "Profile", icon: UserCog },
    ];

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            const [profileRes, bookingsRes, accommodationsRes] = await Promise.all([
                fetch("/api/accommodation-provider/profile"),
                fetch("/api/accommodation-provider/bookings"),
                fetch("/api/accommodation-provider/accommodations"),
            ]);

            if (profileRes.ok) setProfile(await profileRes.json());

            if (bookingsRes.ok) {
                const data = await bookingsRes.json();
                setBookings(data.bookings || []);
                setStats(data.stats || null);
            }

            if (accommodationsRes.ok) {
                const data = await accommodationsRes.json();
                setAccommodations(data.accommodations || []);
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
    const handleConfirmBooking = useCallback((id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Confirm Booking",
            message: "Are you sure you want to confirm this booking and capture the payment?",
            variant: "success",
            confirmLabel: "Confirm Booking",
            onConfirm: async () => {
                const paymentRes = await fetch(`/api/payments/by-booking/${id}`);
                if (!paymentRes.ok) {
                    alert("Payment not found for this booking");
                    return;
                }

                const { payment } = await paymentRes.json();

                if (payment.status !== "authorized") {
                    alert(`Cannot capture payment with status: ${payment.status}. The user might not have completed the authorization yet.`);
                    return;
                }

                const res = await fetch("/api/payments/capture", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ paymentId: payment.id }),
                });

                if (res.ok) {
                    fetchData();
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to capture payment");
                }
            }
        });
    }, [fetchData]);

    const handleCancelBooking = useCallback((id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Reject Booking",
            message: "Are you sure you want to reject this booking? The payment authorization will be released.",
            variant: "danger",
            confirmLabel: "Reject Booking",
            onConfirm: async () => {
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
                    fetchData();
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to cancel payment");
                }
            }
        });
    }, [fetchData]);

    const handleMarkPaid = useCallback((id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Mark as Paid",
            message: "Confirm that you have received payment for this booking?",
            variant: "success",
            confirmLabel: "Confirm Payment",
            onConfirm: async () => {
                const res = await fetch(`/api/bookings/${id}/mark-paid`, {
                    method: "POST",
                });

                if (res.ok) {
                    fetchData();
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to mark booking as paid");
                }
            }
        });
    }, [fetchData]);

    const handleDeleteBooking = useCallback((id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Delete Booking",
            message: "Are you sure you want to delete this booking? This action cannot be undone.",
            variant: "danger",
            confirmLabel: "Delete",
            onConfirm: async () => {
                const res = await fetch(`/api/accommodation-provider/bookings/${id}`, {
                    method: "DELETE",
                });

                if (res.ok) {
                    fetchData();
                    if (selectedBooking?.id === id) {
                        setSelectedBooking(null);
                    }
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to delete booking");
                }
            }
        });
    }, [fetchData, selectedBooking]);

    const handleBulkDeleteBookings = useCallback((ids: string[]) => {
        setConfirmation({
            isOpen: true,
            title: "Delete Multiple Bookings",
            message: `Are you sure you want to delete ${ids.length} booking${ids.length > 1 ? 's' : ''}? This action cannot be undone.`,
            variant: "danger",
            confirmLabel: "Delete All",
            onConfirm: async () => {
                const res = await fetch("/api/accommodation-provider/bookings/bulk-delete", {
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
            }
        });
    }, [fetchData, selectedBooking]);

    const handleDeleteAccommodation = useCallback((id: string) => {
        setConfirmation({
            isOpen: true,
            title: "Delete Accommodation",
            message: "Are you sure you want to delete this accommodation? All associated bookings will also be affected.",
            variant: "danger",
            confirmLabel: "Delete",
            onConfirm: async () => {
                const res = await fetch(`/api/accommodation-provider/accommodations/${id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    fetchData();
                } else {
                    const data = await res.json();
                    alert(data.error || "Failed to delete accommodation");
                }
            }
        });
    }, [fetchData]);

    if (loading || status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Building2 className="text-emerald-600" size={32} />
                    </div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Building2 className="text-white" size={18} />
                            </div>
                            <span className="font-semibold text-gray-900">Provider Portal</span>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/")}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Home size={18} />
                                <span className="hidden sm:inline">Home</span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <span className="text-emerald-600 font-semibold text-sm">
                                            {profile?.company_name?.charAt(0) || session?.user?.name?.charAt(0) || "P"}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        {profile?.company_name || session?.user?.name || "Provider"}
                                    </span>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {profile?.company_name || session?.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    setActiveTab("profile");
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <UserCog size={16} />
                                                Profile Settings
                                            </button>
                                            <button
                                                onClick={() => signOut({ callbackUrl: "/login" })}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex gap-1 -mb-px">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                                            isActive
                                                ? "border-emerald-600 text-emerald-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "accommodations" && (
                    <AccommodationsSection
                        accommodations={accommodations}
                        onAdd={() => setShowAddAccommodation(true)}
                        onEdit={setShowEditAccommodation}
                        onDelete={handleDeleteAccommodation}
                        onManageImages={setShowImagesModal}
                        onManageAvailability={setShowBlockedDatesModal}
                    />
                )}

                {activeTab === "bookings" && (
                    <BookingHistorySection
                        bookings={bookings}
                        accommodationCount={accommodations.length}
                        onView={setSelectedBooking}
                        onConfirm={handleConfirmBooking}
                        onCancel={handleCancelBooking}
                        onMarkPaid={handleMarkPaid}
                        onDelete={handleDeleteBooking}
                        onBulkDelete={handleBulkDeleteBookings}
                    />
                )}

                {activeTab === "statistics" && (
                    <StatisticsCard stats={stats} />
                )}

                {activeTab === "profile" && (
                    <CompanyProfileCard
                        profile={profile}
                        onEditProfile={() => setShowEditProfile(true)}
                        onChangePassword={() => setShowChangePassword(true)}
                        onProfileUpdate={(enabled) => setProfile(prev => prev ? ({ ...prev, email_notifications_enabled: enabled }) : null)}
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
                <ChangePasswordModal
                    onClose={() => setShowChangePassword(false)}
                />
            )}

            {showAddAccommodation && (
                <AccommodationModal
                    accommodation={null}
                    onClose={() => setShowAddAccommodation(false)}
                    onSave={() => {
                        setShowAddAccommodation(false);
                        fetchData();
                    }}
                />
            )}

            {showEditAccommodation && (
                <AccommodationModal
                    accommodation={showEditAccommodation}
                    onClose={() => setShowEditAccommodation(null)}
                    onSave={() => {
                        setShowEditAccommodation(null);
                        fetchData();
                    }}
                />
            )}

            {showImagesModal && (
                <AccommodationImagesModal
                    accommodation={showImagesModal}
                    onClose={() => setShowImagesModal(null)}
                    onSave={() => {
                        setShowImagesModal(null);
                        fetchData();
                    }}
                />
            )}

            {showBlockedDatesModal && (
                <BlockedDatesModal
                    accommodationId={showBlockedDatesModal.id}
                    accommodationName={showBlockedDatesModal.name}
                    onClose={() => setShowBlockedDatesModal(null)}
                />
            )}

            {selectedBooking && (
                <ViewBookingModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
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
                confirmLabel={confirmation.confirmLabel}
            />
        </div>
    );
}
