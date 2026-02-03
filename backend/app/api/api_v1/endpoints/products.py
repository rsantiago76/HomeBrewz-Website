from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_

from app import schemas, models
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.ProductOut])
async def read_products(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    q: str | None = None
) -> Any:
    """
    Retrieve products.
    """
    query = select(models.Product).where(models.Product.is_active == True)
    
    if q:
        query = query.where(or_(models.Product.name.ilike(f"%{q}%"), models.Product.slug.ilike(f"%{q}%")))
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    products = result.scalars().all()
    # TODO: Eager load variants and images to avoid N+1 if not handled by relationship default lazy='selectin'
    # For now, simplistic approach
    return products

from app.services.audit import AuditService

@router.post("/", response_model=schemas.ProductOut)
async def create_product(
    *,
    db: AsyncSession = Depends(deps.get_db),
    product_in: schemas.ProductCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new product. 
    """
    # 1. Tenancy Check: Verify user is Staff/Admin of the roaster
    # Note: Using deps.get_current_roaster as a function helper here manually since roaster_id is in body
    membership = await deps.get_current_roaster(roaster_id=product_in.roaster_id, current_user=current_user, db=db)
    
    # 2. Create Product
    product = models.Product(
        name=product_in.name,
        slug=product_in.slug,
        description=product_in.description,
        is_active=product_in.is_active,
        category_id=product_in.category_id,
        roaster_id=product_in.roaster_id
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)

    # 3. Create Variants if any
    if product_in.variants:
        for v_in in product_in.variants:
            variant = models.ProductVariant(
                product_id=product.id,
                sku=v_in.sku,
                weight=v_in.weight,
                weight_unit=v_in.weight_unit,
                grind=v_in.grind,
                price_override=v_in.price_override
            )
            db.add(variant)
            await db.flush() # Get ID
            # Inventory
            inventory = models.Inventory(variant_id=variant.id, quantity=v_in.initial_quantity)
            db.add(inventory)
    
    await db.commit()
    await db.refresh(product) # Refresh to load variants?

    # 4. Audit Log
    audit_service = AuditService(db)
    await audit_service.log_action(
        action="CREATE",
        entity_type="Product",
        entity_id=str(product.id),
        actor_user_id=current_user.id,
        roaster_id=product.roaster_id,
        changes=product_in.model_dump(mode='json')
    )
    await db.commit()

    return product
