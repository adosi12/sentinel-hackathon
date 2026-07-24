from fastapi import FastAPI
from app.routers import ledger, transfer, auth

app = FastAPI(title="Core Banking Gateway API")

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(ledger.router, prefix="/api/v1/ledger", tags=["Ledger"])
app.include_router(transfer.router, prefix="/api/v1/transfer", tags=["Transfer"])

@app.get("/health")
def health_check():
    return {"status": "UP", "service": "core-banking-gateway"}
