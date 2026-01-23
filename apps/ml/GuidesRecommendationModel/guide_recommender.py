"""
Guide Recommendation Engine
Implements point-additive scoring algorithm for guide matching
as specified in architecture spec section 4.2
"""

import json
import math
from typing import List, Dict, Optional, Set


class GuideRecommender:
    """
    Point-additive recommendation system for guides.
    
    Algorithm:
    1. Hard rule filters (language, location, price, availability)
    2. Point-additive scoring (location, languages, expertise, gender, popularity, rating, price, experience, db_priority)
    3. Normalization to [0,1] range
    4. Ranking and reason generation
    """
    
    import re
    
    def __init__(self, guides: List[Dict]):
        """
        Initialize recommender with guide data.
        
        Args:
            guides: List of guide dictionaries
        """
        self.guides = guides
    
    def recommend(
        self,
        budget_min: float,
        budget_max: float,
        languages: List[str],
        expertise: List[str] = None,
        city: Optional[str] = None,
        province: Optional[str] = None,
        city_only: bool = False,
        gender_preference: Optional[str] = None,
        top_k: int = 10
    ) -> Dict:
        """
        Generate guide recommendations.
        
        Args:
            budget_min: Minimum budget (LKR per day)
            budget_max: Maximum budget (LKR per day)
            languages: List of required languages (at least one must match)
            expertise: List of desired expertise areas (optional)
            city: Preferred city (optional)
            province: Preferred province (optional)
            city_only: If True, hard filter to city only
            gender_preference: Preferred gender (male/female, optional)
            top_k: Number of recommendations to return
        
        Returns:
            Dictionary with recommendations and metadata
        """
        expertise = expertise or []
        
        # Apply hard rule filters
        candidates = self._apply_hard_filters(
            budget_min=budget_min,
            budget_max=budget_max,
            languages=languages,
            city=city if city_only else None,
            gender_preference=gender_preference
        )
        
        if not candidates:
            return {
                "recommendations": [],
                "total_candidates": 0,
                "filters_applied": self._get_filters_applied(
                    budget_min, budget_max, languages, expertise, city, city_only, gender_preference
                ),
                "message": "No guides match your criteria"
            }
        
        # Calculate max attainable points for normalization
        max_points = self._calculate_max_points(languages, expertise, gender_preference)
        
        # Score and rank candidates
        scored_candidates = []
        for guide in candidates:
            score, score_components = self._calculate_score(
                guide=guide,
                languages=languages,
                expertise=expertise,
                city=city,
                province=province,
                gender_preference=gender_preference,
                candidates=candidates,
                max_points=max_points,
                budget_min=budget_min,
                budget_max=budget_max
            )
            
            scored_candidates.append({
                "guide": guide,
                "score": score,
                "score_components": score_components
            })
        
        # Sort by score (descending), then rating, then prior_bookings
        scored_candidates.sort(
            key=lambda x: (
                x["score"],
                x["guide"].get("rating", 0),
                x["guide"].get("prior_bookings", 0)
            ),
            reverse=True
        )
        
        # Generate top-k recommendations with reasons
        recommendations = []
        for item in scored_candidates[:top_k]:
            guide = item["guide"]
            reasons = self._generate_reasons(
                item["score_components"],
                guide,
                user_languages=languages,
                user_expertise=expertise
            )
            
            recommendations.append({
                "id": guide["id"],
                "name": guide["name"],
                "city": guide.get("city"),
                "province": guide.get("province"),
                "price": guide.get("price"),
                "rating": guide.get("rating"),
                "languages": guide.get("languages", []),
                "expertise": guide.get("expertise", []),
                "score": round(item["score"], 3),
                "reasons": reasons,
                "in_system": guide.get("in_system", False)
            })
        
        return {
            "recommendations": recommendations,
            "total_candidates": len(candidates),
            "filters_applied": self._get_filters_applied(
                budget_min, budget_max, languages, expertise, city, city_only, gender_preference
            ),
        }
    
    def _apply_hard_filters(
        self,
        budget_min: float,
        budget_max: float,
        languages: List[str],
        city: Optional[str] = None,
        gender_preference: Optional[str] = None
    ) -> List[Dict]:
        """Apply hard rule filters to guides."""
        filtered = []
        
        for guide in self.guides:
            # 1. Availability filter
            if not guide.get("availability", True):
                continue
            
            # 2. Language filter: must have at least one requested language
            guide_languages = [lang.lower() for lang in guide.get("languages", [])]
            user_languages = [lang.lower() for lang in languages]
            
            if not any(lang in guide_languages for lang in user_languages):
                continue
            
            # 3. Price filter (within budget)
            guide_price = guide.get("price", 0) or 0  # Handle None and 0
            if not (budget_min <= guide_price <= budget_max):
                continue
            
            # 4. Location filter (if city_only is True) - case-insensitive
            if city:
                guide_city = guide.get("city", "")
                if guide_city.lower() != city.lower():
                    continue
            
            # 5. Gender preference filter (optional)
            if gender_preference:
                guide_gender = guide.get("gender", "")
                if guide_gender.lower() != gender_preference.lower():
                    continue
            
            filtered.append(guide)
        
        return filtered
    
    def _calculate_max_points(
        self,
        languages: List[str],
        expertise: List[str],
        gender_preference: Optional[str]
    ) -> int:
        """Calculate maximum attainable points for normalization."""
        max_points = 0
        
        # Location tier: max +3
        max_points += 3
        
        # Languages: +3 per match (capped at requested count)
        max_points += 3 * len(languages)
        
        # Expertise: +3 for any overlap + up to +5 total
        if expertise:
            max_points += 5
        
        # Gender: +1 if preference provided
        if gender_preference:
            max_points += 1
        
        # Popularity: max +2
        max_points += 2
        
        # Rating: max +3
        max_points += 3
        
        # Price: max +5 (3 points for range + 2 bonus)
        max_points += 5
        
        # Experience: max +5
        max_points += 5
        
        # DB Priority: +5
        max_points += 5
        
        return max_points
    
    def _calculate_score(
        self,
        guide: Dict,
        languages: List[str],
        expertise: List[str],
        city: Optional[str],
        province: Optional[str],
        gender_preference: Optional[str],
        candidates: List[Dict],
        max_points: int,
        budget_min: float,
        budget_max: float
    ) -> tuple[float, Dict[str, any]]:
        """Calculate point-additive score for a guide."""
        
        points = 0
        components = {}
        
        # Location tier score
        location_points = self._location_score(
            guide.get("city"),
            guide.get("province"),
            city,
            province
        )
        points += location_points
        components["location"] = location_points
        
        # Language match score
        language_points = self._language_score(
            guide.get("languages", []),
            languages
        )
        points += language_points
        components["languages"] = language_points
        
        # Expertise match score
        expertise_points = self._expertise_score(
            guide.get("expertise", []),
            expertise
        )
        points += expertise_points
        components["expertise"] = expertise_points
        
        # Gender match score
        gender_points = 0
        if gender_preference:
            if guide.get("gender", "").lower() == gender_preference.lower():
                gender_points = 1
        points += gender_points
        components["gender"] = gender_points
        
        # Popularity score
        popularity_points = self._popularity_score(
            guide.get("prior_bookings", 0),
            candidates
        )
        points += popularity_points
        components["popularity"] = popularity_points
        
        # Rating score (up to +3)
        rating = guide.get("rating", 0)
        rating_points = (rating / 5.0) * 3 if rating else 0
        points += rating_points
        components["rating"] = rating_points
        
        # Price score (up to +5)
        price_points = self._price_score(
            guide.get("price", 0),
            budget_min,
            budget_max
        )
        points += price_points
        components["price"] = price_points
        
        # Experience score (up to +5)
        experience_points = self._experience_score(guide.get("experience", []))
        points += experience_points
        components["experience"] = experience_points
        
        # DB priority score (+5 for guides in system)
        db_priority_points = 5 if guide.get("in_system", False) else 0
        points += db_priority_points
        components["db_priority"] = db_priority_points
        
        # Normalize to [0, 1] range
        normalized_score = points / max_points if max_points > 0 else 0
        
        components["raw_points"] = points
        components["max_points"] = max_points
        
        return normalized_score, components
    
    def _location_score(
        self,
        guide_city: Optional[str],
        guide_province: Optional[str],
        user_city: Optional[str],
        user_province: Optional[str]
    ) -> int:
        """
        Calculate tiered location score (points, not normalized).
        +3 if within selected city
        +2 if within selected province
        +0 if outside province or no preference
        """
        if not user_city and not user_province:
            # No location preference
            return 0
        
        if user_city and guide_city:
            if guide_city.lower() == user_city.lower():
                return 3
        
        if user_province and guide_province:
            if guide_province.lower() == user_province.lower():
                return 2
        
        return 0
    
    def _language_score(self, guide_languages: List[str], user_languages: List[str]) -> int:
        """
        Calculate language match score.
        +3 points per exact match (capped at number of requested languages)
        """
        guide_langs = set(lang.lower() for lang in guide_languages)
        user_langs = set(lang.lower() for lang in user_languages)
        
        matches = len(guide_langs & user_langs)
        # Cap at requested count
        matches = min(matches, len(user_languages))
        
        return matches * 3
    
    def _expertise_score(self, guide_expertise: List[str], user_expertise: List[str]) -> int:
        """
        Calculate expertise match score.
        +3 for any overlap
        +1 per additional overlap, up to +5 total
        """
        if not user_expertise:
            return 0
        
        guide_exp = set(exp.lower() for exp in guide_expertise)
        user_exp = set(exp.lower() for exp in user_expertise)
        
        matches = len(guide_exp & user_exp)
        
        if matches == 0:
            return 0
        
        # +3 for first match, +1 for each additional, max +5
        points = 3 + min(matches - 1, 2)
        return points

    def _price_score(self, price: float, budget_min: float, budget_max: float) -> int:
        """
        Calculate dynamic price score for a guide.
        +3 points max based on position in budget (lower is better)
        +2 points affordability bonus if in lower 25% of budget
        """
        if not price or budget_max <= budget_min:
            return 2  # Default
            
        # 1. Base score (out of 3)
        # 3 if at budget_min, 1 if at budget_max
        ratio = (price - budget_min) / (budget_max - budget_min)
        base_score = 3 - (ratio * 2)
        
        # 2. Affordability bonus
        bonus = 0
        if price <= budget_min + (budget_max - budget_min) * 0.25:
            bonus = 2
            
        return int(base_score + bonus)

    def _experience_score(self, experience_list: List[str]) -> int:
        """
        Calculate experience score based on years found in experience string array.
        Award points based on years: 10+ (5 pts), 5-10 (4 pts), 3-5 (3 pts), <3 (2 pts).
        Default: 2 points.
        """
        import re
        
        max_years = 0
        found = False
        
        for item in experience_list:
            # Look for patterns like "5 years", "12 year", "10+ years"
            matches = re.findall(r'(\d+)\s*year', item.lower())
            if matches:
                found = True
                years = [int(m) for m in matches]
                max_years = max(max_years, max(years))
        
        if not found:
            return 2  # Default
            
        if max_years >= 10:
            return 5
        elif max_years >= 5:
            return 4
        elif max_years >= 3:
            return 3
        else:
            return 2
    
    def _popularity_score(self, prior_bookings: int, candidates: List[Dict]) -> int:
        """
        Calculate popularity score based on prior bookings.
        +1 if above median
        +2 if top quartile
        """
        bookings = [g.get("prior_bookings", 0) for g in candidates]
        
        if not bookings:
            return 0
        
        bookings_sorted = sorted(bookings)
        median_idx = len(bookings_sorted) // 2
        q3_idx = int(len(bookings_sorted) * 0.75)
        
        median = bookings_sorted[median_idx]
        q3 = bookings_sorted[q3_idx]
        
        if prior_bookings >= q3:
            return 2
        elif prior_bookings >= median:
            return 1
        else:
            return 0
    
    def _generate_reasons(
        self,
        score_components: Dict[str, any],
        guide: Dict,
        user_languages: List[str] = None,
        user_expertise: List[str] = None
    ) -> List[str]:
        """Generate comprehensive reasons for recommendation."""
        reasons = []
        user_languages = user_languages or []
        user_expertise = user_expertise or []
        
        # Location match
        if score_components["location"] >= 3:
            reasons.append(f"📍 Located in {guide.get('city', 'your selected city')}")
        elif score_components["location"] >= 2:
            reasons.append(f"📍 Located in {guide.get('province', 'your selected province')}")
        
        # Language match
        if user_languages:
            guide_langs = set(lang.lower() for lang in guide.get("languages", []))
            user_langs = set(lang.lower() for lang in user_languages)
            matching_langs = guide_langs & user_langs
            
            if matching_langs:
                lang_text = ", ".join(matching_langs)
                reasons.append(f"🗣️ Speaks: {lang_text.title()}")
        
        # Expertise match
        if user_expertise:
            guide_exp = set(exp.lower() for exp in guide.get("expertise", []))
            user_exp = set(exp.lower() for exp in user_expertise)
            matching_exp = guide_exp & user_exp
            
            if matching_exp:
                exp_text = ", ".join(matching_exp)
                reasons.append(f"🎯 Expert in: {exp_text.title()}")
        else:
            # Show guide expertise even if no user preference
            expertise = guide.get("expertise", [])
            if expertise:
                exp_text = ", ".join(expertise[:3])
                reasons.append(f"🎯 Specializes in: {exp_text}")
        
        # Rating
        rating = guide.get("rating") or 0
        if rating >= 4.0:
            reasons.append(f"⭐ {rating:.1f}/5.0 rating")
        
        # Popularity
        if score_components["popularity"] >= 2:
            reasons.append("🔥 Highly popular guide")
        elif score_components["popularity"] >= 1:
            reasons.append("👍 Popular choice")
        
        # Price
        price = guide.get("price", 0)
        if price:
            reasons.append(f"💰 {price:.0f} LKR per day")
        
        # Experience
        experience = guide.get("experience", [])
        if experience:
            reasons.append(f"📚 {experience[0]}")
        
        # Database availability
        if guide.get("in_system", False):
            reasons.append("✅ Available in our system")
        
        # Ensure we have at least 1 reason
        if not reasons:
            reasons.append(f"Professional guide in {guide.get('province', 'Sri Lanka')}")
        
        return reasons
    
    def _get_filters_applied(
        self,
        budget_min: float,
        budget_max: float,
        languages: List[str],
        expertise: List[str],
        city: Optional[str],
        city_only: bool,
        gender_preference: Optional[str]
    ) -> List[str]:
        """Generate list of applied filters."""
        filters = []
        filters.append(f"Budget: {budget_min:.0f}-{budget_max:.0f} LKR/day")
        
        if languages:
            filters.append(f"Languages: {', '.join(languages)}")
        
        if expertise:
            filters.append(f"Expertise: {', '.join(expertise)}")
        
        if city_only and city:
            filters.append(f"Location: {city} only")
        elif city:
            filters.append(f"Preferred location: {city}")
        
        if gender_preference:
            filters.append(f"Gender: {gender_preference.capitalize()}")
        
        filters.append("Availability: Available")
        
        return filters


