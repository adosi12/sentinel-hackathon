from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

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

@router.post("/alert", response_model=IncidentResponse)
def receive_alert(request: AlertRequest, db: Session = Depends(get_db)):
    orchestrator = OrchestratorAgent(db)
    incident_id = orchestrator.process_new_alert(request.raw_alert)
    
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    return incident
