from typing import Optional

import redis

from ..config.settings import settings


class RedisClient:
    _instance: Optional[redis.Redis] = None

    @classmethod
    def get_client(cls) -> redis.Redis:
        if cls._instance is None:
            cls._instance = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                decode_responses=True,
                username=settings.redis_username,
                password=settings.redis_password,
            )

            # Initialize bloom filter
            try:
                cls._instance.bf().reserve(
                    settings.redis_bloom_filter, errorRate=0.01, capacity=1000
                )
            except redis.exceptions.ResponseError as e:
                if "exists" not in str(e).lower():
                    raise

        return cls._instance


def get_redis_client() -> redis.Redis:
    return RedisClient.get_client()
