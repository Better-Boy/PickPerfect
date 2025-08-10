from typing import List

from fastapi import APIRouter, Depends

from ...models.product import (
    FilterRequest,
    Product,
    ProductSearch,
    ProductSearchResponse,
)
from ...models.user import UserInDB
from ...services.product_service import product_service
from ..deps import get_current_user

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductSearchResponse)
async def fetch_products(input_data: ProductSearch):
    """Fetch products with optional search query."""
    if input_data.query:
        products = product_service.vector_search(input_data.query)
    else:
        products = product_service.get_all_products()

    return {"products": products}


@router.get("/trending")
async def get_trending_products(limit: int = 10):
    """Get trending products."""
    products = product_service.get_trending_products(limit)
    return {"products": products}


@router.get("/near-by")
async def search_near_location(current_user: UserInDB = Depends(get_current_user)):
    """Search products near user location."""
    lon = current_user.longitude
    lat = current_user.latitude

    products = product_service.multi_parameter_search(geo_location=[lon, lat])

    if not products:
        products = product_service.multi_parameter_search(
            geo_location=[77.209, 28.6139]
        )

    return {"products": products}


@router.post("/filter")
async def filter_products(filter_request: FilterRequest):
    """Filter products based on criteria."""
    products = product_service.filter_products(filter_request)
    return {"products": products}
