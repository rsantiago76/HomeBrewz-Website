from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import UUID
from decimal import Decimal
from datetime import datetime
from app.models.order import OrderStatus
from app.schemas.product import ProductVariantOut

# --- Cart ---
class CartItemBase(BaseModel):
    product_variant_id: UUID
    quantity: int = Field(1, gt=0)

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0)

class CartItemOut(CartItemBase):
    id: UUID
    # variant: ProductVariantOut # Expand if needed
    
    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: UUID
    items: List[CartItemOut]
    total_items: int

    class Config:
        from_attributes = True

# --- Order ---
class OrderItemOut(BaseModel):
    id: UUID
    product_variant_id: UUID
    product_name: str # Helper field from backend join? or just rely on variant.
    price_at_purchase: Decimal
    quantity: int
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address_snapshot: Optional[dict] = None

class OrderCreate(OrderBase):
    # Created from Cart usually, so minimal input needed?
    # Or strict input for "Buy Now"?
    # Usually "checkout" endpoint takes payment token and optional address
    payment_token: str

class OrderOut(OrderBase):
    id: UUID
    roaster_id: UUID
    customer_id: UUID
    status: OrderStatus
    total_amount: Decimal
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    notes: Optional[str] = None
