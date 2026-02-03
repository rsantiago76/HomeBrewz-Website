from fastapi import APIRouter
from app.api.api_v1.endpoints import users, roasters, products, orders

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(roasters.router, prefix="/roasters", tags=["roasters"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
from app.api.api_v1.endpoints import cart, checkout
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(checkout.router, prefix="/checkout", tags=["checkout"])
