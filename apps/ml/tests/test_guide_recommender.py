"""
Unit tests for guide recommendation engine.
Tests hard filters, scoring functions, and full recommendation pipeline.
"""

import sys
sys.path.append('..')

from GuidesRecommendationModel.guide_recommender import GuideRecommender


def test_hard_filters():
    """Test that hard filters work correctly."""
    # Mock guide data
    guides = [
        {
            "id": "1",
            "name": "Guide 1",
            "languages": ["English", "Sinhala"],
            "price": 5000,
            "city": "Kandy",
            "province": "Central",
            "availability": True,
            "rating": 4.5,
            "prior_bookings": 50
        },
        {
            "id": "2",
            "name": "Guide 2",
            "languages": ["French", "German"],
            "price": 15000,
            "city": "Galle",
            "province": "Southern",
            "availability": True,
            "rating": 4.8,
            "prior_bookings": 100
        },
        {
            "id": "3",
            "name": "Guide 3",
            "languages": ["English", "Tamil"],
            "price": 8000,
            "city": "Kandy",
            "province": "Central",
            "availability": False,  # Not available
            "rating": 4.2,
            "prior_bookings": 30
        }
    ]
    
    recommender = GuideRecommender(guides)
    
    # Test language filter
    results = recommender.recommend(
        budget_min=3000,
        budget_max=20000,
        languages=["English"],
        top_k=10
    )
    
    assert results["total_candidates"] == 1, "Should filter out unavailable and non-English guides"
    assert results["recommendations"][0]["id"] == "1"
    
    # Test price filter
    results = recommender.recommend(
        budget_min=3000,
        budget_max=6000,
        languages=["English", "French", "German"],
        top_k=10
    )
    
    assert results["total_candidates"] == 1, "Should filter out expensive guides"
    
    # Test city_only filter
    results = recommender.recommend(
        budget_min=3000,
        budget_max=20000,
        languages=["English", "French"],
        city="Kandy",
        city_only=True,
        top_k=10
    )
    
    assert results["total_candidates"] == 1, "Should filter to Kandy only"
    assert results["recommendations"][0]["city"] == "Kandy"
    
    print("✓ Hard filters tests passed")


def test_location_scoring():
    """Test location tier scoring."""
    guides = [
        {
            "id": "1",
            "name": "Guide in City",
            "languages": ["English"],
            "price": 5000,
            "city": "Kandy",
            "province": "Central",
            "availability": True,
            "expertise": [],
            "rating": 4.0,
            "prior_bookings": 50
        },
        {
            "id": "2",
            "name": "Guide in Province",
            "languages": ["English"],
            "price": 5000,
            "city": "Nuwara Eliya",
            "province": "Central",
            "availability": True,
            "expertise": [],
           "rating": 4.0,
            "prior_bookings": 50
        },
        {
            "id": "3",
            "name": "Guide Outside",
            "languages": ["English"],
            "price": 5000,
            "city": "Galle",
            "province": "Southern",
            "availability": True,
            "expertise": [],
            "rating": 4.0,
            "prior_bookings": 50
        }
    ]
    
    recommender = GuideRecommender(guides)
    
    results = recommender.recommend(
        budget_min=3000,
        budget_max=10000,
        languages=["English"],
        city="Kandy",
        province="Central",
        city_only=False,
        top_k=3
    )
    
    # City match should score highest
    assert results["recommendations"][0]["id"] == "1", "City match should rank first"
    
    print("✓ Location scoring tests passed")


def test_language_scoring():
    """Test language match scoring."""
    guides = [
        {
            "id": "1",
            "name": "Monolingual",
            "languages": ["English"],
            "price": 5000,
            "city": "Kandy",
            "province": "Central",
            "availability": True,
            "expertise": [],
            "rating": 4.0,
            "prior_bookings": 50
        },
        {
            "id": "2",
            "name": "Bilingual",
            "languages": ["English", "French"],
            "price": 5000,
            "city": "Kandy",
            "province": "Central",
            "availability": True,
            "expertise": [],
            "rating": 4.0,
            "prior_bookings": 50
        }
    ]
    
    recommender = GuideRecommender(guides)
    
    results = recommender.recommend(
        budget_min=3000,
        budget_max=10000,
        languages=["English", "French"],
        city_only=False,
        top_k=2
    )
    
    # Bilingual guide should score higher
    assert results["recommendations"][0]["id"] == "2", "More language matches should rank higher"
    
    print("✓ Language scoring tests passed")


