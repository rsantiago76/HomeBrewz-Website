from typing import Optional, List
from sqlalchemy import String, Text, ForeignKey, Integer, Numeric, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid 

from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin

class Category(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    parent_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("categories.id"), nullable=True)

    parent: Mapped["Category"] = relationship(remote_side="Category.id", backref="children")
    products: Mapped[List["Product"]] = relationship(back_populates="category")

class Product(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "products"

    roaster_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("roasters.id"), nullable=False, index=True)
    category_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("categories.id"), nullable=True, index=True)
    
    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # Relationships
    roaster: Mapped["Roaster"] = relationship(back_populates="products")
    category: Mapped["Category"] = relationship(back_populates="products")
    variants: Mapped[List["ProductVariant"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    images: Mapped[List["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship(back_populates="product")

class ProductVariant(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "product_variants"

    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id"), nullable=False)
    sku: Mapped[Optional[str]] = mapped_column(String, index=True)
    
    # Variant Attributes
    weight: Mapped[Optional[int]] = mapped_column(Integer) # In grams or oz
    weight_unit: Mapped[str] = mapped_column(String, default="oz")
    grind: Mapped[Optional[str]] = mapped_column(String) # For now string, strictly could be enum
    
    price_override: Mapped[Numeric] = mapped_column(Numeric(10, 2), nullable=False) # Precision 10, scale 2

    product: Mapped["Product"] = relationship(back_populates="variants")
    inventory: Mapped["Inventory"] = relationship(back_populates="variant", uselist=False, cascade="all, delete-orphan")

class Inventory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "inventory"

    variant_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("product_variants.id"), unique=True, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    variant: Mapped["ProductVariant"] = relationship(back_populates="inventory")

class ProductImage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "product_images"

    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id"), nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String)
    is_thumbnail: Mapped[bool] = mapped_column(Boolean, default=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0)

    product: Mapped["Product"] = relationship(back_populates="images")
