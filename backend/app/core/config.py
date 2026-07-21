from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel API"
    VERSION: str = "1.0.0"
    
    DATABASE_URL: str
    REDIS_URL: str
    
    CHROMA_HOST: str
    CHROMA_PORT: int
    
    GEMINI_API_KEY: str
    VERTEX_AI_PROJECT_ID: Optional[str] = None
    VERTEX_AI_LOCATION: Optional[str] = None
    
    class Config:
        env_file = ".env"

settings = Settings()
