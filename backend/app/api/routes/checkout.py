from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import stripe

from app.core.config import settings
from app.db.session import get_db
from app.models.cart import Cart
from app.models.product import Product
from app.schemas.checkout import CreateCheckoutSessionIn, CreateCheckoutSessionOut

router = APIRouter(prefix="/checkout")

@router.post("/create-session", response_model=CreateCheckoutSessionOut)
async def create_session(payload: CreateCheckoutSessionIn, db: AsyncSession = Depends(get_db)):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe is not configured. Set STRIPE_SECRET_KEY.")
    stripe.api_key = settings.stripe_secret_key

    # Demo: single cart
    cart_res = await db.execute(select(Cart).limit(1))
    cart = cart_res.scalars().first()
    if not cart or len(cart.items) == 0:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Server-side price calculation (do not trust client)
    line_items = []
    for item in cart.items:
        prod = await db.get(Product, item.product_id)
        if not prod:
            continue
        line_items.append({
            "price_data": {
                "currency": "usd",
                "product_data": {"name": prod.name},
                "unit_amount": prod.price_cents,
            },
            "quantity": item.quantity,
        })

    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        customer_email=str(payload.guest_email) if payload.guest_email else None,
        line_items=line_items,
        success_url=f"{settings.frontend_url}/order/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{settings.frontend_url}/cart",
        metadata={"app": "homebrewz"},
    )
    return {"checkout_url": session.url}
