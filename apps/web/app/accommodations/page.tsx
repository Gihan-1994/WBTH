"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, DollarSign, Users, Filter, Hotel } from "lucide-react";

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
}

export default function AccommodationsPage() {
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: "",
        minPrice: "",
        maxPrice: "",
        guests: "",
        type: "",
    });

    const fetchAccommodations = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.location) params.append("location", filters.location);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.guests) params.append("guests", filters.guests);
        if (filters.type) params.append("type", filters.type);

        try {
            const res = await fetch(`/api/accommodations?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setAccommodations(data);
            }
        } catch (error) {
            console.error("Failed to fetch accommodations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccommodations();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAccommodations();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-lg">
                        Find Accommodations
                    </h1>
                    <p className="text-xl font-light">Discover the perfect place to stay for your journey</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-2 rounded-lg">
                                <Filter size={20} className="text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="City or Province"
                                        className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Price Range (LKR)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Guests
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        placeholder="Number of guests"
                                        className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        value={filters.guests}
                                        onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Type
                                </label>
                                <select
                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                >
                                    <option value="">Any Type</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Resort">Resort</option>
                                    <option value="Homestay">Homestay</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <Search size={20} />
                                Apply Filters
                            </button>
                        </form>
                    </div>

                    {/* Results List */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-medium">Loading accommodations...</p>
                            </div>
                        ) : accommodations.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-6xl mb-4">🏨</div>
                                <p className="text-xl text-gray-600 font-medium mb-2">No accommodations found</p>
                                <p className="text-gray-500">Try adjusting your filters to see more results</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 text-gray-700 font-medium bg-white px-6 py-3 rounded-xl shadow-md border border-gray-100">
                                    Found <span className="text-purple-600 font-bold">{accommodations.length}</span> accommodation{accommodations.length !== 1 ? 's' : ''}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {accommodations.map((acc) => (
                                        <Link
                                            key={acc.id}
                                            href={`/accommodations/${acc.id}`}
                                            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden group hover:scale-[1.02]"
                                        >
                                            <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                                {acc.images && acc.images.length > 0 ? (
                                                    <img
                                                        src={acc.images[0]}
                                                        alt={acc.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Hotel size={64} />
                                                    </div>
                                                )}
                                                {/* Rating Badge */}
                                                <div className="absolute top-4 right-4 flex items-center bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                                    <span className="text-yellow-500 font-bold mr-1">★</span>
                                                    <span className="text-sm font-bold text-gray-800">{acc.rating || "N/A"}</span>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                                    {acc.name}
                                                </h3>
                                                <div className="flex items-center text-gray-600 text-sm mb-3">
                                                    <MapPin size={16} className="mr-1 text-purple-600" />
                                                    {acc.location}
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {acc.type.map((t, idx) => (
                                                        <span key={idx} className="bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold border border-purple-200">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                    <div>
                                                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                            ${acc.price_range_min} - ${acc.price_range_max}
                                                        </div>
                                                        <span className="text-gray-500 text-sm">per night</span>
                                                    </div>
                                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm group-hover:shadow-lg transition-shadow">
                                                        View Details
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
