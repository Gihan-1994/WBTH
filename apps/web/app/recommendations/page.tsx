"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Recommendation {
    id: string;
    name: string;
    location: string;
    province: string;
    price_range_min: number;
    price_range_max: number;
    rating: number | null;
    score: number;
    reasons: string[];
    in_system: boolean;
}

interface RecommendationResponse {
    recommendations: Recommendation[];
    total_candidates: number;
    filters_applied?: string[];
    message?: string;
}

interface FilterState {
    budget_min: number;
    budget_max: number;
    required_amenities: string[];
    interests: string[];
    travel_style: string;
    group_size: number;
    accommodation_type: string;
    district: string;
    province: string;
}

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000";

const AMENITIES = [
    "wifi",
    "pool",
    "parking",
    "restaurant",
    "gym",
    "spa",
    "air_conditioning",
    "tv",
];

const INTERESTS = [
    "coastal",
    "cultural",
    "historical",
    "wildlife",
    "adventure",
    "luxury",
    "romantic",
    "family_friendly",
    "budget_friendly",
];

const TRAVEL_STYLES = ["luxury", "budget", "family", "adventure", "romantic"];

const ACCOMMODATION_TYPES = [
    { value: "any", label: "Any Type" },
    { value: "hotel", label: "Hotel" },
    { value: "villa", label: "Villa" },
    { value: "resort", label: "Resort" },
    { value: "homestay", label: "Homestay" },
];

const SRI_LANKA_DISTRICTS = [
    "Colombo",
    "Kandy",
    "Galle",
    "Jaffna",
    "Negombo",
    "Anuradhapura",
    "Trincomalee",
    "Batticaloa",
    "Matara",
    "Nuwara Eliya",
];

const SRI_LANKA_PROVINCES = [
    "Western",
    "Central",
    "Southern",
    "Northern",
    "Eastern",
    "North Western",
    "North Central",
    "Uva",
    "Sabaragamuwa",
];

