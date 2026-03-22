"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings
from pydantic import field_validator
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings."""

    APP_NAME: str = "MedAssist Global AI Services"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-3.5-turbo"

    REDIS_URL: str = "redis://localhost:6379"

    PORT: int = 8000
    HOST: str = "0.0.0.0"

    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    MODEL_PATH: str = "trained_models"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
