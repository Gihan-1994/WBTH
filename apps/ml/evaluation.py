"""
Evaluation module for accommodation recommendation system.
Implements standard IR metrics: Precision@k, Recall@k, NDCG@k
"""

import json
import numpy as np
from typing import List, Dict, Set
from recommender import AccommodationRecommender, load_accommodations


class RecommenderEvaluator:
    """Evaluate recommendation system performance."""
    
    def __init__(self, recommender: AccommodationRecommender):
        """Initialize evaluator with a recommender instance."""
        self.recommender = recommender
    
    def precision_at_k(self, recommended_ids: List[str], relevant_ids: Set[str], k: int) -> float:
        """
        Calculate Precision@k: proportion of relevant items in top-k recommendations.
        
        Args:
            recommended_ids: List of recommended accommodation IDs (in rank order)
            relevant_ids: Set of relevant accommodation IDs
            k: Number of top recommendations to consider
        
        Returns:
            Precision@k score
        """
        if k == 0 or not recommended_ids:
            return 0.0
        
        top_k = recommended_ids[:k]
        relevant_in_top_k = sum(1 for item_id in top_k if item_id in relevant_ids)
        
        return relevant_in_top_k / k
    
    def recall_at_k(self, recommended_ids: List[str], relevant_ids: Set[str], k: int) -> float:
        """
        Calculate Recall@k: proportion of relevant items retrieved in top-k.
        
        Args:
            recommended_ids: List of recommended accommodation IDs (in rank order)
            relevant_ids: Set of relevant accommodation IDs
            k: Number of top recommendations to consider
        
        Returns:
            Recall@k score
        """
        if not relevant_ids:
            return 0.0
        
        top_k = recommended_ids[:k]
        relevant_in_top_k = sum(1 for item_id in top_k if item_id in relevant_ids)
        
        return relevant_in_top_k / len(relevant_ids)
    
    def ndcg_at_k(self, recommended_ids: List[str], relevance_scores: Dict[str, float], k: int) -> float:
        """
        Calculate NDCG@k: Normalized Discounted Cumulative Gain.
        
        Args:
            recommended_ids: List of recommended accommodation IDs (in rank order)
            relevance_scores: Dictionary mapping IDs to relevance scores (0-1)
            k: Number of top recommendations to consider
        
        Returns:
            NDCG@k score
        """
        if k == 0 or not recommended_ids:
            return 0.0
        
        # Calculate DCG
        dcg = 0.0
        for i, item_id in enumerate(recommended_ids[:k], 1):
            rel = relevance_scores.get(item_id, 0.0)
            dcg += rel / np.log2(i + 1)
        
        # Calculate IDCG (ideal DCG)
        sorted_relevance = sorted(relevance_scores.values(), reverse=True)
        idcg = 0.0
        for i, rel in enumerate(sorted_relevance[:k], 1):
            idcg += rel / np.log2(i + 1)
        
        if idcg == 0.0:
            return 0.0
        
        return dcg / idcg
    
    def average_precision(self, recommended_ids: List[str], relevant_ids: Set[str]) -> float:
        """
        Calculate Average Precision (AP).
        
        Args:
            recommended_ids: List of recommended accommodation IDs (in rank order)
            relevant_ids: Set of relevant accommodation IDs
        
        Returns:
            Average Precision score
        """
        if not relevant_ids or not recommended_ids:
            return 0.0
        
        precision_sum = 0.0
        relevant_count = 0
        
        for k, item_id in enumerate(recommended_ids, 1):
            if item_id in relevant_ids:
                relevant_count += 1
                precision_sum += relevant_count / k
        
        return precision_sum / len(relevant_ids) if relevant_ids else 0.0
    
    def evaluate_query(
        self,
        query_params: Dict,
        relevant_ids: Set[str],
        relevance_scores: Dict[str, float],
        k_values: List[int] = [5, 10]
    ) -> Dict:
        """
        Evaluate a single query.
        
        Args:
            query_params: Query parameters for recommendation
            relevant_ids: Set of relevant accommodation IDs for this query
            relevance_scores: Relevance scores for each accommodation
            k_values: List of k values to evaluate
        
        Returns:
            Dictionary of evaluation metrics
        """
        # Get recommendations
        results = self.recommender.recommend(**query_params)
        recommended_ids = [rec["id"] for rec in results["recommendations"]]
        
        # Calculate metrics
        metrics = {
            "num_recommendations": len(recommended_ids),
            "num_candidates": results["total_candidates"]
        }
        
        # Precision@k and Recall@k for each k
        for k in k_values:
            metrics[f"precision@{k}"] = self.precision_at_k(recommended_ids, relevant_ids, k)
            metrics[f"recall@{k}"] = self.recall_at_k(recommended_ids, relevant_ids, k)
            metrics[f"ndcg@{k}"] = self.ndcg_at_k(recommended_ids, relevance_scores, k)
        
        # Average Precision
        metrics["average_precision"] = self.average_precision(recommended_ids, relevant_ids)
        
        # Average score of recommendations
        if results["recommendations"]:
            avg_score = np.mean([rec["score"] for rec in results["recommendations"]])
            metrics["average_score"] = avg_score
        else:
            metrics["average_score"] = 0.0
        
        return metrics
    
    def coverage(self, all_queries: List[Dict], top_k: int = 10) -> float:
        """
        Calculate catalog coverage: percentage of accommodations recommended at least once.
        
        Args:
            all_queries: List of query parameter dictionaries
            top_k: Number of recommendations per query
        
        Returns:
            Coverage percentage (0-1)
        """
        all_accommodations = set(acc["id"] for acc in self.recommender.accommodations)
        recommended_at_least_once = set()
        
        for query in all_queries:
            query_with_k = {**query, "top_k": top_k}
            results = self.recommender.recommend(**query_with_k)
            recommended_ids = [rec["id"] for rec in results["recommendations"]]
            recommended_at_least_once.update(recommended_ids)
        
        return len(recommended_at_least_once) / len(all_accommodations) if all_accommodations else 0.0


