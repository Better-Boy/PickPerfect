import json
from datetime import datetime
from typing import Any, Dict, Optional

from ..config.settings import settings
from ..core.database import get_redis_client
from ..core.security import hash_password, verify_password
from ..models.user import UserCreate, UserInDB, UserResponse


class UserService:
    def __init__(self):
        self.redis_client = get_redis_client()

    def user_may_exist(self, email: str) -> bool:
        """Check if user may exist using bloom filter."""
        return self.redis_client.bf().exists(settings.redis_bloom_filter, email)

    def add_user_to_bloom(self, email: str) -> None:
        """Add user email to bloom filter."""
        self.redis_client.bf().add(settings.redis_bloom_filter, email)

    def get_user(self, email: str) -> Optional[UserInDB]:
        """Get user by email."""
        user_data_str = self.redis_client.hget("users", email)
        if not user_data_str:
            return None
        user_data = json.loads(user_data_str)
        return UserInDB(**user_data)

    def create_user(self, user_create: UserCreate) -> UserResponse:
        """Create a new user."""
        if self.user_may_exist(user_create.email):
            raise ValueError("User already exists")

        hashed_password = hash_password(user_create.password)
        user_data = UserInDB(
            username=user_create.username,
            email=user_create.email,
            password=hashed_password,
            longitude=user_create.longitude,
            latitude=user_create.latitude,
            created_at=datetime.utcnow(),
        )

        self.redis_client.hset("users", user_create.email, user_data.model_dump_json())
        self.add_user_to_bloom(user_create.email)

        return UserResponse(
            username=user_data.username,
            email=user_data.email,
            longitude=user_data.longitude,
            latitude=user_data.latitude,
            created_at=user_data.created_at,
        )

    def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        """Authenticate user with email and password."""
        if not self.user_may_exist(email):
            return None

        user = self.get_user(email)
        if user is None or not verify_password(password, user.password):
            return None

        return user


user_service = UserService()