export default function RecommendationsPage() {
    const [activeTab, setActiveTab] = useState<"accommodation" | "guide">("accommodation");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [totalCandidates, setTotalCandidates] = useState(0);

    const [filters, setFilters] = useState<FilterState>({
        budget_min: 1000,
        budget_max: 50000,
        required_amenities: [],
        interests: [],
        travel_style: "budget",
        group_size: 1,
        accommodation_type: "any",
        district: "",
        province: "",
    });

    const handleAmenityToggle = (amenity: string) => {
        setFilters((prev) => ({
            ...prev,
            required_amenities: prev.required_amenities.includes(amenity)
                ? prev.required_amenities.filter((a) => a !== amenity)
                : [...prev.required_amenities, amenity],
        }));
    };

    const handleInterestToggle = (interest: string) => {
        setFilters((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const handleGetRecommendations = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${FLASK_API_URL}/api/recommendations/accommodations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    budget_min: filters.budget_min,
                    budget_max: filters.budget_max,
                    required_amenities: filters.required_amenities,
                    interests: filters.interests,
                    travel_style: filters.travel_style,
                    group_size: filters.group_size,
                    accommodation_type: filters.accommodation_type,
                    district: filters.district || null,
                    province: filters.province || null,
                    city_only: true,
                    top_k: 10,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data: RecommendationResponse = await response.json();
            setRecommendations(data.recommendations);
            setTotalCandidates(data.total_candidates);

            if (data.recommendations.length === 0) {
                setError(data.message || "No recommendations found. Try adjusting your filters.");
            }
        } catch (err) {
            console.error("Error fetching recommendations:", err);
            setError(
                "Failed to fetch recommendations. Please ensure the Flask API is running on port 5000."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-purple-600 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">For You</h1>
                    <p className="text-lg">Personalized recommendations based on your preferences</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex space-x-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab("accommodation")}
                        className={`pb-3 px-4 font-semibold transition ${activeTab === "accommodation"
                            ? "border-b-2 border-purple-600 text-purple-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Accommodations
                    </button>
                    <button
                        onClick={() => setActiveTab("guide")}
                        className={`pb-3 px-4 font-semibold transition ${activeTab === "guide"
                            ? "border-b-2 border-purple-600 text-purple-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Guides
                    </button>
                </div>

                {/* Content */}
                <div className="mt-6">
                    {activeTab === "accommodation" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Filters Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                                    <h2 className="text-xl font-bold mb-4">Filters</h2>

                                    {/* Budget Range */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Budget Range (LKR)
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                value={filters.budget_min}
                                                onChange={(e) =>
                                                    setFilters({ ...filters, budget_min: Number(e.target.value) })
                                                }
                                                className="w-full px-3 py-2 border rounded-md"
                                                placeholder="Min"
                                            />
                                            <span>-</span>
                                            <input
                                                type="number"
                                                value={filters.budget_max}
                                                onChange={(e) =>
                                                    setFilters({ ...filters, budget_max: Number(e.target.value) })
                                                }
                                                className="w-full px-3 py-2 border rounded-md"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>

                                    {/* Group Size */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Group Size
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={filters.group_size}
                                            onChange={(e) =>
                                                setFilters({ ...filters, group_size: Number(e.target.value) })
                                            }
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                    </div>

                                    {/* Location City */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            District (Optional)
                                        </label>
                                        <select
                                            value={filters.district}
                                            onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md"
                                        >
                                            <option value="">Any District</option>
                                            {SRI_LANKA_DISTRICTS.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Location Province */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Province (Optional)
                                        </label>
                                        <select
                                            value={filters.province}
                                            onChange={(e) =>
                                                setFilters({ ...filters, province: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border rounded-md"
                                        >
                                            <option value="">Any Province</option>
                                            {SRI_LANKA_PROVINCES.map((province) => (
                                                <option key={province} value={province}>
                                                    {province}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Accommodation Type */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Accommodation Type
                                        </label>
                                        <select
                                            value={filters.accommodation_type}
                                            onChange={(e) =>
                                                setFilters({ ...filters, accommodation_type: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border rounded-md"
                                        >
                                            {ACCOMMODATION_TYPES.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Travel Style */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Travel Style
                                        </label>
                                        <div className="space-y-2">
                                            {TRAVEL_STYLES.map((style) => (
                                                <label key={style} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="travel_style"
                                                        value={style}
                                                        checked={filters.travel_style === style}
                                                        onChange={(e) =>
                                                            setFilters({ ...filters, travel_style: e.target.value })
                                                        }
                                                        className="mr-2"
                                                    />
                                                    <span className="capitalize">{style}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Amenities
                                        </label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {AMENITIES.map((amenity) => (
                                                <label key={amenity} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.required_amenities.includes(amenity)}
                                                        onChange={() => handleAmenityToggle(amenity)}
                                                        className="mr-2"
                                                    />
                                                    <span className="capitalize">{amenity.replace("_", " ")}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interests */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Interests
                                        </label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {INTERESTS.map((interest) => (
                                                <label key={interest} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.interests.includes(interest)}
                                                        onChange={() => handleInterestToggle(interest)}
                                                        className="mr-2"
                                                    />
                                                    <span className="capitalize">{interest.replace("_", " ")}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Get Recommendations Button */}
                                    <button
                                        onClick={handleGetRecommendations}
                                        disabled={loading}
                                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={20} />
                                                Loading...
                                            </>
                                        ) : (
                                            "Get Recommendations"
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="lg:col-span-3">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                        {error}
                                    </div>
                                )}

                                {recommendations.length > 0 && (
                                    <div className="mb-4 text-gray-600">
                                        Showing {recommendations.length} of {totalCandidates} matching accommodations
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {recommendations.map((rec) => (
                                        <div key={rec.id} className="bg-white p-6 rounded-lg shadow-md">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{rec.name}</h3>
                                                    <p className="text-gray-600">
                                                        {rec.location}, {rec.province}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {rec.price_range_min.toLocaleString()} -{" "}
                                                        {rec.price_range_max.toLocaleString()} LKR
                                                    </div>
                                                    {rec.rating && (
                                                        <div className="text-yellow-500">★ {rec.rating.toFixed(1)}/5.0</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <span className="text-sm text-gray-500">Match Score: </span>
                                                <span className="text-sm font-semibold text-purple-600">
                                                    {(rec.score * 100).toFixed(1)}%
                                                </span>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Why recommended:</p>
                                                <ul className="list-disc list-inside text-sm text-gray-600">
                                                    {rec.reasons.map((reason, idx) => (
                                                        <li key={idx}>{reason}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {rec.in_system ? (
                                                    <a
                                                        href={`/accommodations/${rec.id}`}
                                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                                                    >
                                                        Book Now
                                                    </a>
                                                ) : (
                                                    <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
                                                        Not Registered in System
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!loading && recommendations.length === 0 && !error && (
                                    <div className="text-center py-12 text-gray-500">
                                        <p className="text-lg">Set your preferences and click "Get Recommendations"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-500">Guide recommendations coming soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
