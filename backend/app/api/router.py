from fastapi import APIRouter
from app.api.routes import products, cart, checkout, orders, webhooks

api_router = APIRouter()
api_router.include_router(products.router, tags=["products"])
api_router.include_router(cart.router, tags=["cart"])
api_router.include_router(checkout.router, tags=["checkout"])
api_router.include_router(orders.router, tags=["orders"])
api_router.include_router(webhooks.router, tags=["webhooks"])
