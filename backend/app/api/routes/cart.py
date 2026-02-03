from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartOut

router = APIRouter(prefix="/cart")

async def _get_or_create_cart(db: AsyncSession) -> Cart:
    # Demo-only: single shared cart. Replace with per-user/session cart later.
    result = await db.execute(select(Cart).limit(1))
    cart = result.scalars().first()
    if cart:
        return cart
    cart = Cart()
    db.add(cart)
    await db.commit()
    await db.refresh(cart)
    return cart

@router.get("", response_model=CartOut)
async def get_cart(db: AsyncSession = Depends(get_db)):
    cart = await _get_or_create_cart(db)
    # join products for a minimal response
    items_out = []
    total = 0
    for item in cart.items:
        prod = await db.get(Product, item.product_id)
        name = prod.name if prod else "Unknown"
        line_total = (prod.price_cents if prod else 0) * item.quantity
        total += line_total
        items_out.append({"id": item.id, "product_name": name, "quantity": item.quantity, "line_total_cents": line_total})
    return {"id": cart.id, "items": items_out, "total_cents": total}

@router.post("/items")
async def add_item(payload: CartItemCreate, db: AsyncSession = Depends(get_db)):
    cart = await _get_or_create_cart(db)
    db.add(CartItem(cart_id=cart.id, product_id=payload.product_id, quantity=payload.quantity))
    await db.commit()
    return {"ok": True}
