"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import NotificationBell from "@/components/NotificationBell";

const SRI_LANKA_DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
    "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
    "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
    "Moneragala", "Ratnapura", "Kegalle"
];

const SRI_LANKA_PROVINCES = [
    "Western", "Central", "Southern", "Northern", "Eastern",
    "North Western", "North Central", "Uva", "Sabaragamuwa"
];

const ACCOMMODATION_TYPES = ["Hotel", "Villa", "Resort", "Homestay", "Apartment", "Guesthouse"];

const AMENITIES_LIST = [
    "wifi", "hot_water", "pool", "parking", "restaurant", "bar",
    "gym", "spa", "beach_access", "garden", "air_conditioning",
    "room_service", "laundry", "airport_shuttle", "terrace", "bbq"
];

const TRAVEL_STYLES = ["luxury", "budget", "family", "solo", "adventure",
    "romantic", "cultural", "relaxation", "eco_tourism", "business"];

const INTERESTS = [
    "coastal", "adventure", "cultural", "wildlife", "wellness",
    "luxury", "budget_friendly", "eco_friendly", "romantic", "family_friendly",
    "photography", "hiking", "surfing", "diving", "historical"
];


interface ProviderProfile {
    name: string;
    email: string;
    contact_no: string | null;
    company_name: string;
    location: string;
    provider_id: string | null;
    logo: string | null;
    email_notifications_enabled: boolean;
}

interface Accommodation {
    id: string;
    name: string;
    district: string;
    location: string | null;
    type: string[];
    amenities: string[];
    budget: string[];
    interests: string[];
    price_range_min: number;
    price_range_max: number;
    province: string | null;
    group_size: number | null;
    account_no: string | null;
    images: string[];
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
    accommodation?: {
        name: string;
    };
}

interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    income: number;
}

