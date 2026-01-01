"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GuideProfile, Booking, Stats } from "@/components/guide-dashboard/types";

// Display Components
import GuideHeader from "@/components/guide-dashboard/GuideHeader";
import GuideProfileCard from "@/components/guide-dashboard/GuideProfileCard";
import StatisticsCard from "@/components/guide-dashboard/StatisticsCard";
import BookingHistorySection from "@/components/guide-dashboard/BookingHistorySection";

// Modal Components
import EditProfileModal from "@/components/guide-dashboard/modals/EditProfileModal";
import ChangePasswordModal from "@/components/guide-dashboard/modals/ChangePasswordModal";
import ViewBookingModal from "@/components/guide-dashboard/modals/ViewBookingModal";

export default function GuideDashboard() {
    const router = useRouter();

    // Data State
    const [profile, setProfile] = useState<GuideProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

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
        if (!confirm("Confirm this booking?")) return;

        try {
            const res = await fetch(`/api/guide/bookings/${id}/confirm`, {
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
            const res = await fetch(`/api/guide/bookings/${id}/cancel`, {
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
            <GuideHeader guideName={profile?.name || null} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Left Column: Profile */}
                    <div className="md:col-span-1">
                        <GuideProfileCard
                            profile={profile}
                            onEditProfile={() => setShowEditProfile(true)}
                            onChangePassword={() => setShowChangePassword(true)}
                            onProfileUpdate={(enabled) => setProfile(prev => prev ? { ...prev, email_notifications_enabled: enabled } : prev)}
                        />
                    </div>

                    {/* Right Column: Bookings */}
                    <div className="md:col-span-2">
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

            {selectedBooking && (
                <ViewBookingModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
}
