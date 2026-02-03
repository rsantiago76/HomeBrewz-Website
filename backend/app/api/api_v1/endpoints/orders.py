from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app import schemas, models
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.OrderOut])
async def read_orders(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve orders.
    """
    # Only return own orders unless admin
    query = select(models.Order).where(models.Order.customer_id == current_user.id).offset(skip).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    return orders

from app.models.order import OrderStatus

@router.get("/roaster", response_model=List[schemas.OrderOut])
async def read_roaster_orders(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
    # In real app, we check which roaster they are staff of.
    # For MVP, assuming user belongs to ONE roaster or we pass roaster_id param.
    # Let's assume we find their membership and get that roaster's orders.
) -> Any:
    """
    Retrieve orders for the user's roaster (Seller View).
    """
    # 1. Find Roaster ID for user (MVP: First one found)
    stmt = select(models.RoasterMembership).where(models.RoasterMembership.user_id == current_user.id)
    result = await db.execute(stmt)
    membership = result.scalars().first()
    
    if not membership:
        raise HTTPException(status_code=403, detail="User is not a roaster staff")
        
    roaster_id = membership.roaster_id

    # 2. Query Orders for this Roaster
    query = select(models.Order).where(models.Order.roaster_id == roaster_id).offset(skip).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    return orders

@router.patch("/{order_id}/status", response_model=schemas.OrderOut)
async def update_order_status(
    *,
    db: AsyncSession = Depends(deps.get_db),
    order_id: str,
    status_in: str = Body(..., embed=True), # e.g. "shipped"
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update order status. Requires Roaster Staff.
    """
    # 1. Get Order
    order = await db.get(models.Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2. Auth Check: User must be staff of order.roaster_id
    # Use our deps helper manually? 
    # Or just query membership directly since we have order.roaster_id
    membership = await deps.get_current_roaster(roaster_id=str(order.roaster_id), current_user=current_user, db=db)
    
    # 3. Update Status
    # Verify status_in is valid Enum?
    try:
        new_status = OrderStatus(status_in)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")

    order.status = new_status
    # TODO: Add history record in OrderStatusHistory
    
    await db.commit()
    await db.refresh(order)
    return order
