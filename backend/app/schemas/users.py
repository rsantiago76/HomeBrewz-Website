from typing import Optional, List
from pydantic import BaseModel, EmailStr, HttpUrl, Field
from uuid import UUID
from datetime import datetime
from app.models.users import UserRole, RoasterRole

# --- Users ---
class UserBase(BaseModel):
    full_name: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    email: EmailStr
    sub: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None

class UserOut(UserBase):
    id: UUID
    email: EmailStr
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

# --- Roasters ---
class RoasterBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    slug: str = Field(..., pattern="^[a-z0-9-]+$")
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None

class RoasterCreate(RoasterBase):
    pass

class RoasterUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None

class RoasterOut(RoasterBase):
    id: UUID
    verified_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
