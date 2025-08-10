from fastapi import APIRouter

from .auth import router as auth_router
from .events import router as events_router
from .products import router as products_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(products_router)
api_router.include_router(events_router)
