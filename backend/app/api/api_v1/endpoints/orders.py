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
