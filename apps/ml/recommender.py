"""
Accommodation Recommendation Engine
Implements hybrid rule-based filtering + weighted scoring algorithm
as specified in architecture spec section 4.1
"""

import json
import math
from typing import List, Dict, Optional, Set
import numpy as np


class AccommodationRecommender:
    """
    Hybrid recommendation system for accommodations.
    
    Algorithm:
    1. Hard rule filters (availability, budget, amenities, location, group size)
    2. Weighted scoring (interests, style, price, amenities, location, group, rating, popularity)
    3. Ranking and reason generation
    """
    
    # Default weights as per spec: [interests, style, price, amenities, location, group, rating, popularity]
    DEFAULT_WEIGHTS = [0.2, 0.05, 0.10, 0.15, 0.15, 0.10, 0.20, 0.05]
    
    def __init__(self, accommodations: List[Dict], weights: Optional[List[float]] = None):
        """
        Initialize recommender with accommodation data.
        
        Args:
            accommodations: List of accommodation dictionaries
            weights: Custom weights for scoring (optional, uses defaults if not provided)
        """
        self.accommodations = accommodations
        self.weights = weights if weights is not None else self.DEFAULT_WEIGHTS
        
        # Validate weights
        if len(self.weights) != 8:
            raise ValueError("Weights must have exactly 8 values")
        if not math.isclose(sum(self.weights), 1.0, rel_tol=0.01):
            print(f"Warning: Weights sum to {sum(self.weights):.2f}, not 1.0")
    
    def recommend(
        self,
        budget_min: float,
        budget_max: float,
        required_amenities: List[str],
        interests: List[str],
        travel_style: str,
        group_size: int,
        location_city: Optional[str] = None,
        location_province: Optional[str] = None,
        city_only: bool = False,
        top_k: int = 10
    ) -> Dict:
        """
        Generate accommodation recommendations.
        
        Args:
            budget_min: Minimum budget (LKR)
            budget_max: Maximum budget (LKR)
            required_amenities: List of must-have amenities
            interests: List of interest tags
            travel_style: Preferred travel style
            group_size: Number of people
            location_city: Preferred city (optional)
            location_province: Preferred province (optional)
            city_only: If True, hard filter to city only (optional)
            top_k: Number of recommendations to return
        
        Returns:
            Dictionary with recommendations and metadata
        """
        # Apply hard rule filters
        candidates = self._apply_hard_filters(
            budget_min=budget_min,
            budget_max=budget_max,
            required_amenities=required_amenities,
            group_size=group_size,
            location_city=location_city if city_only else None
        )
        
        if not candidates:
            return {
                "recommendations": [],
                "total_candidates": 0,
                "filters_applied": self._get_filters_applied(
                    budget_min, budget_max, required_amenities, group_size, location_city, city_only
                ),
                "message": "No accommodations match your criteria"
            }
        
        # Score and rank candidates
        scored_candidates = []
        for acc in candidates:
            score, score_components = self._calculate_score(
                accommodation=acc,
                budget_min=budget_min,
                budget_max=budget_max,
                interests=interests,
                travel_style=travel_style,
                required_amenities=required_amenities,
                group_size=group_size,
                location_city=location_city,
                location_province=location_province,
                candidates=candidates
            )
            
            scored_candidates.append({
                "accommodation": acc,
                "score": score,
                "score_components": score_components
            })
        
        # Sort by score (descending), then rating, then prior_bookings
        scored_candidates.sort(
            key=lambda x: (
                x["score"],
                x["accommodation"].get("rating", 0),
                x["accommodation"].get("prior_bookings", 0)
            ),
            reverse=True
        )
        
        # Generate top-k recommendations with reasons
        recommendations = []
        for item in scored_candidates[:top_k]:
            acc = item["accommodation"]
            reasons = self._generate_reasons(item["score_components"], acc)
            
            recommendations.append({
                "id": acc["id"],
                "name": acc["name"],
                "location": acc["location"],
                "province": acc["province"],
                "price_range_min": acc["price_range_min"],
                "price_range_max": acc["price_range_max"],
                "rating": acc.get("rating"),
                "score": round(item["score"], 3),
                "reasons": reasons
            })
        
        return {
            "recommendations": recommendations,
            "total_candidates": len(candidates),
            "filters_applied": self._get_filters_applied(
                budget_min, budget_max, required_amenities, group_size, location_city, city_only
            ),
        }
    
    def _apply_hard_filters(
        self,
        budget_min: float,
        budget_max: float,
        required_amenities: List[str],
        group_size: int,
        location_city: Optional[str] = None
    ) -> List[Dict]:
        """Apply hard rule filters to accommodations."""
        filtered = []
        
        for acc in self.accommodations:
            # 1. Availability filter
            if not acc.get("availability", True):
                continue
            
            # 2. Budget window filter (price ranges intersect)
            acc_min = acc.get("price_range_min", 0)
            acc_max = acc.get("price_range_max", float('inf'))
            if not (acc_min <= budget_max and acc_max >= budget_min):
                continue
            
            # 3. Required amenities filter (all must be present)
            acc_amenities = set(acc.get("amenities", []))
            if not set(required_amenities).issubset(acc_amenities):
                continue
            
            # 4. Location filter (if city_only is True)
            if location_city and acc.get("location") != location_city:
                continue
            
            # 5. Group size filter
            if acc.get("group_size", 0) < group_size:
                continue
            
            filtered.append(acc)
        
        return filtered
    
    def _calculate_score(
        self,
        accommodation: Dict,
        budget_min: float,
        budget_max: float,
        interests: List[str],
        travel_style: str,
        required_amenities: List[str],
        group_size: int,
        location_city: Optional[str],
        location_province: Optional[str],
        candidates: List[Dict]
    ) -> tuple[float, Dict[str, float]]:
        """Calculate weighted score for an accommodation."""
        
        # S_interests: Jaccard similarity on interests
        s_interests = self._jaccard_similarity(
            set(interests),
            set(accommodation.get("interests", []))
        )
        
        # S_style: Binary match on travel_style
        s_style = 1.0 if travel_style in accommodation.get("travel_style", []) else 0.0
        
        # S_price: Price alignment score
        s_price = self._price_alignment_score(
            budget_min, budget_max,
            accommodation.get("price_range_min", 0),
            accommodation.get("price_range_max", 0)
        )
        
        # S_amenities: Jaccard similarity on all amenities (not just required)
        user_desired_amenities = set(required_amenities + ["wifi", "pool", "parking"])  # Common desires
        s_amenities = self._jaccard_similarity(
            user_desired_amenities,
            set(accommodation.get("amenities", []))
        )
        
        # S_location: Tiered location score
        s_location = self._location_score(
            accommodation.get("location"),
            accommodation.get("province"),
            location_city,
            location_province
        )
        
        # S_group: Binary fit check (already filtered, but score for transparency)
        s_group = 1.0 if accommodation.get("group_size", 0) >= group_size else 0.0
        
        # S_rating: Normalized rating
        rating = accommodation.get("rating", 0)
        s_rating = min(1.0, rating / 5.0) if rating else 0.5
        
        # S_popularity: Log-scaled prior bookings
        s_popularity = self._popularity_score(
            accommodation.get("prior_bookings", 0),
            candidates
        )
        
        # Calculate weighted total
        components = {
            "interests": s_interests,
            "style": s_style,
            "price": s_price,
            "amenities": s_amenities,
            "location": s_location,
            "group": s_group,
            "rating": s_rating,
            "popularity": s_popularity
        }
        
        score = sum(
            w * components[k] 
            for w, k in zip(self.weights, components.keys())
        )
        
        return score, components
    
    def _jaccard_similarity(self, set1: Set, set2: Set) -> float:
        """Calculate Jaccard similarity between two sets."""
        if not set1 and not set2:
            return 0.0
        if not set1 or not set2:
            return 0.0
        
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        
        return intersection / union if union > 0 else 0.0
    
    def _price_alignment_score(
        self, user_min: float, user_max: float, acc_min: float, acc_max: float
    ) -> float:
        """
        Calculate price alignment score with distance penalty.
        1.0 if ranges overlap well, decreases with distance.
        """
        # Calculate overlap
        overlap_min = max(user_min, acc_min)
        overlap_max = min(user_max, acc_max)
        
        if overlap_max >= overlap_min:
            # Ranges overlap
            overlap = overlap_max - overlap_min
            user_range = user_max - user_min
            return min(1.0, overlap / user_range) if user_range > 0 else 1.0
        else:
            # No overlap - apply distance penalty
            if acc_max < user_min:
                # Accommodation is cheaper
                distance = user_min - acc_max
            else:
                # Accommodation is more expensive
                distance = acc_min - user_max
            
            # Penalty proportional to distance
            penalty_factor = 0.001  # Adjust sensitivity
            return max(0.0, 1.0 - distance * penalty_factor)
    
    def _location_score(
        self,
        acc_city: Optional[str],
        acc_province: Optional[str],
        user_city: Optional[str],
        user_province: Optional[str]
    ) -> float:
        """Calculate tiered location score."""
        if not user_city and not user_province:
            # No location preference
            return 0.5
        
        if user_city and acc_city == user_city:
            # Within selected city
            return 1.0
        
        if user_province and acc_province == user_province:
            # Within selected province
            return 0.6
        
        # Outside province
        return 0.15
    
    def _popularity_score(self, prior_bookings: int, candidates: List[Dict]) -> float:
        """Calculate log-scaled popularity score."""
        # Get max prior_bookings from candidates
        max_bookings = max((acc.get("prior_bookings", 0) for acc in candidates), default=1)
        
        if max_bookings == 0:
            return 0.0
        
        # Log scale
        score = math.log(1 + prior_bookings) / math.log(1 + max_bookings)
        return score
    
    def _generate_reasons(self, score_components: Dict[str, float], accommodation: Dict) -> List[str]:
        """Generate top 3 reasons for recommendation."""
        # Sort components by score contribution (score * weight)
        weighted_components = [
            (k, score_components[k] * w) 
            for k, w in zip(score_components.keys(), self.weights)
        ]
        weighted_components.sort(key=lambda x: x[1], reverse=True)
        
        reasons = []
        
        for component, _ in weighted_components[:3]:
            if component == "location":
                if score_components["location"] >= 0.9:
                    reasons.append(f"Within {accommodation.get('location', 'selected city')}")
                elif score_components["location"] >= 0.5:
                    reasons.append(f"Within {accommodation.get('province', 'selected province')}")
            
            elif component == "interests":
                if score_components["interests"] > 0.3:
                    interests = accommodation.get("interests", [])[:2]
                    if interests:
                        reasons.append(f"Matches {' & '.join(interests)}")
            
            elif component == "amenities":
                if score_components["amenities"] > 0.5:
                    top_amenities = accommodation.get("amenities", [])[:3]
                    if top_amenities:
                        reasons.append(f"Has {', '.join(top_amenities)}")
            
            elif component == "rating":
                rating = accommodation.get("rating", 0)
                if rating >= 4.5:
                    reasons.append(f"Excellent rating ({rating:.1f}/5.0)")
                elif rating >= 4.0:
                    reasons.append(f"High rating ({rating:.1f}/5.0)")
            
            elif component == "style":
                if score_components["style"] > 0:
                    styles = accommodation.get("travel_style", [])
                    if styles:
                        reasons.append(f"{styles[0].replace('_', ' ').title()} style")
            
            elif component == "popularity":
                if score_components["popularity"] > 0.7:
                    reasons.append("Popular choice")
            
            elif component == "price":
                if score_components["price"] > 0.8:
                    reasons.append("Within budget")
        
        # Ensure we have at least 1 reason
        if not reasons:
            reasons.append(f"Located in {accommodation.get('location', 'your area')}")
        
        return reasons[:3]
    
    def _get_filters_applied(
        self,
        budget_min: float,
        budget_max: float,
        required_amenities: List[str],
        group_size: int,
        location_city: Optional[str],
        city_only: bool
    ) -> List[str]:
        """Generate list of applied filters."""
        filters = []
        filters.append(f"Budget: {budget_min:.0f}-{budget_max:.0f} LKR")
        filters.append(f"Group size: {group_size}")
        
        if required_amenities:
            filters.append(f"Amenities: {', '.join(required_amenities)}")
        
        if city_only and location_city:
            filters.append(f"Location: {location_city} only")
        elif location_city:
            filters.append(f"Preferred location: {location_city}")
        
        filters.append("Availability: Available")
        
        return filters


