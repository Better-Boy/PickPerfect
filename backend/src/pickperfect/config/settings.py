from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Security
    secret_key: str = Field(default="your-secret-key-change-in-production")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)

    # Redis Configuration
    redis_host: str = Field(
        default="redis-13451.c85.us-east-1-2.ec2.redns.redis-cloud.com"
    )
    redis_port: int = Field(default=13451)
    redis_password: str = Field(default="7QircAlnOg7jeQcdVfkTKEm340wRYPhL")
    redis_username: str = Field(default="default")
    search_index_name: str = Field(default="products_idx")
    redis_bloom_filter: str = Field(default="usersBF")

    # OpenAI Configuration
    openai_api_key: str = Field(default="")

    # CORS Configuration
    cors_origins: List[str] = Field(default=["*"])
    cors_allow_credentials: bool = Field(default=True)
    cors_allow_methods: List[str] = Field(default=["*"])
    cors_allow_headers: List[str] = Field(default=["*"])

    # Application
    app_title: str = Field(default="PickPerfect with RedisAI")
    app_version: str = Field(default="1.0.0")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
