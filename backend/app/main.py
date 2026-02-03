from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.api_v1.api import api_router

def create_app() -> FastAPI:
    app = FastAPI(
        title="HomeBrewz API",
        version="0.1.0",
        openapi_url="/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS: lock down in production to your Amplify domain(s)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_url] if settings.frontend_url else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/api/v1")
    return app

app = create_app()
