"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, User, Globe, Award, ChevronDown, ChevronLeft, ChevronRight, X, Home } from "lucide-react";

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

const ITEMS_PER_PAGE = 9;

const EXPERTISE_OPTIONS = ["History", "Wildlife", "Adventure", "Culture", "Photography", "Trekking", "Beach", "Architecture"];
const LANGUAGE_OPTIONS = ["English", "Sinhala", "Tamil", "German", "French", "Japanese", "Chinese", "Spanish"];

export default function GuidesPage() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
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
                setCurrentPage(1);
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

    const clearFilters = () => {
        setFilters({
            location: "",
            language: "",
            expertise: "",
            price: "",
        });
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

    // Pagination
    const totalPages = Math.ceil(guides.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedGuides = guides.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div
                className="relative h-[320px] bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-indigo-900/90" />
                <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home size={14} />
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-white">Tour Guides</span>
                    </nav>
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                        Expert Local Guides
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl">
                        Connect with experienced local guides who bring Sri Lanka's stories to life
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Location */}
                            <div className="relative flex-1 min-w-[200px]">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </div>

                            {/* Language */}
                            <select
                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-sm min-w-[140px]"
                                value={filters.language}
                                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                            >
                                <option value="">All Languages</option>
                                {LANGUAGE_OPTIONS.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>

                            {/* More Filters Button */}
                            <button
                                type="button"
                                onClick={() => setShowMoreFilters(!showMoreFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all text-sm ${
                                    showMoreFilters || activeFilterCount > 2
                                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                More Filters
                                {activeFilterCount > 2 && (
                                    <span className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                        {activeFilterCount - 2}
                                    </span>
                                )}
                                <ChevronDown size={16} className={`transition-transform ${showMoreFilters ? "rotate-180" : ""}`} />
                            </button>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all text-sm"
                            >
                                <Search size={18} />
                                Search
                            </button>

                            {/* Clear Filters */}
                            {activeFilterCount > 0 && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    <X size={16} />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Expanded Filters */}
                        {showMoreFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Expertise</label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-sm"
                                            value={filters.expertise}
                                            onChange={(e) => setFilters({ ...filters, expertise: e.target.value })}
                                        >
                                            <option value="">Any Expertise</option>
                                            {EXPERTISE_OPTIONS.map(exp => (
                                                <option key={exp} value={exp}>{exp}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price (LKR/day)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 10000"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                        value={filters.price}
                                        onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : guides.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <User className="mx-auto text-gray-300 mb-4" size={64} />
                        <p className="text-xl text-gray-600 font-medium mb-2">No guides found</p>
                        <p className="text-gray-500">Try adjusting your filters to see more results</p>
                    </div>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, guides.length)}</span> of{" "}
                                <span className="font-semibold text-gray-900">{guides.length}</span> guides
                            </p>
                        </div>

                        {/* Three Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedGuides.map((guide) => (
                                <Link
                                    key={guide.user_id}
                                    href={`/guides/${guide.user_id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                                >
                                    {/* Profile Section */}
                                    <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                                        {guide.profile_picture ? (
                                            <img
                                                src={guide.profile_picture}
                                                alt={guide.user.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center">
                                                    <User size={48} className="text-indigo-300" />
                                                </div>
                                            </div>
                                        )}
                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 flex items-center bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="text-sm font-semibold text-gray-800">{guide.rating || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Name */}
                                        <h3 className="font-display text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {guide.user.name}
                                        </h3>

                                        {/* Location */}
                                        <div className="flex items-center text-gray-500 text-sm mb-2">
                                            <MapPin size={14} className="mr-1.5 text-indigo-500" />
                                            {guide.city ? `${guide.city}, ${guide.province}` : "Location not specified"}
                                        </div>

                                        {/* Languages */}
                                        <div className="flex items-center text-gray-500 text-sm mb-3">
                                            <Globe size={14} className="mr-1.5 text-indigo-500" />
                                            {guide.languages.slice(0, 3).join(", ")}
                                            {guide.languages.length > 3 && ` +${guide.languages.length - 3}`}
                                        </div>

                                        {/* Expertise Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {guide.expertise.slice(0, 3).map(exp => (
                                                <span key={exp} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    {exp}
                                                </span>
                                            ))}
                                            {guide.expertise.length > 3 && (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    +{guide.expertise.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* Price & CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    LKR {guide.price?.toLocaleString() || "N/A"}
                                                </span>
                                                <span className="text-gray-500 text-sm"> /day</span>
                                            </div>
                                            <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                                                View Profile →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                    Prev
                                </button>

                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map((page, idx) => (
                                        typeof page === "number" ? (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                                                    currentPage === page
                                                        ? "bg-gray-900 text-white"
                                                        : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ) : (
                                            <span key={idx} className="w-10 h-10 flex items-center justify-center text-gray-400">
                                                ...
                                            </span>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
