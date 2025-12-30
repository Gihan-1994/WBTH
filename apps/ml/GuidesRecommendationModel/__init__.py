"""
Guide Recommendation System
Implements point-additive scoring algorithm for guide matching
as specified in architecture spec section 4.2
"""

from .guide_recommender import GuideRecommender, load_guides
from .guide_data_generator import generate_mock_guides

__all__ = ['GuideRecommender', 'load_guides', 'generate_mock_guides']
