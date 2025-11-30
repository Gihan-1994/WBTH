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
    });

    const fetchGuides = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.location) params.append("location", filters.location);
        if (filters.language) params.append("language", filters.language);
        if (filters.expertise) params.append("expertise", filters.expertise);

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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Find Guides</h1>

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
                                    Language
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="e.g. English, Sinhala"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={filters.language}
                                        onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expertise
                                </label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="e.g. History, Wildlife"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                        value={filters.expertise}
                                        onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}
                                    />
                                </div>
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
                        ) : guides.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No guides found matching your criteria.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {guides.map((guide) => (
                                    <Link
                                        key={guide.user_id}
                                        href={`/guides/${guide.user_id}`}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group flex flex-col"
                                    >
                                        <div className="p-6 flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                    {guide.profile_picture ? (
                                                        <img src={guide.profile_picture} alt={guide.user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <User size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold group-hover:text-blue-600 transition">
                                                        {guide.user.name}
                                                    </h3>
                                                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-yellow-700 w-fit mt-1">
                                                        ★ {guide.rating || "N/A"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <MapPin size={14} className="mr-2" />
                                                    {guide.city ? `${guide.city}, ${guide.province}` : "Location not specified"}
                                                </div>
                                                <div className="flex items-center text-gray-500 text-sm">
                                                    <Globe size={14} className="mr-2" />
                                                    {guide.languages.join(", ")}
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {guide.expertise.slice(0, 3).map(exp => (
                                                        <span key={exp} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">{exp}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                                            <div className="text-blue-600 font-bold">
                                                ${guide.price}
                                                <span className="text-gray-400 text-sm font-normal"> / day</span>
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