def create_test_scenarios() -> List[Dict]:
    """Define test scenarios with expected relevant results."""
    scenarios = [
        {
            "name": "Luxury Beach (Galle)",
            "query": {
                "budget_min": 10000,
                "budget_max": 30000,
                "required_amenities": ["wifi", "pool"],
                "interests": ["coastal", "luxury", "romantic"],
                "travel_style": "luxury",
                "group_size": 2,
                "location_city": "Galle",
                "location_province": "Southern",
                "top_k": 10
            },
            "expected_tags": {"coastal", "luxury", "romantic"},
            "expected_province": "Southern"
        },
        {
            "name": "Budget Backpacker (Kandy)",
            "query": {
                "budget_min": 500,
                "budget_max": 2000,
                "required_amenities": ["wifi"],
                "interests": ["cultural", "budget_friendly", "photography"],
                "travel_style": "budget",
                "group_size": 1,
                "location_city": "Kandy",
                "location_province": "Central",
                "top_k": 10
            },
            "expected_tags": {"cultural", "budget_friendly"},
            "expected_province": "Central"
        },
        {
            "name": "Family Adventure (Ella)",
            "query": {
                "budget_min": 5000,
                "budget_max": 15000,
                "required_amenities": ["wifi", "parking", "restaurant"],
                "interests": ["family_friendly", "adventure", "hiking"],
                "travel_style": "family",
                "group_size": 4,
                "location_city": "Ella",
                "location_province": "Uva",
                "top_k": 10
            },
            "expected_tags": {"family_friendly", "adventure", "hiking"},
            "expected_province": "Uva"
        },
        {
            "name": "Wildlife Safari (Trincomalee)",
            "query": {
                "budget_min": 8000,
                "budget_max": 20000,
                "required_amenities": ["wifi", "hot_water"],
                "interests": ["wildlife", "eco_friendly", "photography"],
                "travel_style": "eco_tourism",
                "group_size": 3,
                "location_province": "Eastern",
                "top_k": 10
            },
            "expected_tags": {"wildlife", "eco_friendly"},
            "expected_province": "Eastern"
        },
        {
            "name": "Romantic Getaway (Mirissa)",
            "query": {
                "budget_min": 12000,
                "budget_max": 25000,
                "required_amenities": ["wifi", "pool", "beach_access"],
                "interests": ["coastal", "romantic", "relaxation"],
                "travel_style": "romantic",
                "group_size": 2,
                "location_city": "Mirissa",
                "location_province": "Southern",
                "top_k": 10
            },
            "expected_tags": {"coastal", "romantic"},
            "expected_province": "Southern"
        }
    ]
    
    return scenarios


def determine_relevance(accommodation: Dict, expected_tags: Set[str], expected_province: str) -> float:
    """
    Determine relevance score for an accommodation given expected criteria.
    
    Returns:
        Relevance score from 0.0 (not relevant) to 1.0 (perfectly relevant)
    """
    score = 0.0
    
    # Interest/tag overlap (0-0.5)
    acc_interests = set(accommodation.get("interests", []))
    overlap = len(acc_interests & expected_tags)
    max_overlap = len(expected_tags)
    if max_overlap > 0:
        score += 0.5 * (overlap / max_overlap)
    
    # Province match (0-0.3)
    if accommodation.get("province") == expected_province:
        score += 0.3
    
    # Rating bonus (0-0.2)
    rating = accommodation.get("rating", 0)
    if rating >= 4.0:
        score += 0.2
    elif rating >= 3.5:
        score += 0.1
    
    return min(1.0, score)


