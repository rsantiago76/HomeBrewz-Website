from typing import Optional
from sqlalchemy import String, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin

class Review(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "reviews"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id"), nullable=False)
    
    rating: Mapped[int] = mapped_column(Integer, nullable=False) # 1-5
    comment: Mapped[Optional[str]] = mapped_column(Text)

    user: Mapped["User"] = relationship(back_populates="reviews")
    product: Mapped["Product"] = relationship(back_populates="reviews")
