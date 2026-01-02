"use client";

import { useState, useEffect } from "react";
import { Search, Hotel, MapPin, Star, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { ProviderData, AccommodationData } from "./types";

/**
 * Accommodations management section grouped by providers
 */
export default function AccommodationsSection() {
    const [providers, setProviders] = useState<ProviderData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filteredProviders, setFilteredProviders] = useState<ProviderData[]>([]);
    const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set());
    const [selectedAccommodation, setSelectedAccommodation] = useState<AccommodationData | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchAccommodations();
    }, []);

    useEffect(() => {
        if (search) {
            const filtered = providers.filter(provider =>
                provider.company_name.toLowerCase().includes(search.toLowerCase()) ||
                provider.user.name.toLowerCase().includes(search.toLowerCase()) ||
                provider.user.email.toLowerCase().includes(search.toLowerCase()) ||
                provider.accommodations.some(acc =>
                    acc.name.toLowerCase().includes(search.toLowerCase()) ||
                    acc.district.toLowerCase().includes(search.toLowerCase())
                )
            );
            setFilteredProviders(filtered);
        } else {
            setFilteredProviders(providers);
        }
    }, [search, providers]);

    const fetchAccommodations = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/accommodations");
            if (response.ok) {
                const data = await response.json();
                setProviders(data.providers);
                setFilteredProviders(data.providers);
                // Expand all providers by default
                const allProviderIds: Set<string> = new Set(data.providers.map((p: ProviderData) => p.provider_id));
                setExpandedProviders(allProviderIds);
            }
        } catch (error) {
            console.error("Error fetching accommodations:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleProvider = (providerId: string) => {
        const newExpanded = new Set(expandedProviders);
        if (newExpanded.has(providerId)) {
            newExpanded.delete(providerId);
        } else {
            newExpanded.add(providerId);
        }
        setExpandedProviders(newExpanded);
    };

    const handleViewDetails = (accommodation: AccommodationData) => {
        setSelectedAccommodation(accommodation);
        setShowModal(true);
    };

    const totalAccommodations = providers.reduce((sum, p) => sum + p.accommodations.length, 0);
    const totalBookings = providers.reduce((sum, p) =>
        sum + p.accommodations.reduce((accSum, acc) => accSum + acc._count.bookings, 0), 0
    );

    if (loading) {
        return <div className="text-center py-10">Loading accommodations...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search by provider, accommodation, or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
                    <Search size={20} />
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <p className="text-base text-blue-600 font-semibold">Total Providers</p>
                    <p className="text-2xl font-bold text-blue-900">{providers.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <p className="text-base text-purple-600 font-semibold">Total Accommodations</p>
                    <p className="text-2xl font-bold text-purple-900">{totalAccommodations}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <p className="text-base text-green-600 font-semibold">Total Bookings</p>
                    <p className="text-2xl font-bold text-green-900">{totalBookings}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <p className="text-base text-orange-600 font-semibold">Avg per Provider</p>
                    <p className="text-2xl font-bold text-orange-900">
                        {providers.length > 0 ? (totalAccommodations / providers.length).toFixed(1) : 0}
                    </p>
                </div>
            </div>

            {/* Providers List */}
            <div className="space-y-4">
                {filteredProviders.map((provider) => (
                    <div key={provider.provider_id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Provider Header */}
                        <div
                            className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 cursor-pointer hover:from-blue-100 hover:to-purple-100 transition-colors"
                            onClick={() => toggleProvider(provider.provider_id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-600 text-white p-3 rounded-xl">
                                        <Hotel size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{provider.company_name}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-base text-gray-600">
                                            <span>👤 {provider.user.name}</span>
                                            <span>📧 {provider.user.email}</span>
                                            {provider.user.contact_no && <span>📱 {provider.user.contact_no}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-base text-gray-600">Accommodations</p>
                                        <p className="text-2xl font-bold text-blue-600">{provider.accommodations.length}</p>
                                    </div>
                                    {expandedProviders.has(provider.provider_id) ? (
                                        <ChevronUp size={24} className="text-gray-600" />
                                    ) : (
                                        <ChevronDown size={24} className="text-gray-600" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Accommodations Table */}
                        {expandedProviders.has(provider.provider_id) && (
                            <div className="p-6">
                                {provider.accommodations.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Name</th>
                                                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Type</th>
                                                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Location</th>
                                                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Price Range</th>
                                                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Rating</th>
                                                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-700">Bookings</th>
                                                    <th className="px-6 py-4 text-center text-base font-semibold text-gray-700">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {provider.accommodations.map((accommodation) => (
                                                    <tr key={accommodation.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 text-base text-gray-900 font-semibold">
                                                            {accommodation.name}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {accommodation.type.slice(0, 2).map((t, idx) => (
                                                                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                                                                        {t}
                                                                    </span>
                                                                ))}
                                                                {accommodation.type.length > 2 && (
                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                                                        +{accommodation.type.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-base text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin size={16} />
                                                                {accommodation.district}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-base text-gray-900">
                                                            {accommodation.price_range_min && accommodation.price_range_max
                                                                ? `LKR ${accommodation.price_range_min.toLocaleString()} - ${accommodation.price_range_max.toLocaleString()}`
                                                                : "Not set"}
                                                        </td>
                                                        <td className="px-6 py-4 text-base text-gray-900">
                                                            {accommodation.rating ? (
                                                                <span className="flex items-center gap-1">
                                                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                                    {accommodation.rating.toFixed(1)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">No rating</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-base text-gray-900">
                                                            {accommodation._count.bookings}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => handleViewDetails(accommodation)}
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
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        No accommodations for this provider
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {filteredProviders.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-2xl shadow-lg">
                        No providers found
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            {showModal && selectedAccommodation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
                            <h3 className="text-2xl font-bold">{selectedAccommodation.name}</h3>
                            <p className="text-white/90 mt-1 flex items-center gap-2">
                                <MapPin size={18} />
                                {selectedAccommodation.district}
                                {selectedAccommodation.location && ` - ${selectedAccommodation.location}`}
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-base text-gray-600">Rating</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {selectedAccommodation.rating ? (
                                            <span className="flex items-center gap-1">
                                                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                                {selectedAccommodation.rating.toFixed(1)}
                                            </span>
                                        ) : (
                                            "No rating"
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-600">Total Bookings</p>
                                    <p className="text-xl font-bold text-gray-900">{selectedAccommodation._count.bookings}</p>
                                </div>
                                <div>
                                    <p className="text-base text-gray-600">Price Range</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {selectedAccommodation.price_range_min && selectedAccommodation.price_range_max
                                            ? `LKR ${selectedAccommodation.price_range_min.toLocaleString()} - ${selectedAccommodation.price_range_max.toLocaleString()}`
                                            : "Not set"}
                                    </p>
                                </div>
                            </div>

                            {/* Types */}
                            <div>
                                <p className="text-base text-gray-600 mb-2 font-semibold">Accommodation Types</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAccommodation.type.map((t, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-base">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div>
                                <p className="text-base text-gray-600 mb-2 font-semibold">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAccommodation.amenities.map((amenity, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-base">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Images */}
                            {selectedAccommodation.images.length > 0 && (
                                <div>
                                    <p className="text-base text-gray-600 mb-2 font-semibold">Images</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedAccommodation.images.slice(0, 6).map((image, idx) => (
                                            <img
                                                key={idx}
                                                src={image}
                                                alt={`${selectedAccommodation.name} ${idx + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
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
