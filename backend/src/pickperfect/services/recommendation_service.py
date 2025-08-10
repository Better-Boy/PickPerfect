import json
import time
from typing import List

import numpy as np

from ..core.database import get_redis_client
from ..models.event import EventType
from ..models.product import Product
from .product_service import product_service


class RecommendationService:
    def __init__(self):
        self.redis_client = get_redis_client()
        self.event_weights = {EventType.CLICK: 2, EventType.ADD_TO_CART: 5}

    def calculate_time_decay(
        self, timestamp: float, decay_factor: float = 0.1
    ) -> float:
        """Calculate time decay factor for events."""
        hours_passed = (time.time() - timestamp) / 3600
        return np.exp(-decay_factor * hours_passed)

    def get_personalized_recommendations(self, user_email: str) -> List[Product]:
        """Get personalized recommendations for a user."""
        user_events = self.redis_client.lrange(f"user_events:{user_email}", 0, 100)

        if not user_events:
            return product_service.get_trending_products(10)

        product_scores = {}

        for event_str in user_events:
            if isinstance(event_str, bytes):
                event_str = event_str.decode("utf-8")
            event_data = json.loads(event_str)
            product_id = event_data["product_id"]
            event_type = event_data["event_type"]
            timestamp = event_data["timestamp"]

            time_decay = self.calculate_time_decay(timestamp)
            base_score = self.event_weights.get(event_type, 1)
            final_score = base_score * time_decay

            product_scores[product_id] = product_scores.get(product_id, 0) + final_score

        if not product_scores:
            return product_service.get_trending_products(10)

        # Create user preference vector
        weighted_vectors = []

        for product_id, score in product_scores.items():
            embedding = self.redis_client.json().get(
                f"product:{product_id}", "$.embedding"
            )
            if embedding:
                embedding = np.array(embedding).astype(np.float32)
                weighted_vectors.append(embedding * score)

        if weighted_vectors:
            user_preference_vector = np.mean(weighted_vectors, axis=0)
            initial_limit = min(10 * 3, 100)
            results = product_service.vector_search_embed(
                user_preference_vector, initial_limit
            )

            recommendations = []
            for res in results:
                if res.id in product_scores:
                    continue
                recommendations.append(res)

            return recommendations[:10]

        return []


recommendation_service = RecommendationService()