def test_expertise_scoring():
    """Test expertise match scoring."""
    guides = [
        {
            "id": "1",
            "name": "Wildlife Expert",
            "languages": ["English"],
            "price": 5000,
            "city": "Kandy",
            "province": "Central",
            "availability": True,
            "expertise": ["Wildlife", "Photography"],
            "rating": 4.0,
            "prior_bookings": 50
        },
        {
            "id": "2",
            "name": "Cultural Expert",
            "languages": ["English"],
            "price": 5000,
            "city": "Kandy",
            "province": "Central",
            "availability": True,
            "expertise": ["Cultural", "Historical"],
            "rating": 4.0,
            "prior_bookings": 50
        }
    ]
    
    recommender = GuideRecommender(guides)
    
    results = recommender.recommend(
        budget_min=3000,
        budget_max=10000,
        languages=["English"],
        expertise=["Wildlife", "Photography"],
        city_only=False,
        top_k=2
    )
    
    # Wildlife expert should rank first
    assert results["recommendations"][0]["id"] == "1", "Expertise match should rank higher"
    
    print("✓ Expertise scoring tests passed")


def test_full_pipeline():
    """Test complete recommendation pipeline with realistic scenario."""
    # Load actual mock data
    from GuidesRecommendationModel.guide_recommender import load_guides
    import os
    
    # Resolve path dynamically
    current_dir = os.path.dirname(os.path.abspath(__file__))
    mock_data_path = os.path.join(current_dir, "..", "data", "mock_guides.json")
    
    guides = load_guides(mock_data_path)
    recommender = GuideRecommender(guides)
    
    # Wildlife safari scenario
    results = recommender.recommend(
        budget_min=5000,
        budget_max=15000,
        languages=["English"],
        expertise=["Wildlife", "Photography"],
        province="Eastern",
        city_only=False,
        top_k=5
    )
    
    assert len(results["recommendations"]) > 0, "Should return recommendations"
    assert results["total_candidates"] > 0, "Should have candidates"
    
    # Check that all recommendations meet hard filters
    for rec in results["recommendations"]:
        assert any(lang.lower() == "english" for lang in rec["languages"]), "Must speak English"
        assert 5000 <= rec["price"] <= 15000, "Price must be in range"
    
    print(f"✓ Full pipeline test passed ({len(results['recommendations'])} recommendations)")


def test_edge_cases():
    """Test edge cases and error handling."""
    guides = []
    
    recommender = GuideRecommender(guides)
    
    # Empty dataset
    results = recommender.recommend(
        budget_min=5000,
        budget_max=15000,
        languages=["English"],
        top_k=5
    )
    
    assert results["total_candidates"] == 0, "Should handle empty dataset"
    assert len(results["recommendations"]) == 0, "Should return empty recommendations"
    assert "message" in results, "Should have error message"
    
    print("✓ Edge case tests passed")


def test_reason_generation():
    """Test that reasons are generated correctly."""
    guides = [
        {
            "id": "1",
            "name": "Excellent Guide",
            "languages": ["English", "French"],
            "price": 8000,
            "city": "Kandy",
            "province": "Central",
            "availability": True,
            "expertise": ["Wildlife", "Photography", "Cultural"],
            "experience": ["10 years in Wildlife", "5 years in Photography"],
            "rating": 4.8,
            "prior_bookings": 150,
            "in_system": True
        }
    ]
    
    recommender = GuideRecommender(guides)
    
    results = recommender.recommend(
        budget_min=5000,
        budget_max=10000,
        languages=["English", "French"],
        expertise=["Wildlife", "Photography"],
        city="Kandy",
        province="Central",
        top_k=1
    )
    
    assert len(results["recommendations"]) == 1
    reasons = results["recommendations"][0]["reasons"]
    
    assert len(reasons) > 0, "Should have reasons"
    # Check that key reasons are present
    reason_text = " ".join(reasons)
    assert "english" in reason_text.lower() or "speaks" in reason_text.lower(), "Should mention language"
    
    print(f"✓ Reason generation test passed ({len(reasons)} reasons)")


if __name__ == "__main__":
    print("Running guide recommender tests...\n")
    
    test_hard_filters()
    test_location_scoring()
    test_language_scoring()
    test_expertise_scoring()
    test_reason_generation()
    test_full_pipeline()
    test_edge_cases()
    
    print("\n" + "="*60)
    print("✓ All tests passed!")
