from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from ..core.database import get_redis_client
from ..core.security import verify_token
from ..models.user import UserInDB
from ..services.user_service import user_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    """Get current authenticated user."""
    redis_client = get_redis_client()

    # Check if token is blacklisted
    if redis_client.get(f"blacklist_token:{token}"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked"
        )

    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    email = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    user = user_service.get_user(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    return user
