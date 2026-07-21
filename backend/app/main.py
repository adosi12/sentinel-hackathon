from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import incidents
from app.db.session import engine
from app.db.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sentinel API",
    description="AI Assisted Incident Intelligence & Root Cause Analysis Platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "service": "Sentinel API"}

app.include_router(incidents.router, prefix="/api/v1/incidents", tags=["Incidents"])
