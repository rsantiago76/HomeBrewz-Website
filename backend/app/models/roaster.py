from typing import Optional, List
from sqlalchemy import String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin

class Roaster(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "roasters"

    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    logo_url: Mapped[Optional[str]] = mapped_column(String)
    website: Mapped[Optional[str]] = mapped_column(String)
    
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    members: Mapped[List["RoasterMembership"]] = relationship(back_populates="roaster")
    products: Mapped[List["Product"]] = relationship(back_populates="roaster")
    orders: Mapped[List["Order"]] = relationship(back_populates="roaster")
