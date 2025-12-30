"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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

interface AccommodationFilterState {
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

interface GuideFilterState {
    budget_min: number;
    budget_max: number;
    languages: string[];
    expertise: string[];
    city: string;
    province: string;
    city_only: boolean;
    gender_preference: string;
}

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000";

// Accommodation constants
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

// Guide constants
const LANGUAGES = [
    "English",
    "Sinhala",
    "Tamil",
    "French",
    "German",
    "Japanese",
    "Chinese",
    "Spanish",
    "Italian",
    "Russian",
];

const EXPERTISE = [
    "Wildlife",
    "Cultural",
    "Adventure",
    "Historical",
    "Photography",
    "Surfing",
    "Diving",
    "Hiking",
    "Tea Plantation",
    "Ayurveda",
    "Bird Watching",
    "Food Tours",
    "Religious Sites",
    "Beach Activities",
    "Nature Trails",
    "City Tours"
];

// Shared constants
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
    "Ella",
    "Arugam Bay",
    "Sigiriya",
    "Dambulla",
    "Mirissa",
    "Hikkaduwa",
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

    // Accommodation filters
    const [accommodationFilters, setAccommodationFilters] = useState<AccommodationFilterState>({
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

    // Guide filters
    const [guideFilters, setGuideFilters] = useState<GuideFilterState>({
        budget_min: 2000,
        budget_max: 20000,
        languages: ["English"],
        expertise: [],
        city: "",
        province: "",
        city_only: false,
        gender_preference: "",
    });

    const handleAmenityToggle = (amenity: string) => {
        setAccommodationFilters((prev) => ({
            ...prev,
            required_amenities: prev.required_amenities.includes(amenity)
                ? prev.required_amenities.filter((a) => a !== amenity)
                : [...prev.required_amenities, amenity],
        }));
    };

    const handleInterestToggle = (interest: string) => {
        setAccommodationFilters((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const handleLanguageToggle = (language: string) => {
        setGuideFilters((prev) => ({
            ...prev,
            languages: prev.languages.includes(language)
                ? prev.languages.filter((l) => l !== language)
                : [...prev.languages, language],
        }));
    };

    const handleExpertiseToggle = (expertise: string) => {
        setGuideFilters((prev) => ({
            ...prev,
            expertise: prev.expertise.includes(expertise)
                ? prev.expertise.filter((e) => e !== expertise)
                : [...prev.expertise, expertise],
        }));
    };

    const handleGetAccommodationRecommendations = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${FLASK_API_URL}/api/recommendations/accommodations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    budget_min: accommodationFilters.budget_min,
                    budget_max: accommodationFilters.budget_max,
                    required_amenities: accommodationFilters.required_amenities,
                    interests: accommodationFilters.interests,
                    travel_style: accommodationFilters.travel_style,
                    group_size: accommodationFilters.group_size,
                    accommodation_type: accommodationFilters.accommodation_type,
                    district: accommodationFilters.district || null,
                    province: accommodationFilters.province || null,
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

    const handleGetGuideRecommendations = async () => {
        setLoading(true);
        setError(null);

        try {
            if (guideFilters.languages.length === 0) {
                setError("Please select at least one language");
                setLoading(false);
                return;
            }

            const response = await fetch(`${FLASK_API_URL}/api/recommendations/guides`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    budget_min: guideFilters.budget_min,
                    budget_max: guideFilters.budget_max,
                    languages: guideFilters.languages,
                    expertise: guideFilters.expertise,
                    city: guideFilters.city || null,
                    province: guideFilters.province || null,
                    city_only: guideFilters.city_only,
                    gender_preference: guideFilters.gender_preference || null,
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
                setError(data.message || "No guides found. Try adjusting your filters.");
            }
        } catch (err) {
            console.error("Error fetching guide recommendations:", err);
            setError(
                "Failed to fetch guide recommendations. Please ensure the Flask API is running on port 5000."
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
                        onClick={() => {
                            setActiveTab("accommodation");
                            setRecommendations([]);
                            setError(null);
                        }}
                        className={`pb-3 px-4 font-semibold transition ${activeTab === "accommodation"
                            ? "border-b-2 border-purple-600 text-purple-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Accommodations
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("guide");
                            setRecommendations([]);
                            setError(null);
                        }}
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
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                                <h2 className="text-xl font-bold mb-4">Filters</h2>

                                {activeTab === "accommodation" ? (
                                    <>
                                        {/* Budget Range */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Budget Range (LKR)
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    value={accommodationFilters.budget_min}
                                                    onChange={(e) =>
                                                        setAccommodationFilters({ ...accommodationFilters, budget_min: Number(e.target.value) })
                                                    }
                                                    className="w-full px-3 py-2 border rounded-md"
                                                    placeholder="Min"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    value={accommodationFilters.budget_max}
                                                    onChange={(e) =>
                                                        setAccommodationFilters({ ...accommodationFilters, budget_max: Number(e.target.value) })
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
                                                value={accommodationFilters.group_size}
                                                onChange={(e) =>
                                                    setAccommodationFilters({ ...accommodationFilters, group_size: Number(e.target.value) })
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
                                                value={accommodationFilters.district}
                                                onChange={(e) => setAccommodationFilters({ ...accommodationFilters, district: e.target.value })}
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
                                                value={accommodationFilters.province}
                                                onChange={(e) =>
                                                    setAccommodationFilters({ ...accommodationFilters, province: e.target.value })
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
                                                value={accommodationFilters.accommodation_type}
                                                onChange={(e) =>
                                                    setAccommodationFilters({ ...accommodationFilters, accommodation_type: e.target.value })
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
                                                            checked={accommodationFilters.travel_style === style}
                                                            onChange={(e) =>
                                                                setAccommodationFilters({ ...accommodationFilters, travel_style: e.target.value })
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
                                                            checked={accommodationFilters.required_amenities.includes(amenity)}
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
                                                            checked={accommodationFilters.interests.includes(interest)}
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
                                            onClick={handleGetAccommodationRecommendations}
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
                                    </>
                                ) : (
                                    <>
                                        {/* Guide Filters */}
                                        {/* Budget Range */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Budget Range (LKR/day)
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    value={guideFilters.budget_min}
                                                    onChange={(e) =>
                                                        setGuideFilters({ ...guideFilters, budget_min: Number(e.target.value) })
                                                    }
                                                    className="w-full px-3 py-2 border rounded-md"
                                                    placeholder="Min"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    value={guideFilters.budget_max}
                                                    onChange={(e) =>
                                                        setGuideFilters({ ...guideFilters, budget_max: Number(e.target.value) })
                                                    }
                                                    className="w-full px-3 py-2 border rounded-md"
                                                    placeholder="Max"
                                                />
                                            </div>
                                        </div>

                                        {/* Languages (Required) */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Languages * (Required)
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {LANGUAGES.map((language) => (
                                                    <label key={language} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={guideFilters.languages.includes(language)}
                                                            onChange={() => handleLanguageToggle(language)}
                                                            className="mr-2"
                                                        />
                                                        <span>{language}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {guideFilters.languages.length === 0 && (
                                                <p className="text-xs text-red-500 mt-1">Select at least one language</p>
                                            )}
                                        </div>

                                        {/* Expertise (Optional) */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expertise (Optional)
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {EXPERTISE.map((exp) => (
                                                    <label key={exp} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={guideFilters.expertise.includes(exp)}
                                                            onChange={() => handleExpertiseToggle(exp)}
                                                            className="mr-2"
                                                        />
                                                        <span>{exp}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City (Optional)
                                            </label>
                                            <select
                                                value={guideFilters.city}
                                                onChange={(e) => setGuideFilters({ ...guideFilters, city: e.target.value })}
                                                className="w-full px-3 py-2 border rounded-md"
                                            >
                                                <option value="">Any City</option>
                                                {SRI_LANKA_DISTRICTS.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Province */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Province (Optional)
                                            </label>
                                            <select
                                                value={guideFilters.province}
                                                onChange={(e) =>
                                                    setGuideFilters({ ...guideFilters, province: e.target.value })
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

                                        {/* City Only Toggle */}
                                        {guideFilters.city && (
                                            <div className="mb-6">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={guideFilters.city_only}
                                                        onChange={(e) =>
                                                            setGuideFilters({ ...guideFilters, city_only: e.target.checked })
                                                        }
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">Search only in {guideFilters.city}</span>
                                                </label>
                                            </div>
                                        )}

                                        {/* Gender Preference */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Gender Preference (Optional)
                                            </label>
                                            <select
                                                value={guideFilters.gender_preference}
                                                onChange={(e) =>
                                                    setGuideFilters({ ...guideFilters, gender_preference: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border rounded-md"
                                            >
                                                <option value="">No Preference</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>

                                        {/* Get Recommendations Button */}
                                        <button
                                            onClick={handleGetGuideRecommendations}
                                            disabled={loading || guideFilters.languages.length === 0}
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
                                    </>
                                )}
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
                                    Showing {recommendations.length} of {totalCandidates} matching {activeTab === "accommodation" ? "accommodations" : "guides"}
                                </div>
                            )}

                            <div className="space-y-4">
                                {recommendations.map((rec) => (
                                    <div key={rec.id} className="bg-white p-6 rounded-lg shadow-md">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{rec.name}</h3>
                                                <p className="text-gray-600">
                                                    {rec.city || rec.district || rec.location}, {rec.province}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {activeTab === "accommodation" && rec.price_range_min && rec.price_range_max ? (
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {rec.price_range_min.toLocaleString()} -{" "}
                                                        {rec.price_range_max.toLocaleString()} LKR
                                                    </div>
                                                ) : activeTab === "guide" && rec.price ? (
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {rec.price.toLocaleString()} LKR/day
                                                    </div>
                                                ) : null}
                                                {rec.rating && (
                                                    <div className="text-yellow-500">★ {rec.rating.toFixed(1)}/5.0</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Guide specific info */}
                                        {activeTab === "guide" && (
                                            <div className="mb-3 text-sm">
                                                {rec.languages && rec.languages.length > 0 && (
                                                    <p className="text-gray-700 mb-1">
                                                        <span className="font-semibold">Languages:</span> {rec.languages.join(", ")}
                                                    </p>
                                                )}
                                                {rec.expertise && rec.expertise.length > 0 && (
                                                    <p className="text-gray-700">
                                                        <span className="font-semibold">Expertise:</span> {rec.expertise.slice(0, 5).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        )}

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
                                                    href={activeTab === "accommodation" ? `/accommodations/${rec.id}` : `/guides/${rec.id}`}
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
                </div>
            </div>
        </div>
    );
}
