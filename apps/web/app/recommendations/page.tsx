"use client";

import { useState } from "react";
import { Loader2, MapPin, Star, Check, Search, Home, Compass, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface Recommendation {
    id: string;
    name: string;
    location?: string;
    district?: string;
    city?: string;
    province: string;
    price_range_min?: number;
    price_range_max?: number;
    price?: number;
    rating: number | null;
    score: number;
    reasons: string[];
    in_system: boolean;
    languages?: string[];
    expertise?: string[];
}

interface RecommendationResponse {
    recommendations: Recommendation[];
    total_candidates: number;
    filters_applied?: string[];
    message?: string;
}

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000";

const AMENITIES = ["wifi", "pool", "parking", "restaurant", "gym", "spa", "air_conditioning", "tv"];
const INTERESTS = ["coastal", "cultural", "historical", "wildlife", "adventure", "luxury", "romantic", "family_friendly", "budget_friendly"];
const TRAVEL_STYLES = ["luxury", "budget", "family", "adventure", "romantic"];
const ACCOMMODATION_TYPES = [
    { value: "any", label: "Any Type" },
    { value: "hotel", label: "Hotel" },
    { value: "villa", label: "Villa" },
    { value: "resort", label: "Resort" },
    { value: "homestay", label: "Homestay" },
];
const LANGUAGES = ["English", "Sinhala", "Tamil", "French", "German", "Japanese", "Chinese", "Spanish"];
const EXPERTISE = ["Wildlife", "Cultural", "Adventure", "Historical", "Photography", "Surfing", "Diving", "Hiking", "Tea Plantation", "Ayurveda"];
const SRI_LANKA_DISTRICTS = ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Anuradhapura", "Trincomalee", "Batticaloa", "Matara", "Nuwara Eliya", "Ella", "Sigiriya", "Mirissa", "Hikkaduwa"];
const SRI_LANKA_PROVINCES = ["Western", "Central", "Southern", "Northern", "Eastern", "North Western", "North Central", "Uva", "Sabaragamuwa"];

const ITEMS_PER_PAGE = 9;

export default function RecommendationsPage() {
    const [activeType, setActiveType] = useState<"accommodation" | "guide">("accommodation");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [totalCandidates, setTotalCandidates] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Accommodation filters
    const [budgetMin, setBudgetMin] = useState(1000);
    const [budgetMax, setBudgetMax] = useState(50000);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [interests, setInterests] = useState<string[]>([]);
    const [travelStyle, setTravelStyle] = useState("budget");
    const [groupSize, setGroupSize] = useState(1);
    const [accommodationType, setAccommodationType] = useState("any");
    const [district, setDistrict] = useState("");
    const [province, setProvince] = useState("");

    // Guide filters
    const [guideBudgetMin, setGuideBudgetMin] = useState(2000);
    const [guideBudgetMax, setGuideBudgetMax] = useState(20000);
    const [languages, setLanguages] = useState<string[]>(["English"]);
    const [expertise, setExpertise] = useState<string[]>([]);
    const [guideCity, setGuideCity] = useState("");
    const [guideProvince, setGuideProvince] = useState("");
    const [genderPreference, setGenderPreference] = useState("");

    const toggleArrayItem = (arr: string[], item: string, setter: (arr: string[]) => void) => {
        setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
    };

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setCurrentPage(1);

        try {
            if (activeType === "accommodation") {
                const response = await fetch(`${FLASK_API_URL}/api/recommendations/accommodations`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        budget_min: budgetMin,
                        budget_max: budgetMax,
                        required_amenities: amenities,
                        interests: interests,
                        travel_style: travelStyle,
                        group_size: groupSize,
                        accommodation_type: accommodationType,
                        district: district || null,
                        province: province || null,
                        city_only: true,
                        top_k: 10,
                    }),
                });

                if (!response.ok) throw new Error(`API error: ${response.status}`);
                const data: RecommendationResponse = await response.json();
                setRecommendations(data.recommendations);
                setTotalCandidates(data.total_candidates);
                if (data.recommendations.length === 0) {
                    setError(data.message || "No recommendations found. Try adjusting your filters.");
                }
            } else {
                if (languages.length === 0) {
                    setError("Please select at least one language");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${FLASK_API_URL}/api/recommendations/guides`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        budget_min: guideBudgetMin,
                        budget_max: guideBudgetMax,
                        languages: languages,
                        expertise: expertise,
                        city: guideCity || null,
                        province: guideProvince || null,
                        city_only: false,
                        gender_preference: genderPreference || null,
                        top_k: 10,
                    }),
                });

                if (!response.ok) throw new Error(`API error: ${response.status}`);
                const data: RecommendationResponse = await response.json();
                setRecommendations(data.recommendations);
                setTotalCandidates(data.total_candidates);
                if (data.recommendations.length === 0) {
                    setError(data.message || "No guides found. Try adjusting your filters.");
                }
            }
        } catch (err) {
            console.error("Error fetching recommendations:", err);
            setError("Failed to fetch recommendations. Please ensure the API is running.");
        } finally {
            setLoading(false);
            setShowFilters(false);
        }
    };

    const getActiveFiltersCount = () => {
        if (activeType === "accommodation") {
            let count = 0;
            if (district) count++;
            if (province) count++;
            if (accommodationType !== "any") count++;
            if (amenities.length > 0) count++;
            if (interests.length > 0) count++;
            return count;
        } else {
            let count = 0;
            if (guideCity) count++;
            if (guideProvince) count++;
            if (expertise.length > 0) count++;
            if (genderPreference) count++;
            return count;
        }
    };

    // Pagination
    const totalPages = Math.ceil(recommendations.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedRecommendations = recommendations.slice(startIndex, endIndex);

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
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                                <Home size={20} />
                            </Link>
                            <div className="h-6 w-px bg-gray-200" />
                            <h1 className="text-lg font-semibold text-gray-900">Recommendations</h1>
                        </div>

                        {/* Type Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => { setActiveType("accommodation"); setRecommendations([]); setError(null); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    activeType === "accommodation"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Home size={16} />
                                Stays
                            </button>
                            <button
                                onClick={() => { setActiveType("guide"); setRecommendations([]); setError(null); }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                    activeType === "guide"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Compass size={16} />
                                Guides
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Budget */}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="text-sm text-gray-500">Budget:</span>
                            <input
                                type="number"
                                value={activeType === "accommodation" ? budgetMin : guideBudgetMin}
                                onChange={(e) => activeType === "accommodation" ? setBudgetMin(Number(e.target.value)) : setGuideBudgetMin(Number(e.target.value))}
                                className="w-20 px-2 py-1 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                value={activeType === "accommodation" ? budgetMax : guideBudgetMax}
                                onChange={(e) => activeType === "accommodation" ? setBudgetMax(Number(e.target.value)) : setGuideBudgetMax(Number(e.target.value))}
                                className="w-24 px-2 py-1 text-sm border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            />
                            <span className="text-xs text-gray-400">LKR</span>
                        </div>

                        {/* Travel Style / Languages */}
                        {activeType === "accommodation" ? (
                            <select
                                value={travelStyle}
                                onChange={(e) => setTravelStyle(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                            >
                                {TRAVEL_STYLES.map((s) => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Style</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Lang:</span>
                                <div className="flex gap-1">
                                    {["English", "Sinhala", "Tamil"].map((l) => (
                                        <button
                                            key={l}
                                            onClick={() => toggleArrayItem(languages, l, setLanguages)}
                                            className={`px-2 py-1 text-xs rounded font-medium ${
                                                languages.includes(l) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* More Filters Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-all ${
                                showFilters || getActiveFiltersCount() > 0
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                        >
                            <span>More Filters</span>
                            {getActiveFiltersCount() > 0 && (
                                <span className="bg-white text-gray-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                    {getActiveFiltersCount()}
                                </span>
                            )}
                            <ChevronDown size={16} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        </button>

                        {/* Search Button */}
                        <button
                            onClick={handleSearch}
                            disabled={loading || (activeType === "guide" && languages.length === 0)}
                            className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white text-sm rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 ml-auto"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                            Search
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {activeType === "accommodation" ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">District</label>
                                        <select
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                                        >
                                            <option value="">Any</option>
                                            {SRI_LANKA_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Province</label>
                                        <select
                                            value={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                                        >
                                            <option value="">Any</option>
                                            {SRI_LANKA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Type</label>
                                        <select
                                            value={accommodationType}
                                            onChange={(e) => setAccommodationType(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                                        >
                                            {ACCOMMODATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Group Size</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={groupSize}
                                            onChange={(e) => setGroupSize(Number(e.target.value))}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs text-gray-500 mb-1">Amenities</label>
                                        <div className="flex flex-wrap gap-1">
                                            {AMENITIES.slice(0, 6).map((a) => (
                                                <button
                                                    key={a}
                                                    onClick={() => toggleArrayItem(amenities, a, setAmenities)}
                                                    className={`px-2 py-1 text-xs rounded font-medium ${
                                                        amenities.includes(a) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {a.replace("_", " ")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 md:col-span-4 lg:col-span-6">
                                        <label className="block text-xs text-gray-500 mb-1">Interests</label>
                                        <div className="flex flex-wrap gap-1">
                                            {INTERESTS.map((i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => toggleArrayItem(interests, i, setInterests)}
                                                    className={`px-2 py-1 text-xs rounded font-medium ${
                                                        interests.includes(i) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {i.replace("_", " ")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">City</label>
                                        <select
                                            value={guideCity}
                                            onChange={(e) => setGuideCity(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                                        >
                                            <option value="">Any</option>
                                            {SRI_LANKA_DISTRICTS.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Province</label>
                                        <select
                                            value={guideProvince}
                                            onChange={(e) => setGuideProvince(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                                        >
                                            <option value="">Any</option>
                                            {SRI_LANKA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Gender</label>
                                        <select
                                            value={genderPreference}
                                            onChange={(e) => setGenderPreference(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
                                        >
                                            <option value="">Any</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 md:col-span-3">
                                        <label className="block text-xs text-gray-500 mb-1">Languages</label>
                                        <div className="flex flex-wrap gap-1">
                                            {LANGUAGES.map((l) => (
                                                <button
                                                    key={l}
                                                    onClick={() => toggleArrayItem(languages, l, setLanguages)}
                                                    className={`px-2 py-1 text-xs rounded font-medium ${
                                                        languages.includes(l) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2 md:col-span-4 lg:col-span-6">
                                        <label className="block text-xs text-gray-500 mb-1">Expertise</label>
                                        <div className="flex flex-wrap gap-1">
                                            {EXPERTISE.map((e) => (
                                                <button
                                                    key={e}
                                                    onClick={() => toggleArrayItem(expertise, e, setExpertise)}
                                                    className={`px-2 py-1 text-xs rounded font-medium ${
                                                        expertise.includes(e) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {e}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(endIndex, recommendations.length)}</span> of{" "}
                            <span className="font-medium text-gray-900">{recommendations.length}</span> matches
                            {totalCandidates > recommendations.length && (
                                <span className="text-gray-400"> (from {totalCandidates} total)</span>
                            )}
                        </p>
                        {totalPages > 1 && (
                            <p className="text-sm text-gray-400">Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedRecommendations.map((rec) => (
                            <div key={rec.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{rec.name}</h3>
                                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                                            <MapPin size={12} />
                                            <span className="truncate">{rec.city || rec.district || rec.location}, {rec.province}</span>
                                        </p>
                                    </div>
                                    {rec.rating && (
                                        <span className="flex items-center gap-1 text-sm text-gray-600 ml-2">
                                            <Star size={14} className="text-amber-500 fill-amber-500" />
                                            {rec.rating.toFixed(1)}
                                        </span>
                                    )}
                                </div>

                                {activeType === "accommodation" && rec.price_range_min && rec.price_range_max && (
                                    <p className="text-lg font-semibold text-gray-900 mb-2">
                                        LKR {rec.price_range_min.toLocaleString()} - {rec.price_range_max.toLocaleString()}
                                    </p>
                                )}
                                {activeType === "guide" && rec.price && (
                                    <p className="text-lg font-semibold text-gray-900 mb-2">
                                        LKR {rec.price.toLocaleString()}/day
                                    </p>
                                )}

                                {activeType === "guide" && rec.languages && rec.languages.length > 0 && (
                                    <p className="text-xs text-gray-500 mb-2 truncate">
                                        {rec.languages.join(", ")}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                                        <span className="text-gray-500">Match:</span>
                                        <span className="font-semibold text-gray-900">{(rec.score * 100).toFixed(0)}%</span>
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-2.5 rounded-lg mb-3">
                                    <ul className="space-y-0.5">
                                        {rec.reasons.slice(0, 2).map((reason, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                                                <Check size={12} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-1">{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {rec.in_system ? (
                                    <Link
                                        href={activeType === "accommodation" ? `/accommodations/${rec.id}` : `/guides/${rec.id}`}
                                        className="block w-full text-center px-4 py-2 bg-gray-900 text-white text-sm rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                ) : (
                                    <span className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-500 text-sm rounded-lg">
                                        Not available
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {recommendations.length > 0 && totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {getPageNumbers().map((page, idx) => (
                            typeof page === "number" ? (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all ${
                                        currentPage === page
                                            ? "bg-gray-900 text-white"
                                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={idx} className="px-2 text-gray-400">...</span>
                            )
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}

                {!loading && !error && recommendations.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <p className="text-gray-600 font-medium">Search for {activeType === "accommodation" ? "accommodations" : "guides"}</p>
                        <p className="text-sm text-gray-400 mt-1">Set your preferences above and click Search</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
