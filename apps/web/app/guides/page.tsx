"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, User, Filter, Globe, Award } from "lucide-react";

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
    };
}

export default function GuidesPage() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: "",
        language: "",
        expertise: "",
        price: "",
    });

    const fetchGuides = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.location) params.append("location", filters.location);
        if (filters.language) params.append("language", filters.language);
        if (filters.expertise) params.append("expertise", filters.expertise);
        if (filters.price) params.append("price", filters.price);


        try {
            const res = await fetch(`/api/guides?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setGuides(data);
            }
        } catch (error) {
            console.error("Failed to fetch guides", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuides();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchGuides();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent drop-shadow-lg">
                        Find Expert Guides
                    </h1>
                    <p className="text-xl font-light">Connect with local experts for an unforgettable experience</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-gradient-to-br from-green-100 to-blue-100 p-2 rounded-lg">
                                <Filter size={20} className="text-green-600" />
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
                                        className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Language
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. English, Sinhala"
                                        className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        value={filters.language}
                                        onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expertise
                                </label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. History, Wildlife"
                                        className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                        value={filters.expertise}
                                        onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Max Price (LKR/day)
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 10000"
                                    min={0}
                                    step={100}
                                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                    value={filters.price}
                                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
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
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-medium">Loading guides...</p>
                            </div>
                        ) : guides.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-6xl mb-4">🧭</div>
                                <p className="text-xl text-gray-600 font-medium mb-2">No guides found</p>
                                <p className="text-gray-500">Try adjusting your filters to see more results</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 text-gray-700 font-medium bg-white px-6 py-3 rounded-xl shadow-md border border-gray-100">
                                    Found <span className="text-green-600 font-bold">{guides.length}</span> expert guide{guides.length !== 1 ? 's' : ''}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {guides.map((guide) => (
                                        <Link
                                            key={guide.user_id}
                                            href={`/guides/${guide.user_id}`}
                                            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 overflow-hidden group hover:scale-[1.02] flex flex-col"
                                        >
                                            <div className="p-6 flex-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden flex-shrink-0 ring-4 ring-green-100 group-hover:ring-green-200 transition-all">
                                                        {guide.profile_picture ? (
                                                            <img
                                                                src={guide.profile_picture}
                                                                alt={guide.user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <User size={40} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                                                            {guide.user.name}
                                                        </h3>
                                                        <div className="flex items-center bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-yellow-200 w-fit">
                                                            <span className="text-yellow-500 font-bold mr-1">★</span>
                                                            <span className="text-sm font-bold text-gray-800">{guide.rating || "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2.5 mb-4">
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <MapPin size={16} className="mr-2 text-green-600 flex-shrink-0" />
                                                        <span>{guide.city ? `${guide.city}, ${guide.province}` : "Location not specified"}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 text-sm">
                                                        <Globe size={16} className="mr-2 text-blue-600 flex-shrink-0" />
                                                        <span>{guide.languages.join(", ")}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {guide.expertise.slice(0, 3).map(exp => (
                                                            <span key={exp} className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold border border-green-200">
                                                                {exp}
                                                            </span>
                                                        ))}
                                                        {guide.expertise.length > 3 && (
                                                            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-semibold border border-gray-200">
                                                                +{guide.expertise.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-green-50/30 border-t border-gray-200 flex justify-between items-center">
                                                <div>
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                                        Rs {guide.price.toLocaleString()}
                                                    </div>
                                                    <span className="text-gray-500 text-sm">per day</span>
                                                </div>
                                                <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm group-hover:shadow-lg transition-shadow">
                                                    View Profile
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
