"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Users, Hotel, ChevronDown, ChevronLeft, ChevronRight, X, Home } from "lucide-react";

interface Accommodation {
    id: string;
    name: string;
    district: string;
    price_range_min: number;
    price_range_max: number;
    images: string[];
    rating: number;
    type: string[];
    amenities: string[];
}

const ITEMS_PER_PAGE = 9;

const ACCOMMODATION_TYPES = ["Hotel", "Villa", "Resort", "Homestay", "Boutique Hotel", "Guest House"];

export default function AccommodationsPage() {
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        district: "",
        minPrice: "",
        maxPrice: "",
        guests: "",
        type: "",
    });

    const fetchAccommodations = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.district) params.append("district", filters.district);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.guests) params.append("guests", filters.guests);
        if (filters.type) params.append("type", filters.type);

        try {
            const res = await fetch(`/api/accommodations?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setAccommodations(data);
                setCurrentPage(1);
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

    const clearFilters = () => {
        setFilters({
            district: "",
            minPrice: "",
            maxPrice: "",
            guests: "",
            type: "",
        });
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

    // Pagination
    const totalPages = Math.ceil(accommodations.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedAccommodations = accommodations.slice(startIndex, endIndex);

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
                    backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
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
                        <span className="text-white">Accommodations</span>
                    </nav>
                    <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-xl text-white/80 max-w-2xl">
                        Discover handpicked accommodations across Sri Lanka, from luxury resorts to cozy homestays
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* District */}
                            <div className="relative flex-1 min-w-[200px]">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="District (e.g. Colombo, Kandy)"
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                    value={filters.district}
                                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                                />
                            </div>

                            {/* Type */}
                            <select
                                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-sm min-w-[140px]"
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <option value="">All Types</option>
                                {ACCOMMODATION_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
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
                            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Price (LKR)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price (LKR)</label>
                                    <input
                                        type="number"
                                        placeholder="Any"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="number"
                                            placeholder="Number of guests"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                            value={filters.guests}
                                            onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                                        />
                                    </div>
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
                ) : accommodations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <Hotel className="mx-auto text-gray-300 mb-4" size={64} />
                        <p className="text-xl text-gray-600 font-medium mb-2">No accommodations found</p>
                        <p className="text-gray-500">Try adjusting your filters to see more results</p>
                    </div>
                ) : (
                    <>
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, accommodations.length)}</span> of{" "}
                                <span className="font-semibold text-gray-900">{accommodations.length}</span> accommodations
                            </p>
                        </div>

                        {/* Three Column Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedAccommodations.map((acc) => (
                                <Link
                                    key={acc.id}
                                    href={`/accommodations/${acc.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                                >
                                    {/* Image */}
                                    <div className="h-52 bg-gray-100 relative overflow-hidden">
                                        {acc.images && acc.images.length > 0 ? (
                                            <img
                                                src={acc.images[0]}
                                                alt={acc.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Hotel size={48} />
                                            </div>
                                        )}
                                        {/* Type Badge */}
                                        {acc.type && acc.type.length > 0 && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-white/95 backdrop-blur-sm text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                                    {acc.type[0]}
                                                </span>
                                            </div>
                                        )}
                                        {/* Rating Badge */}
                                        <div className="absolute top-4 right-4 flex items-center bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="text-sm font-semibold text-gray-800">{acc.rating || "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Location */}
                                        <div className="flex items-center text-gray-500 text-sm mb-2">
                                            <MapPin size={14} className="mr-1.5 text-indigo-500" />
                                            {acc.district}
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-display text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {acc.name}
                                        </h3>

                                        {/* Price & CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    LKR {acc.price_range_min?.toLocaleString() || "N/A"}
                                                </span>
                                                {acc.price_range_max && acc.price_range_max !== acc.price_range_min && (
                                                    <span className="text-gray-500"> - {acc.price_range_max.toLocaleString()}</span>
                                                )}
                                                <span className="text-gray-500 text-sm"> /night</span>
                                            </div>
                                            <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                                                View Details →
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
