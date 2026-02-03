from fastapi import APIRouter, Request, HTTPException
import stripe
from app.core.config import settings

router = APIRouter(prefix="/webhooks")

@router.post("/stripe")
async def stripe_webhook(request: Request):
    # NOTE: This is a scaffold. Add signature verification + order creation logic.
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe webhook secret not configured.")
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.stripe_webhook_secret)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")

    # TODO: handle checkout.session.completed and create Order atomically.
    return {"received": True, "type": event.get("type")}
