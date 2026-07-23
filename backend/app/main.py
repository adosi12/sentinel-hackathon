from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import incidents, auth
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

from pydantic import BaseModel
import os

class PatchRequest(BaseModel):
    target: str

@app.post("/api/repo/apply-patch")
async def apply_patch(req: PatchRequest):
    if req.target == 'ledger_service':
        file_path = os.path.join(
            "D:\\", "2026Projects", "AimToApply", "sentinel-hackathon",
            "data", "sample_repo", "core-banking-gateway", "app", "routers", "ledger.py"
        )
        
        if not os.path.exists(file_path):
            return {"error": "File not found"}
            
        with open(file_path, "r") as f:
            content = f.read()
            
        # The patching logic: replace the buggy comment and add the finally block
        patch_target = "        # finally:\n        #     if 'db_cursor' in locals():\n        #         db_cursor.close()"
        if patch_target in content:
            # We are applying the SUGGESTED_PATCH
            content = content.replace(
                patch_target,
                "        finally:\n            if 'db_cursor' in locals():\n                db_cursor.close()"
            )
            
            with open(file_path, "w") as f:
                f.write(content)
                
            import subprocess, uuid
            branch_name = f"patch-{uuid.uuid4().hex[:8]}"
            repo_path = os.path.join("D:\\", "2026Projects", "AimToApply", "sentinel-hackathon")
            try:
                subprocess.run(["git", "checkout", "-b", branch_name], cwd=repo_path, check=True, capture_output=True)
                subprocess.run(["git", "add", file_path], cwd=repo_path, check=True, capture_output=True)
                subprocess.run(["git", "commit", "-m", "AI Patch: Fix connection pool leak"], cwd=repo_path, check=True, capture_output=True)
                pr_url = f"https://github.com/amityd/sentinel-hackathon/compare/main...{branch_name}"
                return {"status": "success", "message": "PR Raised", "pr_url": pr_url}
            except subprocess.CalledProcessError as e:
                return {"error": "Git operation failed: " + str(e.stderr)}
        else:
            return {"status": "info", "message": "Patch already applied or code not found"}

    return {"error": "Unknown target"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "service": "Sentinel API"}

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(incidents.router, prefix="/api/v1/incidents", tags=["Incidents"])
