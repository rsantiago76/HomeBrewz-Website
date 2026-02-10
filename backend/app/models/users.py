from typing import Optional, List
from sqlalchemy import String, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
import uuid

from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin

class UserRole(str, enum.Enum):
    SITE_ADMIN = "SITE_ADMIN"
    CUSTOMER = "CUSTOMER"

class RoasterRole(str, enum.Enum):
    ROASTER_ADMIN = "ROASTER_ADMIN"
    ROASTER_STAFF = "ROASTER_STAFF"

class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    sub: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False) # Cognito Subject ID
    full_name: Mapped[str] = mapped_column(String, nullable=True)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.CUSTOMER, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    roaster_memberships: Mapped[List["RoasterMembership"]] = relationship(back_populates="user")
    orders: Mapped[List["Order"]] = relationship(back_populates="customer")
    reviews: Mapped[List["Review"]] = relationship(back_populates="user")

class RoasterMembership(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "roaster_memberships"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    roaster_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("roasters.id"), nullable=False)
    role: Mapped[RoasterRole] = mapped_column(SAEnum(RoasterRole), default=RoasterRole.ROASTER_STAFF, nullable=False)

    user: Mapped["User"] = relationship(back_populates="roaster_memberships")
    roaster: Mapped["Roaster"] = relationship(back_populates="members")
