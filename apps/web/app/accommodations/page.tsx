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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Find Accommodations</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                        <div className="flex items-center gap-2 mb-6">
                            <Filter size={20} />
                            <h2 className="text-xl font-semibold">Filters</h2>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="City or Province"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Guests
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        placeholder="Number of guests"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={filters.guests}
                                        onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg bg-white"
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
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Apply Filters
                            </button>
                        </form>
                    </div>

                    {/* Results List */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="text-center py-12">Loading...</div>
                        ) : accommodations.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No accommodations found matching your criteria.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {accommodations.map((acc) => (
                                    <Link
                                        key={acc.id}
                                        href={`/accommodations/${acc.id}`}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
                                    >
                                        <div className="h-48 bg-gray-200 relative">
                                            {acc.images && acc.images.length > 0 ? (
                                                <img src={acc.images[0]} alt={acc.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Hotel size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold group-hover:text-blue-600 transition">
                                                    {acc.name}
                                                </h3>
                                                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-yellow-700">
                                                    ★ {acc.rating || "N/A"}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                                <MapPin size={14} className="mr-1" />
                                                {acc.location}
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mr-2">{acc.type.join(", ")}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t">
                                                <div className="text-blue-600 font-bold">
                                                    ${acc.price_range_min} - ${acc.price_range_max}
                                                    <span className="text-gray-400 text-sm font-normal"> / night</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