def load_guides(filename: str = "../data/mock_guides.json") -> List[Dict]:
    """Load guides from JSON file."""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)


if __name__ == "__main__":
    print("=== Guide Recommendation Engine ===\n")
    
    # Load mock data
    print("Loading guide data...")
    guides = load_guides()
    print(f"✓ Loaded {len(guides)} guides\n")
    
    # Initialize recommender
    recommender = GuideRecommender(guides)
    
    # Test scenarios
    test_scenarios = [
        {
            "name": "Wildlife Safari (Eastern Province)",
            "budget_min": 5000,
            "budget_max": 15000,
            "languages": ["English"],
            "expertise": ["Wildlife", "Photography"],
            "province": "Eastern",
            "city_only": False,
            "top_k": 5
        },
        {
            "name": "Cultural Tour (Kandy)",
            "budget_min": 3000,
            "budget_max": 10000,
            "languages": ["English", "French"],
            "expertise": ["Cultural", "Historical"],
            "city": "Kandy",
            "province": "Central",
            "city_only": True,
            "top_k": 5
        },
        {
            "name": "Beach Activities (Arugam Bay)",
            "budget_min": 4000,
            "budget_max": 12000,
            "languages": ["English"],
            "expertise": ["Surfing", "Diving"],
            "city": "Arugam Bay",
            "province": "Eastern",
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
        
        print(f"\nFound {results['total_candidates']} matching guides")
        print(f"\nTop {len(results['recommendations'])} recommendations:")
        
        for i, rec in enumerate(results["recommendations"], 1):
            print(f"\n{i}. {rec['name']}")
            print(f"   Location: {rec['city']}, {rec['province']}")
            print(f"   Price: {rec['price']:.0f} LKR/day")
            print(f"   Rating: {rec['rating']:.1f}/5.0" if rec['rating'] else "   Rating: N/A")
            print(f"   Languages: {', '.join(rec['languages'])}")
            print(f"   Expertise: {', '.join(rec['expertise'][:3])}")
            print(f"   Score: {rec['score']:.3f}")
            print(f"   Reasons:")
            for reason in rec['reasons']:
                print(f"     - {reason}")
    
    print(f"\n{'='*60}")
    print("✓ Recommendation engine test complete!")
