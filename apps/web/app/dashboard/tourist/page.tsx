"use client";

import { useEffect, useState } from "react";
import { UserProfile, Booking, Stats } from "@/components/touristdashboard/types";
import TouristHeader from "@/components/touristdashboard/TouristHeader";
import TouristStatisticsSection from "@/components/touristdashboard/TouristStatisticsSection";
import TouristProfileSection from "@/components/touristdashboard/TouristProfileSection";
import BookingHistorySection from "@/components/touristdashboard/BookingHistorySection";
import EditProfileModal from "@/components/touristdashboard/modals/EditProfileModal";
import ChangePasswordModal from "@/components/touristdashboard/modals/ChangePasswordModal";
import ViewBookingModal from "@/components/touristdashboard/modals/ViewBookingModal";

/**
 * Main Tourist Dashboard Page
 */
export default function TouristDashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [profileRes, bookingsRes] = await Promise.all([
                fetch("/api/tourist/profile"),
                fetch("/api/tourist/bookings"),
            ]);

            if (profileRes.ok) setProfile(await profileRes.json());
            if (bookingsRes.ok) {
                const data = await bookingsRes.json();
                setBookings(data.bookings);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCancelBooking(id: string) {
        if (!confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const res = await fetch(`/api/bookings/${id}/cancel`, {
                method: "PATCH",
            });
            if (res.ok) {
                alert("Booking cancelled successfully");
                fetchData(); // Refresh data
            } else {
                const data = await res.json();
                alert(data.error || "Failed to cancel booking");
            }
        } catch (error) {
            alert("Error cancelling booking");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            {/* Modular Header */}
            <TouristHeader profile={profile} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Modular Statistics Cards */}
                <TouristStatisticsSection stats={stats} />

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Modular Profile Section */}
                    <aside className="w-full lg:w-1/3">
                        <TouristProfileSection
                            profile={profile}
                            setProfile={setProfile}
                            onEditProfile={() => setShowEditProfile(true)}
                            onChangePassword={() => setShowChangePassword(true)}
                        />
                    </aside>

                    {/* Modular Booking History Section */}
                    <main className="w-full lg:w-2/3">
                        <BookingHistorySection
                            bookings={bookings}
                            onViewBooking={(booking) => setSelectedBooking(booking)}
                            onCancelBooking={handleCancelBooking}
                        />
                    </main>
                </div>
            </div>

            {/* Modals */}
            {showEditProfile && profile && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditProfile(false)}
                    onSave={() => { setShowEditProfile(false); fetchData(); }}
                />
            )}

            {showChangePassword && (
                <ChangePasswordModal
                    onClose={() => setShowChangePassword(false)}
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