if __name__ == "__main__":
    print("=== Recommendation System Evaluation ===\n")
    
    # Load data
    print("Loading accommodation data...")
    accommodations = load_accommodations()
    print(f"✓ Loaded {len(accommodations)} accommodations\n")
    
    # Initialize recommender and evaluator
    recommender = AccommodationRecommender(accommodations)
    evaluator = RecommenderEvaluator(recommender)
    
    # Create test scenarios
    scenarios = create_test_scenarios()
    
    print(f"Running evaluation on {len(scenarios)} test scenarios...\n")
    print("=" * 80)
    
    all_metrics = []
    
    for scenario in scenarios:
        print(f"\n Scenario: {scenario['name']}")
        print("-" * 80)
        
        # Determine relevant accommodations for this scenario
        relevant_ids = set()
        relevance_scores = {}
        
        for acc in accommodations:
            relevance = determine_relevance(
                acc,
                scenario["expected_tags"],
                scenario["expected_province"]
            )
            relevance_scores[acc["id"]] = relevance
            
            # Consider "relevant" if score > 0.4
            if relevance > 0.4:
                relevant_ids.add(acc["id"])
        
        print(f"  Relevant accommodations: {len(relevant_ids)}")
        
        # Evaluate query
        metrics = evaluator.evaluate_query(
            query_params=scenario["query"],
            relevant_ids=relevant_ids,
            relevance_scores=relevance_scores,
            k_values=[5, 10]
        )
        
        all_metrics.append(metrics)
        
        # Print metrics
        print(f"  Candidates found: {metrics['num_candidates']}")
        print(f"  Recommendations: {metrics['num_recommendations']}")
        print(f"\n  Metrics:")
        print(f"    Precision@5:  {metrics['precision@5']:.3f}")
        print(f"    Precision@10: {metrics['precision@10']:.3f}")
        print(f"    Recall@5:     {metrics['recall@5']:.3f}")
        print(f"    Recall@10:    {metrics['recall@10']:.3f}")
        print(f"    NDCG@5:       {metrics['ndcg@5']:.3f}")
        print(f"    NDCG@10:      {metrics['ndcg@10']:.3f}")
        print(f"    Avg Precision: {metrics['average_precision']:.3f}")
        print(f"    Avg Score:    {metrics['average_score']:.3f}")
    
    # Summary statistics
    print("\n" + "=" * 80)
    print("\n  SUMMARY STATISTICS")
    print("=" * 80)
    
    avg_metrics = {
        "precision@5": np.mean([m["precision@5"] for m in all_metrics]),
        "precision@10": np.mean([m["precision@10"] for m in all_metrics]),
        "recall@5": np.mean([m["recall@5"] for m in all_metrics]),
        "recall@10": np.mean([m["recall@10"] for m in all_metrics]),
        "ndcg@5": np.mean([m["ndcg@5"] for m in all_metrics]),
        "ndcg@10": np.mean([m["ndcg@10"] for m in all_metrics]),
        "average_precision": np.mean([m["average_precision"] for m in all_metrics]),
        "average_score": np.mean([m["average_score"] for m in all_metrics])
    }
    
    print(f"\n  Average Metrics Across All Scenarios:")
    print(f"    Precision@5:  {avg_metrics['precision@5']:.3f}")
    print(f"    Precision@10: {avg_metrics['precision@10']:.3f}")
    print(f"    Recall@5:     {avg_metrics['recall@5']:.3f}")
    print(f"    Recall@10:    {avg_metrics['recall@10']:.3f}")
    print(f"    NDCG@5:       {avg_metrics['ndcg@5']:.3f}")
    print(f"    NDCG@10:      {avg_metrics['ndcg@10']:.3f}")
    print(f"    Avg Precision: {avg_metrics['average_precision']:.3f}")
    print(f"    Avg Score:    {avg_metrics['average_score']:.3f}")
    
    # Coverage analysis
    print(f"\n  Coverage Analysis:")
    queries = [s["query"] for s in scenarios]
    coverage_5 = evaluator.coverage(queries, top_k=5)
    coverage_10 = evaluator.coverage(queries, top_k=10)
    print(f"    Coverage@5:  {coverage_5*100:.1f}%")
    print(f"    Coverage@10: {coverage_10*100:.1f}%")
    
    print("\n" + "=" * 80)
    print("✓ Evaluation complete!")
