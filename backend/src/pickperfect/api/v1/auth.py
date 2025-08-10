from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from ...core.database import get_redis_client
from ...core.security import create_access_token, verify_token
from ...models.user import UserCreate, UserLogin, UserResponse
from ...services.user_service import user_service
from ..deps import oauth2_scheme

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register")
async def register(user: UserCreate):
    """Register a new user."""
    try:
        user_service.create_user(user)
        return {
            "message": "User registered successfully. Please login to get access token."
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=UserLogin)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token."""
    user = user_service.authenticate_user(form_data.username, form_data.password)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={"sub": user.email})
    user_response = UserResponse(
        username=user.username,
        email=user.email,
        longitude=user.longitude,
        latitude=user.latitude,
        created_at=user.created_at,
    )

    return {"access_token": access_token, "token_type": "bearer", "user": user_response}


@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """Logout user and blacklist token."""
    redis_client = get_redis_client()
    payload = verify_token(token)

    if payload:
        exp_timestamp = payload.get("exp")
        now_timestamp = datetime.utcnow().timestamp()
        ttl = int(exp_timestamp - now_timestamp)

        if ttl > 0:
            redis_client.setex(f"blacklist_token:{token}", ttl, "true")

    return {"msg": "Successfully logged out"}
