from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.product import Product
from app.schemas.product import ProductOut

router = APIRouter(prefix="/products")

@router.get("", response_model=list[ProductOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    # Demo: returns seeded products if you add them to DB.
    result = await db.execute(select(Product).order_by(Product.name.asc()))
    return list(result.scalars().all())
