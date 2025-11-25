"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface GuideProfile {
    name: string;
    email: string;
    contact_no: string | null;
    experience: string[];
    languages: string[];
    expertise: string[];
    price: number;
    availability: boolean;
    profile_picture: string | null;
}

interface Booking {
    id: string;
    start_date: string;
    end_date: string;
    price: number;
    status: string;
    user?: {
        name: string;
        email: string;
        contact_no: string | null;
    };
}

interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    income: number;
}

export default function GuideDashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState<GuideProfile | null>(null);
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
                fetch("/api/guide/profile"),
                fetch("/api/guide/bookings"),
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
            const res = await fetch(`/api/guide/bookings/${id}/cancel`, {
                method: "PUT",
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

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Guide Dashboard</h1>
                <button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Home
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                        {profile && (
                            <div className="space-y-3">
                                {/* Profile Picture */}
                                <div className="flex justify-center mb-4">
                                    {profile.profile_picture ? (
                                        <img
                                            src={profile.profile_picture}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                            <svg
                                                className="w-16 h-16 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <p><span className="font-medium">Name:</span> {profile.name}</p>
                                <p><span className="font-medium">Email:</span> {profile.email}</p>
                                <p><span className="font-medium">Phone:</span> {profile.contact_no || "N/A"}</p>
                                <p><span className="font-medium">Price/Day:</span> ${profile.price}</p>
                                <p><span className="font-medium">Availability:</span> {profile.availability ? "Available" : "Unavailable"}</p>
                                <p><span className="font-medium">Languages:</span> {profile.languages.join(", ")}</p>
                                <p><span className="font-medium">Expertise:</span> {profile.expertise.join(", ")}</p>

                                <div className="flex gap-2 mt-4 pt-4 border-t">
                                    <button
                                        onClick={() => setShowEditProfile(true)}
                                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setShowChangePassword(true)}
                                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Statistics Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                        {stats && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                    <div className="text-sm text-gray-600">Total</div>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div className="bg-green-50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                                    <div className="text-sm text-gray-600">Confirmed</div>
                                </div>
                                <div className="bg-red-50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                                    <div className="text-sm text-gray-600">Cancelled</div>
                                </div>
                                <div className="col-span-2 bg-purple-50 p-3 rounded text-center">
                                    <div className="text-2xl font-bold text-purple-600">${stats.income}</div>
                                    <div className="text-sm text-gray-600">Total Income</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking History Section */}
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Booking History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3">Tourist</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-3">
                                                {new Date(booking.start_date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                {booking.user?.name || "Unknown"}
                                            </td>
                                            <td className="py-3">${booking.price}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="text-blue-600 hover:underline mr-3"
                                                >
                                                    View
                                                </button>
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking.id)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No bookings found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                const uploadRes = await fetch("/api/guide/profile-picture", {
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
            const res = await fetch("/api/guide/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Profile updated!");
                onSave();
            } else {
                alert("Failed to update profile");
            }
        } catch (err) {
            alert("Error updating profile");
            setUploading(false);
        }
    }

    const handleArrayChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value.split(",").map((s: string) => s.trim()) });
    };

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
            const res = await fetch("/api/guide/profile-picture", {
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
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Profile Picture</label>
                        <div className="flex flex-col items-center gap-3">
                            {/* Image Preview */}
                            {(selectedImage || formData.profile_picture) ? (
                                <img
                                    src={selectedImage || formData.profile_picture}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                    <svg
                                        className="w-16 h-16 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}

                            {/* Upload Button */}
                            <div className="flex gap-2">
                                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
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
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Max size: 2MB. Formats: JPEG, PNG, WebP</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                            value={formData.contact_no || ""}
                            onChange={e => setFormData({ ...formData, contact_no: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price per Day ($)</label>
                        <input
                            type="number"
                            value={formData.price || 0}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.availability || false}
                                onChange={e => setFormData({ ...formData, availability: e.target.checked })}
                            />
                            <span className="text-sm font-medium">Available for Booking</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Languages (comma separated)</label>
                        <input
                            value={formData.languages.join(", ")}
                            onChange={e => handleArrayChange("languages", e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Expertise (comma separated)</label>
                        <input
                            value={formData.expertise.join(", ")}
                            onChange={e => handleArrayChange("expertise", e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Experience (comma separated)</label>
                        <textarea
                            value={formData.experience.join(", ")}
                            onChange={e => handleArrayChange("experience", e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600" disabled={uploading}>Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={uploading}>
                            {uploading ? "Uploading..." : "Save"}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Change</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ViewBookingModal({ booking, onClose }: any) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                <div className="space-y-3">
                    <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
                    <p><span className="font-medium">Tourist Name:</span> {booking.user?.name || "N/A"}</p>
                    <p><span className="font-medium">Tourist Email:</span> {booking.user?.email || "N/A"}</p>
                    <p><span className="font-medium">Tourist Phone:</span> {booking.user?.contact_no || "N/A"}</p>
                    <p><span className="font-medium">Start Date:</span> {new Date(booking.start_date).toLocaleDateString()}</p>
                    <p><span className="font-medium">End Date:</span> {new Date(booking.end_date).toLocaleDateString()}</p>
                    <p><span className="font-medium">Price:</span> ${booking.price}</p>
                    <p><span className="font-medium">Status:</span> {booking.status}</p>
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Close</button>
                </div>
            </div>
        </div>
    );
}
