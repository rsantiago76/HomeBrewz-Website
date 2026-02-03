from typing import Optional, List
from sqlalchemy import String, ForeignKey, Integer, Numeric, Enum as SAEnum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
import uuid
from datetime import datetime

from app.models.base import Base, UUIDMixin, TimestampMixin

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"

class Cart(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "carts"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    session_id: Mapped[Optional[str]] = mapped_column(String, nullable=True, index=True) # For guests

    items: Mapped[List["CartItem"]] = relationship(back_populates="cart", cascade="all, delete-orphan")

class CartItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "cart_items"

    cart_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("carts.id"), nullable=False, index=True)
    product_variant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("product_variants.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)

    cart: Mapped["Cart"] = relationship(back_populates="items")
    variant: Mapped["ProductVariant"] = relationship() # Just reference

class Order(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "orders"

    roaster_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("roasters.id"), nullable=False, index=True)
    customer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    
    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), default=OrderStatus.PENDING, index=True)
    total_amount: Mapped[Numeric] = mapped_column(Numeric(10, 2), nullable=False)
    stripe_payment_intent_id: Mapped[Optional[str]] = mapped_column(String)
    
    shipping_address_snapshot: Mapped[Optional[dict]] = mapped_column(String, nullable=True) # Store JSON as string or use JSONB
    
    # Relationships
    roaster: Mapped["Roaster"] = relationship(back_populates="orders")
    customer: Mapped["User"] = relationship(back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    status_history: Mapped[List["OrderStatusHistory"]] = relationship(back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "order_items"

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False, index=True)
    product_variant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("product_variants.id"), nullable=False)
    
    price_at_purchase: Mapped[Numeric] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    order: Mapped["Order"] = relationship(back_populates="items")
    variant: Mapped["ProductVariant"] = relationship()

class OrderStatusHistory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "order_status_history"

    order_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("orders.id"), nullable=False, index=True)
    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), nullable=False)
    
    changed_by_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id"), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(String)

    order: Mapped["Order"] = relationship(back_populates="status_history")
    changed_by: Mapped["User"] = relationship()
