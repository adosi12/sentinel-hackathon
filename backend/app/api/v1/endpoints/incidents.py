from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel

from app.db.session import get_db
from app.db.models import Incident
from app.core.schemas import IncidentResponse, IncidentCreate, AlertRequest
from app.services.agents.orchestrator import OrchestratorAgent

router = APIRouter()

@router.get("/", response_model=List[IncidentResponse])
def get_incidents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    incidents = db.query(Incident).offset(skip).limit(limit).all()
    return incidents

@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

from app.api.deps import get_current_user
from app.db.models import User

@router.post("/alert", response_model=IncidentResponse)
def receive_alert(request: AlertRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orchestrator = OrchestratorAgent(db)
    incident_id = orchestrator.process_new_alert(request.raw_alert, triggered_by=current_user.email)
    
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    return incident

@router.post("/{incident_id}/investigate", response_model=IncidentResponse)
def investigate_alert(incident_id: str, db: Session = Depends(get_db)):
    try:
        orchestrator = OrchestratorAgent(db)
        orchestrator.investigate_existing_alert(incident_id)
        
        incident = db.query(Incident).filter(Incident.id == incident_id).first()
        return incident
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

class ProvideInputRequest(BaseModel):
    input: str

@router.post("/{incident_id}/provide-input", response_model=IncidentResponse)
def provide_input(incident_id: str, request: ProvideInputRequest, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    # Simulate processing the human input
    incident.needs_human_input = False
    incident.status = "investigating"
    
    # Update suggested resolution with the human input context
    if incident.suggested_resolution:
        incident.suggested_resolution += f"\n\nHuman Context Applied: {request.input}"
    else:
        incident.suggested_resolution = f"Human Context Applied: {request.input}"
        
    db.commit()
    db.refresh(incident)
    return incident

@router.put("/{incident_id}/resolve", response_model=IncidentResponse)
def mark_resolved(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    incident.status = "resolved"
    incident.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(incident)
    return incident
