from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: str
    email: EmailStr
    longitude: float
    latitude: float


class UserCreate(UserBase):
    password: str


class UserInDB(UserBase):
    password: str
    created_at: datetime


class UserResponse(UserBase):
    created_at: Optional[datetime] = None


class UserLogin(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
