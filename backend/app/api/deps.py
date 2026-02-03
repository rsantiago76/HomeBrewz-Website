from typing import Annotated, Optional, List, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError

from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.models.users import User, RoasterMembership, UserRole, RoasterRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.verifier.verify_token_easy(token)
        username: str = payload.get("username") or payload.get("sub")
        if username is None:
            raise credentials_exception
        token_sub = payload.get("sub")
    except (JWTError, ValueError) as e:
        # Log error in production
        raise credentials_exception

    result = await db.execute(select(User).where(User.sub == token_sub))
    user = result.scalars().first()

    if user is None:
        # JIT Provisioning
        user = User(
            sub=token_sub, 
            email=payload.get("email"), 
            full_name=payload.get("name")
        )
        db.add(user)
        try:
            await db.commit()
            await db.refresh(user)
        except Exception:
             await db.rollback()
             raise credentials_exception
        
    return user

async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    if current_user.is_deleted:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_active_superuser(
    current_user: Annotated[User, Depends(get_current_active_user)]
) -> User:
    if current_user.role != UserRole.SITE_ADMIN:
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return current_user

def require_role(allowed_roles: List[UserRole]) -> Callable[[User], User]:
    def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted")
        return current_user
    return role_checker

async def get_current_roaster(
    roaster_id: Optional[str] = None, 
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> RoasterMembership:
    """
    Dependency to verify if the current user is a member of the target roaster.
    """
    if not roaster_id:
         return None 
    
    stmt = select(RoasterMembership).where(
        RoasterMembership.user_id == current_user.id,
        RoasterMembership.roaster_id == roaster_id
    )
    result = await db.execute(stmt)
    membership = result.scalars().first()
    
    # Allow SITE_ADMIN to bypass?
    if not membership and current_user.role != UserRole.SITE_ADMIN:
        raise HTTPException(status_code=403, detail="Not a member of this roaster")
    
    # If Site Admin bypasses, we need dummy membership or handle it.
    # For now, strict membership.
    if not membership and current_user.role == UserRole.SITE_ADMIN:
        # Fake membership for admin bypass
        # CAUTION: This might break if caller expects persistent object
        return RoasterMembership(role=RoasterRole.ROASTER_ADMIN, user_id=current_user.id, roaster_id=roaster_id)

    if not membership:
         raise HTTPException(status_code=403, detail="Not a member of this roaster")

    return membership
