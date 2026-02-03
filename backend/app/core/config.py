from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/homebrewz"
    jwt_secret: str = "change-me"
    frontend_url: str = "http://localhost:5173"

    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None

    # AWS Cognito
    cognito_region: str = "us-east-1"
    cognito_user_pool_id: str = "us-east-1_xxxxxxxxx"
    cognito_client_id: str = "xxxxxxxxxxxxxxxxxxxxxxxxxx"

settings = Settings()
