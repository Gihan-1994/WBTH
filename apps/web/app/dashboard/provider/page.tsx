"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProviderProfile, Accommodation, Booking, Stats } from "@/components/provider-dashboard/types";

// Display Components
import ProviderHeader from "@/components/provider-dashboard/ProviderHeader";
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

export default function ProviderDashboard() {
    const router = useRouter();

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
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
    const handleConfirmBooking = useCallback(async (id: string) => {
        if (!confirm("Confirm this booking?")) return;

        try {
            const res = await fetch(`/api/accommodation-provider/bookings/${id}/confirm`, {
                method: "PUT",
            });
            if (res.ok) {
                alert("Booking confirmed successfully");
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to confirm booking");
            }
        } catch (error) {
            alert("Error confirming booking");
        }
    }, [fetchData]);

    const handleCancelBooking = useCallback(async (id: string) => {
        if (!confirm("Are you sure you want to reject this booking?")) return;

        try {
            const res = await fetch(`/api/accommodation-provider/bookings/${id}/cancel`, {
                method: "PUT",
            });
            if (res.ok) {
                alert("Booking rejected successfully");
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to reject booking");
            }
        } catch (error) {
            alert("Error rejecting booking");
        }
    }, [fetchData]);

    const handleDeleteAccommodation = useCallback(async (id: string) => {
        if (!confirm("Are you sure you want to delete this accommodation?")) return;

        try {
            const res = await fetch(`/api/accommodation-provider/accommodations/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                alert("Accommodation deleted successfully");
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete accommodation");
            }
        } catch (error) {
            alert("Error deleting accommodation");
        }
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 pb-12">
            <ProviderHeader companyName={profile?.company_name || null} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Left Column: Profile */}
                    <div className="md:col-span-1">
                        <CompanyProfileCard
                            profile={profile}
                            onEditProfile={() => setShowEditProfile(true)}
                            onChangePassword={() => setShowChangePassword(true)}
                            onProfileUpdate={(enabled) => setProfile(prev => prev ? ({ ...prev, email_notifications_enabled: enabled }) : null)}
                        />
                    </div>

                    {/* Right Column: Accommodations & Bookings */}
                    <div className="md:col-span-2 space-y-8">
                        <AccommodationsSection
                            accommodations={accommodations}
                            onAdd={() => setShowAddAccommodation(true)}
                            onEdit={setShowEditAccommodation}
                            onDelete={handleDeleteAccommodation}
                            onManageImages={setShowImagesModal}
                        />

                        <BookingHistorySection
                            bookings={bookings}
                            onView={setSelectedBooking}
                            onConfirm={handleConfirmBooking}
                            onCancel={handleCancelBooking}
                        />
                    </div>
                </div>

                {/* Bottom Row: Statistics */}
                <div className="w-full">
                    <StatisticsCard stats={stats} />
                </div>
            </div>

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
                        fetchData(); // Images updated, refresh data just in case
                    }}
                />
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
