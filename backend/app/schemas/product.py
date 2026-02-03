from typing import Optional, List
from pydantic import BaseModel, Field, condecimal
from uuid import UUID
from decimal import Decimal
from datetime import datetime

# --- Variants ---
class ProductVariantBase(BaseModel):
    sku: Optional[str] = None
    weight: Optional[int] = None
    weight_unit: str = "oz"
    grind: Optional[str] = None
    price_override: Decimal = Field(..., ge=0)

class ProductVariantCreate(ProductVariantBase):
    initial_quantity: int = Field(0, ge=0)

class ProductVariantOut(ProductVariantBase):
    id: UUID
    product_id: UUID
    # inventory: quantity would be joined or fetched separately? 
    # For now, let's include it if we assume eager loading
    
    class Config:
        from_attributes = True

# --- Images ---
class ProductImageBase(BaseModel):
    url: str
    alt_text: Optional[str] = None
    is_thumbnail: bool = False
    display_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageOut(ProductImageBase):
    id: UUID
    
    class Config:
        from_attributes = True

# --- Products ---
class ProductBase(BaseModel):
    name: str = Field(..., min_length=2)
    slug: str
    description: Optional[str] = None
    is_active: bool = False
    category_id: Optional[UUID] = None

class ProductCreate(ProductBase):
    roaster_id: UUID # Explicitly passed or inferred from auth context? Usually inferred, but schema might accept it for admins.
    variants: List[ProductVariantCreate]

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[UUID] = None

class ProductOut(ProductBase):
    id: UUID
    roaster_id: UUID
    created_at: datetime
    updated_at: datetime
    
    variants: List[ProductVariantOut] = []
    images: List[ProductImageOut] = []

    class Config:
        from_attributes = True
