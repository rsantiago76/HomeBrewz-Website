from fastapi import APIRouter, HTTPException
from app.schemas.checkout import CreateCheckoutSessionOut

router = APIRouter(prefix="/orders")

@router.get("/{order_id}")
async def get_order(order_id: str, token: str | None = None):
    # Scaffold: replace with real DB lookup + guest token verification.
    raise HTTPException(status_code=501, detail="Order lookup not implemented yet.")