def load_accommodations(filename: str = "mock_accommodations.json") -> List[Dict]:
    """Load accommodations from JSON file."""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)


if __name__ == "__main__":
    print("=== Accommodation Recommendation Engine ===\n")
    
    # Load mock data
    print("Loading accommodation data...")
    accommodations = load_accommodations()
    print(f"✓ Loaded {len(accommodations)} accommodations\n")
    
    # Initialize recommender
    recommender = AccommodationRecommender(accommodations)
    
    # Test scenarios
    test_scenarios = [
        {
            "name": "Luxury Beach Vacation",
            "budget_min": 10000,
            "budget_max": 25000,
            "required_amenities": ["wifi", "pool"],
            "interests": ["coastal", "luxury", "romantic"],
            "travel_style": "luxury",
            "group_size": 2,
            "location_city": "Galle",
            "location_province": "Southern",
            "city_only": False,
            "top_k": 5
        },
        {
            "name": "Budget Cultural Trip",
            "budget_min": 1000,
            "budget_max": 3000,
            "required_amenities": ["wifi"],
            "interests": ["cultural", "historical", "budget_friendly"],
            "travel_style": "budget",
            "group_size": 1,
            "location_province": "Central",
            "city_only": False,
            "top_k": 5
        },
        {
            "name": "Family Adventure",
            "budget_min": 5000,
            "budget_max": 12000,
            "required_amenities": ["wifi", "parking", "restaurant"],
            "interests": ["family_friendly", "adventure", "wildlife"],
            "travel_style": "family",
            "group_size": 4,
            "location_province": "Central",
            "city_only": False,
            "top_k": 5
        }
    ]
    
    for scenario in test_scenarios:
        print(f"\n{'='*60}")
        print(f"Scenario: {scenario['name']}")
        print(f"{'='*60}")
        
        results = recommender.recommend(**{k: v for k, v in scenario.items() if k != "name"})
        
        print(f"\nFilters applied:")
        for filter_desc in results["filters_applied"]:
            print(f"  • {filter_desc}")
        
        print(f"\nFound {results['total_candidates']} matching accommodations")
        print(f"\nTop {len(results['recommendations'])} recommendations:")
        
        for i, rec in enumerate(results["recommendations"], 1):
            print(f"\n{i}. {rec['name']}")
            print(f"   Location: {rec['location']}, {rec['province']}")
            print(f"   Price: {rec['price_range_min']:.0f}-{rec['price_range_max']:.0f} LKR")
            print(f"   Rating: {rec['rating']:.1f}/5.0" if rec['rating'] else "   Rating: N/A")
            print(f"   Score: {rec['score']:.3f}")
            print(f"   Reasons:")
            for reason in rec['reasons']:
                print(f"     - {reason}")
    
    print(f"\n{'='*60}")
    print("✓ Recommendation engine test complete!")
