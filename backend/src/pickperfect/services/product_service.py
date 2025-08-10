from typing import List, Optional, Tuple

import numpy as np
from redis.commands.search.query import Query

from ..config.settings import settings
from ..core.database import get_redis_client
from ..models.product import FilterRequest, Product
from .embedding_service import embedding_service


class ProductService:
    def __init__(self):
        self.redis_client = get_redis_client()

    def get_all_products(self) -> List[Product]:
        """Get all products from Redis."""
        prefix = "product:"
        results = []
        for key in self.redis_client.scan_iter(match=f"{prefix}*"):
            data = self.redis_client.json().get(key)
            if "embedding" in data:
                del data["embedding"]
            if "warehouse_geolocation" in data:
                del data["warehouse_geolocation"]
            results.append(Product(**data))
        return results

    def vector_search_embed(self, embedding: List[float], k: int = 10) -> List[Product]:
        """Search products using vector similarity."""
        vector_bytes = np.array(embedding).astype(np.float32).tobytes()
        base_query = f"*=>[KNN {k} @embedding $vec AS vector_score]"
        query = (
            Query(base_query)
            .return_fields("id", "vector_score")
            .sort_by("vector_score")
            .paging(0, k)
        )

        params_dict = {"vec": vector_bytes}

        results = self.redis_client.ft(settings.search_index_name).search(
            query, query_params=params_dict
        )

        filtered_products = []
        for doc in results.docs:
            data = self.redis_client.json().get(getattr(doc, "id"))
            if "embedding" in data:
                del data["embedding"]
            filtered_products.append(Product(**data))
        return filtered_products

    def vector_search(self, query: str, k: int = 10) -> List[Product]:
        """Search products using text query converted to embeddings."""
        query_embedding = embedding_service.get_embedding(query)
        return self.vector_search_embed(query_embedding, k)

    def multi_parameter_search(
        self,
        text_query: Optional[str] = None,
        price_min: Optional[float] = None,
        price_max: Optional[float] = None,
        category: Optional[str] = None,
        brand: Optional[str] = None,
        rating: Optional[float] = None,
        in_stock: Optional[bool] = None,
        geo_location: Optional[Tuple[float, float]] = None,
        geo_radius_km: float = 50,
    ) -> List[Product]:
        """Search products with multiple parameters."""
        query_parts = []
        query_params = {}

        if text_query:
            query_parts.append(f"(@name|@description|@brand|@features:{text_query})")

        if price_min is not None or price_max is not None:
            min_val = price_min if price_min is not None else "-inf"
            max_val = price_max if price_max is not None else "+inf"
            query_parts.append(f"@price:[{min_val} {max_val}]")

        if category:
            query_parts.append(f"@category:{category}")

        if brand:
            query_parts.append(f"@brand:{brand}")

        if rating is not None:
            query_parts.append(f"@rating:[{rating} 5]")

        if in_stock is not None:
            query_parts.append(f"@inStock:{str(in_stock).lower()}")

        if geo_location and geo_radius_km:
            lon, lat = geo_location
            query_parts.append(f"@warehouse_location:[{lon} {lat} {geo_radius_km} km]")

        base_query = " ".join(query_parts) if query_parts else "*"
        
        query = Query(base_query).return_fields("id").dialect(2)
        query = query.paging(0, 20)

        try:
            result = self.redis_client.ft(settings.search_index_name).search(
                query, query_params=query_params
            )
            filtered_products = []
            for doc in result.docs:
                data = self.redis_client.json().get(getattr(doc, "id"))
                if "embedding" in data:
                    del data["embedding"]
                filtered_products.append(Product(**data))
            return filtered_products
        except Exception as e:
            print(f"Multi-parameter search error: {e}")
            return []

    def get_trending_products(self, limit: int = 10) -> List[Product]:
        """Get trending products based on interaction scores."""
        trending_ids = self.redis_client.zrevrange("trending_products", 0, limit - 1)

        results = []
        for product_id in trending_ids:
            data = self.redis_client.json().get(f"product:{product_id}")
            if "embedding" in data:
                del data["embedding"]
            if "warehouse_geolocation" in data:
                del data["warehouse_geolocation"]
            results.append(Product(**data))

        return results

    def filter_products(self, filter_request: FilterRequest) -> List[Product]:
        """Filter products based on filter criteria."""
        category = None
        if filter_request.categories:
            category = "{" + "|".join(filter_request.categories) + "}"

        brand = None
        if filter_request.brands:
            brand = "{" + "|".join(filter_request.brands) + "}"

        return self.multi_parameter_search(
            price_min=filter_request.priceRange[0],
            price_max=filter_request.priceRange[1],
            category=category,
            brand=brand,
            rating=filter_request.rating,
        )


product_service = ProductService()
