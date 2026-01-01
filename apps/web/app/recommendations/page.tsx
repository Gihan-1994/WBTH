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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent drop-shadow-lg">For You</h1>
                    <p className="text-xl font-light">Personalized recommendations based on your preferences</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-md w-fit">
                    <button
                        onClick={() => {
                            setActiveTab("accommodation");
                            setRecommendations([]);
                            setError(null);
                        }}
                        className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${activeTab === "accommodation"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
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
                        className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${activeTab === "guide"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
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
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>

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
                                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                                    placeholder="Min"
                                                />
                                                <span>-</span>
                                                <input
                                                    type="number"
                                                    value={accommodationFilters.budget_max}
                                                    onChange={(e) =>
                                                        setAccommodationFilters({ ...accommodationFilters, budget_max: Number(e.target.value) })
                                                    }
                                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
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
                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
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
                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
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
                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
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
                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
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
                                                    <label
                                                        key={style}
                                                        className={`flex items-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${accommodationFilters.travel_style === style
                                                                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200'
                                                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="travel_style"
                                                            value={style}
                                                            checked={accommodationFilters.travel_style === style}
                                                            onChange={(e) =>
                                                                setAccommodationFilters({ ...accommodationFilters, travel_style: e.target.value })
                                                            }
                                                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                                                        />
                                                        <span className={`ml-3 capitalize font-medium ${accommodationFilters.travel_style === style ? 'text-purple-700' : 'text-gray-700'
                                                            }`}>{style}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Amenities */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Preferred Amenities
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                                {AMENITIES.map((amenity) => (
                                                    <label
                                                        key={amenity}
                                                        className={`flex items-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${accommodationFilters.required_amenities.includes(amenity)
                                                                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200'
                                                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={accommodationFilters.required_amenities.includes(amenity)}
                                                            onChange={() => handleAmenityToggle(amenity)}
                                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                        />
                                                        <span className={`ml-3 capitalize font-medium ${accommodationFilters.required_amenities.includes(amenity) ? 'text-purple-700' : 'text-gray-700'
                                                            }`}>{amenity.replace("_", " ")}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Interests */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Interests
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                                {INTERESTS.map((interest) => (
                                                    <label
                                                        key={interest}
                                                        className={`flex items-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${accommodationFilters.interests.includes(interest)
                                                                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200'
                                                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={accommodationFilters.interests.includes(interest)}
                                                            onChange={() => handleInterestToggle(interest)}
                                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                        />
                                                        <span className={`ml-3 capitalize font-medium ${accommodationFilters.interests.includes(interest) ? 'text-purple-700' : 'text-gray-700'
                                                            }`}>{interest.replace("_", " ")}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Get Recommendations Button */}
                                        <button
                                            onClick={handleGetAccommodationRecommendations}
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
                                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
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
                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                                {LANGUAGES.map((language) => (
                                                    <label
                                                        key={language}
                                                        className={`flex items-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${guideFilters.languages.includes(language)
                                                                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200'
                                                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={guideFilters.languages.includes(language)}
                                                            onChange={() => handleLanguageToggle(language)}
                                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                        />
                                                        <span className={`ml-3 font-medium ${guideFilters.languages.includes(language) ? 'text-purple-700' : 'text-gray-700'
                                                            }`}>{language}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {guideFilters.languages.length === 0 && (
                                                <p className="text-xs text-red-500 mt-2 px-2">Select at least one language</p>
                                            )}
                                        </div>

                                        {/* Expertise (Optional) */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expertise (Optional)
                                            </label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                                {EXPERTISE.map((exp) => (
                                                    <label
                                                        key={exp}
                                                        className={`flex items-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${guideFilters.expertise.includes(exp)
                                                                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200'
                                                                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={guideFilters.expertise.includes(exp)}
                                                            onChange={() => handleExpertiseToggle(exp)}
                                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                        />
                                                        <span className={`ml-3 font-medium ${guideFilters.expertise.includes(exp) ? 'text-purple-700' : 'text-gray-700'
                                                            }`}>{exp}</span>
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
                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
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
                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
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
                                                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
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
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
                                <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        {error}
                                    </div>
                                </div>
                            )}

                            {recommendations.length > 0 && (
                                <div className="mb-6 text-gray-700 font-medium bg-white px-6 py-3 rounded-xl shadow-md border border-gray-100">
                                    Showing <span className="text-purple-600 font-bold">{recommendations.length}</span> of <span className="font-bold">{totalCandidates}</span> matching {activeTab === "accommodation" ? "accommodations" : "guides"}
                                </div>
                            )}

                            <div className="space-y-6">
                                {recommendations.map((rec) => (
                                    <div key={rec.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-[1.01]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{rec.name}</h3>
                                                <p className="text-gray-600 flex items-center gap-1">
                                                    <span className="text-purple-600">📍</span>
                                                    {rec.city || rec.district || rec.location}, {rec.province}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {activeTab === "accommodation" && rec.price_range_min && rec.price_range_max ? (
                                                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                        {rec.price_range_min.toLocaleString()} -{" "}
                                                        {rec.price_range_max.toLocaleString()} LKR
                                                    </div>
                                                ) : activeTab === "guide" && rec.price ? (
                                                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                        {rec.price.toLocaleString()} LKR/day
                                                    </div>
                                                ) : null}
                                                {rec.rating && (
                                                    <div className="text-yellow-500 font-semibold mt-1">★ {rec.rating.toFixed(1)}/5.0</div>
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

                                        <div className="mb-4 inline-block">
                                            <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full border border-purple-200">
                                                <span className="text-sm text-gray-700 font-medium">Match Score: </span>
                                                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                                    {(rec.score * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <p className="text-sm font-bold text-gray-800 mb-2">Why recommended:</p>
                                            <ul className="space-y-1 text-sm text-gray-700">
                                                {rec.reasons.map((reason, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="text-purple-600 mt-0.5">•</span>
                                                        <span>{reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            {rec.in_system ? (
                                                <a
                                                    href={activeTab === "accommodation" ? `/accommodations/${rec.id}` : `/guides/${rec.id}`}
                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                                                >
                                                    Book Now
                                                </a>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200">
                                                    Not Registered in System
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!loading && recommendations.length === 0 && !error && (
                                <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-xl text-gray-600 font-medium">Set your preferences and click "Get Recommendations"</p>
                                    <p className="text-gray-500 mt-2">We'll find the perfect matches for you!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
