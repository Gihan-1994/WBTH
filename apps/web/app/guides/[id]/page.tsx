"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { MapPin, Star, Globe, Award, User, Calendar, X, Briefcase } from "lucide-react";

interface Guide {
    user_id: string;
    experience: string[];
    languages: string[];
    expertise: string[];
    rating: number;
    price: number;
    city: string;
    province: string;
    profile_picture: string;
    user: {
        name: string;
        email: string;
        contact_no: string;
    };
}

export default function GuideDetailsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [guide, setGuide] = useState<Guide | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        startDate: "",
        endDate: "",
        price: 0,
    });

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const res = await fetch(`/api/guides/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setGuide(data);
                    setBookingData(prev => ({ ...prev, price: data.price || 0 }));
                }
            } catch (error) {
                console.error("Failed to fetch guide", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchGuide();
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
                    type: "guide",
                    itemId: guide?.user_id,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    price: bookingData.price,
                    location: guide?.city,
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
    if (!guide) return <div className="p-8 text-center">Guide not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Profile */}
            <div className="bg-blue-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full bg-white overflow-hidden border-4 border-white/30">
                        {guide.profile_picture ? (
                            <img src={guide.profile_picture} alt={guide.user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User size={64} />
                            </div>
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2">{guide.user.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-blue-100">
                            <span className="flex items-center"><MapPin size={18} className="mr-1" /> {guide.city ? `${guide.city}, ${guide.province}` : "Location not specified"}</span>
                            <span className="flex items-center bg-yellow-500 text-black px-2 py-0.5 rounded font-bold text-sm">★ {guide.rating || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">About Me</h2>
                        <p className="text-gray-600">
                            I am a professional guide with expertise in {guide.expertise.join(", ")}. I speak {guide.languages.join(", ")} and have experience in {guide.experience.join(", ")}.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {guide.expertise.map((exp) => (
                                <div key={exp} className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                                    <Award size={16} className="mr-2" />
                                    {exp}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Languages</h2>
                        <div className="flex flex-wrap gap-2">
                            {guide.languages.map((lang) => (
                                <div key={lang} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                                    <Globe size={16} className="mr-2" />
                                    {lang}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">Experience</h2>
                        <div className="flex flex-wrap gap-2">
                            {guide.experience.map((exp) => (
                                <div key={exp} className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                                    <Briefcase size={16} className="mr-2" />
                                    {exp}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-2xl font-bold">${guide.price}</span>
                                <span className="text-gray-500"> / day</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-4"
                        >
                            Book Guide
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
                        <h2 className="text-2xl font-bold mb-6">Book Guide</h2>
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={bookingData.startDate}
                                    onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={bookingData.endDate}
                                    onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per day</label>
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
