import json
import time

from fastapi import APIRouter, Depends

from ...core.database import get_redis_client
from ...models.event import UserEvent
from ...models.user import UserInDB
from ...services.recommendation_service import recommendation_service
from ..deps import get_current_user

router = APIRouter(tags=["events"])


@router.post("/events")
async def track_user_event(event: UserEvent):
    """Track user interaction event."""
    redis_client = get_redis_client()

    if event.user_id:
        event_data = {
            "product_id": event.product_id,
            "event_type": event.event_type,
            "timestamp": time.time(),
            "user_email": event.user_id,
        }

        # Store in user's event history
        redis_client.lpush(
            f"user_events:{event_data['user_email']}", json.dumps(event_data)
        )
        redis_client.expire(f"user_events:{event_data['user_email']}", 259200)  # 3 days

    # Update trending scores
    redis_client.zincrby("trending_products", 1, event.product_id)
    redis_client.zincrby("trending_categories", 1, event.category)

    return {"message": "Event tracked successfully"}


@router.get("/recommendations")
async def get_personalized_recommendations(
    current_user: UserInDB = Depends(get_current_user),
):
    """Get personalized product recommendations for the user."""
    products = recommendation_service.get_personalized_recommendations(
        current_user.email
    )
    return {"products": products}


@router.get("/categories/trending")
async def get_trending_categories(limit: int = 10):
    """Get trending categories."""
    redis_client = get_redis_client()
    categories = redis_client.zrevrange("trending_categories", 0, limit - 1)
    return {"categories": categories}
