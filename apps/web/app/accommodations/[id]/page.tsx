"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, Star, Check, User, Calendar, X } from "lucide-react";

interface Accommodation {
    id: string;
    name: string;
    location: string;
    price_range_min: number;
    price_range_max: number;
    images: string[];
    rating: number;
    type: string[];
    amenities: string[];
    description: string;
    provider: {
        user: {
            name: string;
            email: string;
            contact_no: string;
        };
    };
}

export default function AccommodationDetailsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: "",
        price: 0,
    });

    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const res = await fetch(`/api/accommodations/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAccommodation(data);
                    setBookingData(prev => ({ ...prev, price: data.price_range_min || 0 }));
                }
            } catch (error) {
                console.error("Failed to fetch accommodation", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAccommodation();
    }, [id]);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "accommodation",
                    itemId: accommodation?.id,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    price: bookingData.price,
                    location: accommodation?.location,
                }),
            });

            if (res.ok) {
                alert("Booking request sent successfully!");
                setShowBookingModal(false);
                router.push("/dashboard/tourist");
            } else {
                const error = await res.json();
                alert(`Booking failed: ${error.error}`);
            }
        } catch (error) {
            console.error("Booking error", error);
            alert("An error occurred while booking.");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!accommodation) return <div className="p-8 text-center">Accommodation not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Image Gallery (Simple) */}
            <div className="h-[400px] bg-gray-200 relative">
                {accommodation.images && accommodation.images.length > 0 ? (
                    <img src={accommodation.images[0]} alt={accommodation.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8 text-white">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">{accommodation.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center"><MapPin size={18} className="mr-1" /> {accommodation.location}</span>
                            <span className="flex items-center bg-yellow-500 text-black px-2 py-0.5 rounded font-bold text-sm">★ {accommodation.rating || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">About this place</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {accommodation.type.map(t => (
                                <span key={t} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{t}</span>
                            ))}
                        </div>
                        <p className="text-gray-600">
                            Experience a wonderful stay at {accommodation.name}. Located in {accommodation.location}, we offer the best amenities for your comfort.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {accommodation.amenities.map((amenity) => (
                                <div key={amenity} className="flex items-center text-gray-700">
                                    <Check size={18} className="text-green-500 mr-2" />
                                    {amenity}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Host Info</h2>
                        <div className="flex items-center gap-4">
                            <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center">
                                <User size={24} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="font-semibold">{accommodation.provider.user.name}</p>
                                <p className="text-gray-500 text-sm">Contact: {accommodation.provider.user.contact_no}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-2xl font-bold">${accommodation.price_range_min}</span>
                                <span className="text-gray-500"> / night</span>
                            </div>
                            {accommodation.price_range_max && (
                                <div className="text-gray-400 text-sm">
                                    up to ${accommodation.price_range_max}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-4"
                        >
                            Book Now
                        </button>
                        <p className="text-center text-gray-500 text-sm">You won't be charged yet</p>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setShowBookingModal(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Book your stay</h2>
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={bookingData.startDate}
                                    onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={bookingData.endDate}
                                    onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per night</label>
                                <input
                                    type="number"
                                    readOnly
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                                    value={bookingData.price}
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