export default function ProviderDashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState<ProviderProfile | null>(null);
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAddAccommodation, setShowAddAccommodation] = useState(false);
    const [showEditAccommodation, setShowEditAccommodation] = useState<Accommodation | null>(null);
    const [showImagesModal, setShowImagesModal] = useState<Accommodation | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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
                setBookings(data.bookings);
                setStats(data.stats);
            }
            if (accommodationsRes.ok) {
                const data = await accommodationsRes.json();
                setAccommodations(data.accommodations);
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

    const handleConfirmBooking = useCallback(async (id: string) => {
        if (!confirm("Confirm this booking?")) return;

        try {
            const res = await fetch(`/api/accommodation-provider/bookings/${id}/confirm`, {
                method: "PUT",
            });
            if (res.ok) {
                alert("Booking confirmed successfully");
                fetchData(); // Refresh data
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
                fetchData(); // Refresh data
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

    if (loading) return <div className="p-8" suppressHydrationWarning>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Provider Dashboard</h1>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <button
                        onClick={() => router.push("/")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Home
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
                        {profile && (
                            <div className="space-y-3">
                                {/* Logo Display */}
                                <div className="flex justify-center mb-4">
                                    {profile.logo ? (
                                        <img
                                            src={profile.logo}
                                            alt="Company Logo"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                            <span className="text-gray-400 text-4xl font-bold">
                                                {profile.company_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p><span className="font-medium">Company:</span> {profile.company_name}</p>
                                <p><span className="font-medium">Location:</span> {profile.location || "N/A"}</p>
                                <p><span className="font-medium">Owner:</span> {profile.name}</p>
                                <p><span className="font-medium">Email:</span> {profile.email}</p>
                                <p><span className="font-medium">Phone:</span> {profile.contact_no || "N/A"}</p>

                                {/* Email Notification Toggle */}
                                <div className="pt-4 border-t">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm font-medium text-gray-700">
                                            📧 Email Notifications
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
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </div>
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {profile.email_notifications_enabled
                                            ? 'You will receive booking updates via email'
                                            : 'You will only receive in-app notifications'}
                                    </p>
                                </div>

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

                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-8">

                    {/* Accommodations Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">My Accommodations</h2>
                            <button
                                onClick={() => setShowAddAccommodation(true)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                            >
                                + Add New
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="pb-3">Name</th>
                                        <th className="pb-3">District</th>
                                        <th className="pb-3">Price Range</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accommodations.map((acc) => (
                                        <tr key={acc.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-3 font-medium">{acc.name}</td>
                                            <td className="py-3">{acc.district}</td>
                                            <td className="py-3">${acc.price_range_min} - ${acc.price_range_max}</td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => setShowImagesModal(acc)}
                                                    className="text-purple-600 hover:underline mr-3"
                                                >
                                                    Add Images
                                                </button>
                                                <button
                                                    onClick={() => setShowEditAccommodation(acc)}
                                                    className="text-blue-600 hover:underline mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAccommodation(acc.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {accommodations.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-8 text-center text-gray-500">
                                                No accommodations found. Add one to get started!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Booking History Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Booking History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3">Accommodation</th>
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
                                                {booking.accommodation?.name || "Unknown"}
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
                                                    <>
                                                        <button
                                                            onClick={() => handleConfirmBooking(booking.id)}
                                                            className="text-green-600 hover:underline mr-3"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-500">
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

            {showAddAccommodation && (
                <AccommodationModal
                    onClose={() => setShowAddAccommodation(false)}
                    onSave={() => { setShowAddAccommodation(false); fetchData(); }}
                />
            )}

            {showEditAccommodation && (
                <AccommodationModal
                    accommodation={showEditAccommodation}
                    onClose={() => setShowEditAccommodation(null)}
                    onSave={() => { setShowEditAccommodation(null); fetchData(); }}
                />
            )}

            {showImagesModal && (
                <AccommodationImagesModal
                    accommodation={showImagesModal}
                    onClose={() => setShowImagesModal(null)}
                    onSave={() => { setShowImagesModal(null); fetchData(); }}
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

const EditProfileModal = memo(function EditProfileModal({ profile, onClose, onSave }: any) {
    const [formData, setFormData] = useState(profile);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image size must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setSelectedImage(result);
            setFormData({ ...formData, logo: result });
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setFormData({ ...formData, logo: null });
    };

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            const res = await fetch("/api/accommodation-provider/profile", {
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
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Company Logo</label>
                        <div className="flex flex-col items-center gap-3">
                            {(selectedImage || formData.logo) ? (
                                <img
                                    src={selectedImage || formData.logo}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                                    <span className="text-gray-400 text-4xl font-bold">
                                        {formData.company_name?.charAt(0).toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}

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
                                {(formData.logo || selectedImage) && (
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
                        <label className="block text-sm font-medium mb-1">Company Name</label>
                        <input
                            value={formData.company_name}
                            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Owner Name</label>
                        <input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Business Location</label>
                        <input
                            value={formData.location || ""}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full border p-2 rounded"
                            placeholder="e.g., Colombo, Western Province"
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
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
});

const AccommodationImagesModal = memo(function AccommodationImagesModal({ accommodation, onClose, onSave }: any) {
    const [images, setImages] = useState<string[]>(accommodation.images || []);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];
        let processed = 0;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) return;
            if (file.size > 2 * 1024 * 1024) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result as string);
                processed++;
                if (processed === files.length) {
                    setImages([...images, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    async function handleSave() {
        setUploading(true);
        try {
            const res = await fetch(`/api/accommodation-provider/accommodations/${accommodation.id}/images`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images }),
            });
            if (res.ok) {
                alert("Images updated!");
                onSave();
            } else {
                alert("Failed to update images");
            }
        } catch (err) {
            alert("Error updating images");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Manage Images - {accommodation.name}</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {images.map((img, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={img}
                                alt={`Accommodation ${index + 1}`}
                                className="w-full h-32 object-cover rounded border"
                            />
                            <button
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm text-gray-500">Add Images</span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600" disabled={uploading}>Cancel</button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={uploading}
                    >
                        {uploading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
});

const AccommodationModal = memo(function AccommodationModal({ accommodation, onClose, onSave }: any) {
    const isEditing = !!accommodation;
    const [formData, setFormData] = useState(accommodation || {
        name: "",
        district: "",
        location: "",
        type: [],
        amenities: [],
        budget: [],
        interests: [],
        travel_style: [],
        price_range_min: 0,
        price_range_max: 0,
        province: "",
        group_size: 0,
        account_no: "",
    });

    async function handleSubmit(e: any) {
        e.preventDefault();
        const url = isEditing
            ? `/api/accommodation-provider/accommodations/${accommodation.id}`
            : "/api/accommodation-provider/accommodations";
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert(isEditing ? "Accommodation updated!" : "Accommodation created!");
                onSave();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save accommodation");
            }
        } catch (err) {
            alert("Error saving accommodation");
        }
    }

    const handleArrayChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value.split(",").map((s: string) => s.trim()) });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit" : "Add"} Accommodation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">District *</label>
                        <select
                            value={formData.district}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select District</option>
                            {SRI_LANKA_DISTRICTS.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Location/Address (Optional)</label>
                        <input
                            value={formData.location || ""}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full border p-2 rounded"
                            placeholder="e.g., 123 Beach Road, Matara"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Min Price ($)</label>
                            <input
                                type="number"
                                value={formData.price_range_min}
                                onChange={e => setFormData({ ...formData, price_range_min: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Price ($)</label>
                            <input
                                type="number"
                                value={formData.price_range_max}
                                onChange={e => setFormData({ ...formData, price_range_max: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Province</label>
                        <select
                            value={formData.province || ""}
                            onChange={e => setFormData({ ...formData, province: e.target.value })}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select Province</option>
                            {SRI_LANKA_PROVINCES.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Group Size</label>
                        <input
                            type="number"
                            value={formData.group_size || 0}
                            onChange={e => setFormData({ ...formData, group_size: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Account No</label>
                        <input
                            value={formData.account_no || ""}
                            onChange={e => setFormData({ ...formData, account_no: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Accommodation Type *</label>
                        <div className="space-y-2">
                            {ACCOMMODATION_TYPES.map(type => (
                                <label key={type} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.type?.includes(type) || false}
                                        onChange={e => {
                                            const current = formData.type || [];
                                            if (e.target.checked) {
                                                setFormData({ ...formData, type: [...current, type] });
                                            } else {
                                                setFormData({ ...formData, type: current.filter((t: string) => t !== type) });
                                            }
                                        }}
                                        className="mr-2"
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amenities</label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded">
                            {AMENITIES_LIST.map(amenity => (
                                <label key={amenity} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities?.includes(amenity) || false}
                                        onChange={e => {
                                            const current = formData.amenities || [];
                                            if (e.target.checked) {
                                                setFormData({ ...formData, amenities: [...current, amenity] });
                                            } else {
                                                setFormData({ ...formData, amenities: current.filter((a: string) => a !== amenity) });
                                            }
                                        }}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Travel Style</label>
                        <div className="flex flex-wrap gap-3">
                            {TRAVEL_STYLES.map(style => (
                                <label key={style} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.travel_style?.includes(style) || false}
                                        onChange={e => {
                                            const current = formData.travel_style || [];
                                            if (e.target.checked) {
                                                setFormData({ ...formData, travel_style: [...current, style] });
                                            } else {
                                                setFormData({ ...formData, travel_style: current.filter((s: string) => s !== style) });
                                            }
                                        }}
                                        className="mr-2"
                                    />
                                    <span className="text-sm capitalize">{style}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Interests</label>
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-3 rounded">
                            {INTERESTS.map(interest => (
                                <label key={interest} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.interests?.includes(interest) || false}
                                        onChange={e => {
                                            const current = formData.interests || [];
                                            if (e.target.checked) {
                                                setFormData({ ...formData, interests: [...current, interest] });
                                            } else {
                                                setFormData({ ...formData, interests: current.filter((i: string) => i !== interest) });
                                            }
                                        }}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{interest}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
});

const ChangePasswordModal = React.memo(({ onClose }: { onClose: () => void }) => {
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
});

const ViewBookingModal = memo(function ViewBookingModal({ booking, onClose }: any) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                <div className="space-y-3">
                    <p><span className="font-medium">Booking ID:</span> {booking.id}</p>
                    <p><span className="font-medium">Accommodation:</span> {booking.accommodation?.name || "N/A"}</p>
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
});
