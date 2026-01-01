"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import { User, Mail, Phone, Globe, Calendar, Edit, Lock, Eye, Home, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface UserProfile {
    name: string;
    email: string;
    contact_no: string | null;
    country: string;
    dob: string | null;
    email_notifications_enabled: boolean;
    profile_picture: string | null;
}

interface Booking {
    id: string;
    start_date: string;
    end_date: string;
    price: number;
    status: string;
    type: string;
    accommodation?: { name: string };
    guide?: { user: { name: string } };
}

interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
}

export default function TouristDashboard() {
    const router = useRouter();
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
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                                Welcome back, {profile?.name?.split(' ')[0] || 'Tourist'}!
                            </h1>
                            <p className="text-lg font-light">Manage your bookings and profile</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <NotificationBell />
                            <button
                                onClick={() => router.push("/")}
                                className="bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <Home size={18} />
                                Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-xl">
                                    <TrendingUp className="text-blue-600" size={24} />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {stats.total}
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-600">Total Bookings</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-3 rounded-xl">
                                    <Clock className="text-yellow-600" size={24} />
                                </div>
                                <div className="text-3xl font-bold text-yellow-600">
                                    {stats.pending}
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-600">Pending</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                                <div className="text-3xl font-bold text-green-600">
                                    {stats.confirmed}
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-600">Confirmed</div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                            <div className="flex items-center justify-between mb-3">
                                <div className="bg-gradient-to-br from-red-100 to-rose-100 p-3 rounded-xl">
                                    <XCircle className="text-red-600" size={24} />
                                </div>
                                <div className="text-3xl font-bold text-red-600">
                                    {stats.cancelled}
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-gray-600">Cancelled</div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-2 rounded-lg">
                                    <User size={20} className="text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                            </div>
                            {profile && (
                                <div className="space-y-4">
                                    {/* Profile Picture */}
                                    <div className="flex justify-center mb-6">
                                        {profile.profile_picture ? (
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75"></div>
                                                <img
                                                    src={profile.profile_picture}
                                                    alt="Profile"
                                                    className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                                                <span className="text-gray-400 text-4xl font-bold">
                                                    {profile.name?.charAt(0).toUpperCase() || "?"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <User size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Name</div>
                                            <div className="font-semibold text-gray-800">{profile.name}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Mail size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Email</div>
                                            <div className="font-semibold text-gray-800 break-all">{profile.email}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Phone size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Phone</div>
                                            <div className="font-semibold text-gray-800">{profile.contact_no || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Globe size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Country</div>
                                            <div className="font-semibold text-gray-800">{profile.country || "Not provided"}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Calendar size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Date of Birth</div>
                                            <div className="font-semibold text-gray-800">
                                                {profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Notification Toggle */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                <Mail size={16} className="text-blue-600" />
                                                Email Notifications
                                            </span>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={profile.email_notifications_enabled}
                                                    onChange={async (e) => {
                                                        const enabled = e.target.checked;
                                                        try {
                                                            const res = await fetch('/api/user/email-preferences', {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ email_notifications_enabled: enabled }),
                                                            });
                                                            if (res.ok) {
                                                                setProfile(prev => prev ? { ...prev, email_notifications_enabled: enabled } : prev);
                                                                alert(enabled ? 'Email notifications enabled' : 'Email notifications disabled');
                                                            } else {
                                                                alert('Failed to update preference');
                                                            }
                                                        } catch (error) {
                                                            alert('Error updating preference');
                                                        }
                                                    }}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"></div>
                                            </div>
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2 px-3">
                                            {profile.email_notifications_enabled
                                                ? 'You will receive booking updates via email'
                                                : 'You will only receive in-app notifications'}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={() => setShowEditProfile(true)}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Edit size={16} />
                                            Edit Profile
                                        </button>
                                        <button
                                            onClick={() => setShowChangePassword(true)}
                                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
                                        >
                                            <Lock size={16} />
                                            Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking History Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h2>
                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                <table className="w-full">
                                    <thead className="sticky top-0 bg-white z-10">
                                        <tr className="text-left border-b-2 border-gray-200">
                                            <th className="pb-4 font-semibold text-gray-700">Date</th>
                                            <th className="pb-4 font-semibold text-gray-700">Details</th>
                                            <th className="pb-4 font-semibold text-gray-700">Amount</th>
                                            <th className="pb-4 font-semibold text-gray-700">Status</th>
                                            <th className="pb-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 text-gray-700">
                                                    {new Date(booking.start_date).toLocaleDateString()}
                                                </td>
                                                <td className="py-4">
                                                    <div className="font-semibold text-gray-800">
                                                        {booking.type === 'guide'
                                                            ? (booking.guide?.user?.name || "Guide Booking")
                                                            : (booking.accommodation?.name || "Accommodation Booking")}
                                                    </div>
                                                    <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                        {booking.type}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        ${booking.price}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                                                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' :
                                                        booking.status === 'pending'
                                                            ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200' :
                                                            'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
                                                        >
                                                            <Eye size={16} />
                                                            View
                                                        </button>
                                                        {booking.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleCancelBooking(booking.id)}
                                                                className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-12 text-center">
                                                    <div className="text-6xl mb-4">📅</div>
                                                    <p className="text-xl text-gray-600 font-medium mb-2">No bookings yet</p>
                                                    <p className="text-gray-500">Start exploring and make your first booking!</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
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

// --- Sub-components (Modals) ---

function EditProfileModal({ profile, onClose, onSave }: any) {
    const [formData, setFormData] = useState(profile);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            // First upload the profile picture if one was selected
            if (selectedImage) {
                setUploading(true);
                const uploadRes = await fetch("/api/tourist/profile-picture", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: selectedImage }),
                });

                if (!uploadRes.ok) {
                    const error = await uploadRes.json();
                    alert(error.error || "Failed to upload profile picture");
                    setUploading(false);
                    return;
                }
                setUploading(false);
            }

            // Then update the profile
            const res = await fetch("/api/tourist/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Profile updated successfully!");
                onSave();
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            alert("Error updating profile");
            setUploading(false);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert("Image size must be less than 2MB");
            return;
        }

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;

        try {
            const res = await fetch("/api/tourist/profile-picture", {
                method: "DELETE",
            });

            if (res.ok) {
                setSelectedImage(null);
                setFormData({ ...formData, profile_picture: null });
                alert("Profile picture removed!");
                onSave();
            } else {
                alert("Failed to remove profile picture");
            }
        } catch (err) {
            alert("Error removing profile picture");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture Upload */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-3">📸 Profile Picture</label>
                        <div className="flex flex-col items-center gap-3">
                            {/* Image Preview */}
                            {(selectedImage || formData.profile_picture) ? (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-75"></div>
                                    <img
                                        src={selectedImage || formData.profile_picture}
                                        alt="Preview"
                                        className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-4 ring-white shadow-lg">
                                    <span className="text-gray-400 text-4xl font-bold">
                                        {formData.name?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}

                            {/* Upload Buttons */}
                            <div className="flex gap-2">
                                <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-semibold text-sm">
                                    Choose Image
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {(formData.profile_picture || selectedImage) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Max size: 2MB • Formats: JPEG, PNG, WebP</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                        <input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <input
                            value={formData.contact_no || ""}
                            onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                        <input
                            value={formData.country || ""}
                            onChange={e => setFormData({ ...formData, country: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                        <input
                            type="date"
                            value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ""}
                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Uploading..." : "💾 Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ChangePasswordModal({ onClose }: any) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password changed!");
                onClose();
            } else {
                alert(data.error || "Failed to change password");
            }
        } catch (err) {
            alert("Error changing password");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full border-2 border-gray-200 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ViewBookingModal({ booking, onClose }: any) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Booking Details</h2>
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Booking ID</div>
                        <div className="font-semibold text-gray-800">{booking.id}</div>
                    </div>
                    {booking.type === 'guide' ? (
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-gray-500 mb-1">Guide</div>
                            <div className="font-semibold text-gray-800">{booking.guide?.user?.name || "N/A"}</div>
                        </div>
                    ) : (
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <div className="text-xs text-gray-500 mb-1">Accommodation</div>
                            <div className="font-semibold text-gray-800">{booking.accommodation?.name || "N/A"}</div>
                        </div>
                    )}
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                        <div className="font-semibold text-gray-800">
                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Price</div>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${booking.price}
                        </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="text-xs text-gray-500 mb-1">Status</div>
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' :
                            booking.status === 'pending'
                                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200' :
                                'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                            }`}>
                            {booking.status}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
