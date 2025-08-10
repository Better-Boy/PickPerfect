from enum import Enum
from typing import List, Optional

from pydantic import BaseModel


class Product(BaseModel):
    id: Optional[str] = None
    name: str
    price: float
    image: str
    category: str
    brand: str
    rating: float
    reviews: int
    inStock: bool
    description: str
    features: List[str]


class ProductSearch(BaseModel):
    query: Optional[str] = None


class ProductSearchResponse(BaseModel):
    products: List[Product]


class FilterRequest(BaseModel):
    brands: List[str] = []
    categories: List[str] = []
    priceRange: List[int] = [0, 10000]
    rating: int = 0
