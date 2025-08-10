from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1 import api_router
from .config.settings import settings
from .core.database import get_redis_client

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

app.include_router(api_router)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        redis_client = get_redis_client()
        redis_client.ping()
        return {"status": "healthy", "redis": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "redis": "disconnected", "error": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.pickperfect.main:app", host="0.0.0.0", port=8000, reload=True)
