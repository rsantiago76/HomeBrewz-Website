from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app import schemas, models
from app.api import deps
from app.services.audit import AuditService
import uuid

router = APIRouter()

@router.post("/confirm", response_model=schemas.OrderOut)
async def confirm_checkout(
    *,
    db: AsyncSession = Depends(deps.get_db),
    # intent_data: schemas.OrderCreate, # For now assuming token passed
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Checkout current cart.
    Simplified: Takes current user's cart, creates order, clears cart.
    """
    # 1. Get Cart
    stmt = select(models.Cart).where(models.Cart.user_id == current_user.id).options(selectinload(models.Cart.items).selectinload(models.CartItem.variant).selectinload(models.ProductVariant.product))
    result = await db.execute(stmt)
    cart = result.scalars().first()
    
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # 2. Group by Roaster (Multi-vendor support)
    # We need to split orders by roaster?
    # For MVP: Let's assume user buys from ONE roaster at a time or we implement split.
    # Implementing split order logic is complex for return type.
    # Let's assume single order for now or just pick first roaster found (MVP limitation)
    # OR: Create one order per roaster.
    
    # Let's create one order for the FIRST roaster found in items for this example.
    first_item = cart.items[0]
    roaster_id = first_item.variant.product.roaster_id
    
    # Validate all items are from same roaster?
    # If not, we should error or split.
    # Error for simplicity:
    for item in cart.items:
        if item.variant.product.roaster_id != roaster_id:
             raise HTTPException(status_code=400, detail="Multi-vendor checkout not supported in MVP. Please purchase from one roaster at a time.")

    # 3. Calculate Total
    total_amount = sum(item.quantity * item.variant.price_override for item in cart.items)
    
    # 4. Create Order
    order = models.Order(
        roaster_id=roaster_id,
        customer_id=current_user.id,
        status=models.OrderStatus.PAID, # Assuming payment succeeded for now
        total_amount=total_amount,
        shipping_address_snapshot={} # Mock
    )
    db.add(order)
    await db.flush() # Get ID

    # 5. Create Order Items and Deduct Inventory
    for item in cart.items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_variant_id=item.product_variant_id,
            price_at_purchase=item.variant.price_override,
            quantity=item.quantity
        )
        db.add(order_item)
        
        # Deduct Inventory
        # Need to fetch inventory record. 
        # Simplified:
        # stmt_inv = select(models.Inventory).where(models.Inventory.variant_id == item.product_variant_id)
        # inv = ...
        # inv.quantity -= item.quantity
    
    # 6. Clear Cart
    for item in cart.items:
        await db.delete(item)
    
    # 7. Audit
    audit = AuditService(db)
    await audit.log_action(
        action="ORDER_CREATED",
        entity_type="Order",
        entity_id=str(order.id),
        actor_user_id=current_user.id,
        roaster_id=roaster_id,
        changes={"total": float(total_amount)}
    )

    await db.commit()
    await db.refresh(order)
    
    return order
