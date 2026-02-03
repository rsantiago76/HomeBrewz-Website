from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app import schemas, models
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.RoasterOut])
async def read_roasters(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve roasters.
    """
    result = await db.execute(select(models.Roaster).offset(skip).limit(limit))
    roasters = result.scalars().all()
    return roasters

from app.models.users import RoasterMembership, RoasterRole

@router.post("/", response_model=schemas.RoasterOut)
async def create_roaster(
    *,
    db: AsyncSession = Depends(deps.get_db),
    roaster_in: schemas.RoasterCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new roaster application.
    Automatically assigns the creator as ROASTER_ADMIN.
    """
    roaster = models.Roaster(
        name=roaster_in.name,
        slug=roaster_in.slug,
        description=roaster_in.description,
        logo_url=roaster_in.logo_url,
        website=roaster_in.website
    )
    db.add(roaster)
    await db.flush() # Get ID

    # Assign Creator as Admin
    membership = RoasterMembership(
        user_id=current_user.id,
        roaster_id=roaster.id,
        role=RoasterRole.ROASTER_ADMIN
    )
    db.add(membership)
    
    await db.commit()
    await db.refresh(roaster)
    return roaster

@router.put("/{roaster_id}", response_model=schemas.RoasterOut)
async def update_roaster(
    *,
    db: AsyncSession = Depends(deps.get_db),
    roaster_id: str,
    roaster_in: schemas.RoasterUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
    # Dependency returns membership if valid, raises 403 otherwise
    membership: RoasterMembership = Depends(deps.get_current_roaster) 
) -> Any:
    """
    Update roaster profile. Requires ROASTER_ADMIN role.
    """
    # Check if Membership is for THIS roaster_id (Dependency handles consistency if we passed roaster_id to it)
    # But deps.get_current_roaster signature needs roaster_id. 
    # FASTAPI dependency resolution with path params is tricky if generic.
    # We might need to call it manually or use a closure. 
    # Actually, if we look at deps.py: `roaster_id: Optional[str] = None`. 
    # If the path param is named `roaster_id`, FastAPI *should* inject it into the dependency if it has the same name.
    
    # Verify Role
    if membership.role != RoasterRole.ROASTER_ADMIN:
         raise HTTPException(status_code=403, detail="Only Roaster Admins can update profile")

    # Fetch Roaster
    result = await db.execute(select(models.Roaster).where(models.Roaster.id == roaster_id))
    roaster = result.scalars().first()
    if not roaster:
        raise HTTPException(status_code=404, detail="Roaster not found")

    if roaster_in.name:
        roaster.name = roaster_in.name
    if roaster_in.description:
        roaster.description = roaster_in.description
    # ... map other fields
    
    await db.commit()
    await db.refresh(roaster)
    return roaster
