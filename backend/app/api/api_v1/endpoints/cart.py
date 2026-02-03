from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app import schemas, models
from app.api import deps
import uuid

router = APIRouter()

@router.get("/", response_model=schemas.CartOut)
async def read_cart(
    db: AsyncSession = Depends(deps.get_db),
    current_user: Optional[models.User] = Depends(deps.get_current_user), # Optional for guests
    # session_id: str = Cookie(None) # Guest flow
) -> Any:
    """
    Get current cart. Unified logic for guest/user needed.
    For this MVP, we require auth or return empty.
    """
    if not current_user:
         # TODO: Implement guest cart logic
         return {"id": uuid.uuid4(), "items": [], "total_items": 0}

    # Find cart for user
    stmt = select(models.Cart).where(models.Cart.user_id == current_user.id).options(selectinload(models.Cart.items))
    result = await db.execute(stmt)
    cart = result.scalars().first()

    if not cart:
        # Create empty
        cart = models.Cart(user_id=current_user.id)
        db.add(cart)
        await db.commit()
    
    return {"id": cart.id, "items": cart.items, "total_items": sum(i.quantity for i in cart.items)}

@router.post("/items", response_model=schemas.CartOut)
async def add_to_cart(
    *,
    db: AsyncSession = Depends(deps.get_db),
    item_in: schemas.CartItemCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add item to cart.
    """
    # 1. Get/Create Cart
    stmt = select(models.Cart).where(models.Cart.user_id == current_user.id).options(selectinload(models.Cart.items))
    result = await db.execute(stmt)
    cart = result.scalars().first()
    
    if not cart:
        cart = models.Cart(user_id=current_user.id)
        db.add(cart)
        await db.commit() # Get ID
        cart.items = []

    # 2. Check if item exists
    existing_item = next((i for i in cart.items if str(i.product_variant_id) == str(item_in.product_variant_id)), None)
    
    if existing_item:
        existing_item.quantity += item_in.quantity
    else:
        new_item = models.CartItem(
            cart_id=cart.id,
            product_variant_id=item_in.product_variant_id,
            quantity=item_in.quantity
        )
        db.add(new_item)
    
    await db.commit()
    await db.refresh(cart, attribute_names=["items"])
    
    return {"id": cart.id, "items": cart.items, "total_items": sum(i.quantity for i in cart.items)}
