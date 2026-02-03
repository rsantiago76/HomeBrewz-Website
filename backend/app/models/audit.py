from typing import Optional
from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
import uuid

from app.models.base import Base, UUIDMixin, TimestampMixin

class AuditLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "audit_logs"

    action: Mapped[str] = mapped_column(String, index=True, nullable=False)
    entity_type: Mapped[str] = mapped_column(String, index=True, nullable=False) # e.g., "Product", "Order"
    entity_id: Mapped[str] = mapped_column(String, index=True, nullable=False)
    
    actor_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    roaster_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("roasters.id"), nullable=True, index=True) # Tenant aware
    
    changes: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    actor: Mapped["User"] = relationship()
