"use client";

import { useState, useEffect } from "react";
import { Search, Eye, UserCheck, UserX } from "lucide-react";
import { GuideData } from "./types";

/**
 * Guides management section with table and filtering
 */
export default function GuidesSection() {
    const [guides, setGuides] = useState<GuideData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredGuides, setFilteredGuides] = useState<GuideData[]>([]);
    const [selectedGuide, setSelectedGuide] = useState<GuideData | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchGuides();
    }, []);

    useEffect(() => {
        if (search) {
            const filtered = guides.filter(guide =>
                guide.user.name.toLowerCase().includes(search.toLowerCase()) ||
                guide.user.email.toLowerCase().includes(search.toLowerCase()) ||
                guide.city?.toLowerCase().includes(search.toLowerCase()) ||
                guide.province?.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredGuides(filtered);
        } else {
            setFilteredGuides(guides);
        }
    }, [search, guides]);

    const fetchGuides = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/guides");
            if (response.ok) {
                const data = await response.json();
                setGuides(data.guides);
                setFilteredGuides(data.guides);
            }
        } catch (error) {
            console.error("Error fetching guides:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (guide: GuideData) => {
        setSelectedGuide(guide);
        setShowModal(true);
    };

    if (loading) {
        return <div className="text-center py-10">Loading guides...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search by name, email, city, or province..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
                    <Search size={20} />
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <p className="text-sm text-green-600 font-semibold">Total Guides</p>
                    <p className="text-2xl font-bold text-green-900">{guides.length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-600 font-semibold">Available</p>
                    <p className="text-2xl font-bold text-blue-900">
                        {guides.filter(g => g.availability).length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm text-purple-600 font-semibold">With Ratings</p>
                    <p className="text-2xl font-bold text-purple-900">
                        {guides.filter(g => g.rating !== null).length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <p className="text-sm text-orange-600 font-semibold">Total Bookings</p>
                    <p className="text-2xl font-bold text-orange-900">
                        {guides.reduce((sum, g) => sum + g._count.bookings, 0)}
                    </p>
                </div>
            </div>

            {/* Guides Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Languages</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bookings</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredGuides.map((guide) => (
                                <tr key={guide.user_id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900">{guide.user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{guide.user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {guide.city && guide.province
                                            ? `${guide.city}, ${guide.province}`
                                            : guide.city || guide.province || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {guide.languages.slice(0, 2).map((lang, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                    {lang}
                                                </span>
                                            ))}
                                            {guide.languages.length > 2 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    +{guide.languages.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {guide.rating ? (
                                            <span className="flex items-center gap-1">
                                                ⭐ {guide.rating.toFixed(1)}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">No rating</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {guide.price ? `LKR ${guide.price.toLocaleString()}` : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {guide._count.bookings}
                                    </td>
                                    <td className="px-6 py-4">
                                        {guide.availability ? (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <UserCheck size={16} />
                                                Available
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-600">
                                                <UserX size={16} />
                                                Unavailable
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleViewDetails(guide)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                                title="View details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredGuides.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No guides found
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            {showModal && selectedGuide && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-t-2xl">
                            <h3 className="text-2xl font-bold">Guide Details</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-3">Personal Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold">{selectedGuide.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{selectedGuide.user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Contact</p>
                                        <p className="font-semibold">{selectedGuide.user.contact_no || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Gender</p>
                                        <p className="font-semibold">{selectedGuide.gender || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-3">Location</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">City</p>
                                        <p className="font-semibold">{selectedGuide.city || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Province</p>
                                        <p className="font-semibold">{selectedGuide.province || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-3">Professional Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Languages</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedGuide.languages.map((lang, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Expertise</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedGuide.expertise.map((exp, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Experience</p>
                                        <div className="space-y-1">
                                            {selectedGuide.experience.map((exp, idx) => (
                                                <p key={idx} className="text-sm text-gray-700">• {exp}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Stats */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 mb-3">Pricing & Statistics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Price per Day</p>
                                        <p className="font-semibold text-lg">
                                            {selectedGuide.price ? `LKR ${selectedGuide.price.toLocaleString()}` : "Not set"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Rating</p>
                                        <p className="font-semibold text-lg">
                                            {selectedGuide.rating ? `⭐ ${selectedGuide.rating.toFixed(1)}` : "No rating"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Bookings</p>
                                        <p className="font-semibold text-lg">{selectedGuide._count.bookings}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Availability</p>
                                        <p className={`font-semibold text-lg ${selectedGuide.availability ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedGuide.availability ? "Available" : "Unavailable"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Account Number</p>
                                        <p className="font-semibold">{selectedGuide.account_no || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
