from enum import Enum

from pydantic import BaseModel


class EventType(str, Enum):
    CLICK = "click"
    ADD_TO_CART = "add_to_cart"


class UserEvent(BaseModel):
    product_id: str
    user_id: str
    event_type: EventType
    category: str
