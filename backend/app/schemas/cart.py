from pydantic import BaseModel, Field

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, le=50)

class CartItemOut(BaseModel):
    id: str
    product_name: str
    quantity: int
    line_total_cents: int

class CartOut(BaseModel):
    id: str
    items: list[CartItemOut]
    total_cents: int
