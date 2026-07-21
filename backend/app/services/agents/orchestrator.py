from app.services.agents.intake import analyze_incident_intake, IncidentIntakeResult
from app.services.agents.rca import generate_rca
from app.db.models import Incident, Log
from sqlalchemy.orm import Session
from datetime import datetime

class OrchestratorAgent:
    def __init__(self, db: Session):
        self.db = db
        
    def process_new_alert(self, raw_alert: str) -> str:
        # Step 1: Intake Analysis
        intake_result = analyze_incident_intake(raw_alert)
        
        # Step 2: Create Incident in DB
        # This simulates creating the incident before we search for logs and do RCA
        incident = Incident(
            id=f"INC-{int(datetime.utcnow().timestamp())}",
            title=intake_result.title,
            description=intake_result.summary,
            severity=intake_result.severity,
            application=intake_result.application,
            component=intake_result.component,
            status="investigating"
        )
        self.db.add(incident)
        self.db.commit()
        
        # Step 3: Trigger downstream agents (Log Analysis, Repo Analysis, RCA)
        # This would typically be pushed to Celery, but we'll run synchronously for demonstration
        
        # Retrieve context from Vector Store
        from app.services.vector_store import vector_store
        
        # Search for similar historical incidents based on the incoming summary
        similar_incidents = vector_store.search_similar_incidents(query_text=intake_result.summary, n_results=2)
        
        logs_summary = f"Simulated logs for {incident.application} - {incident.component}: Anomaly detected."
        
        # Step 4: RCA Generation
        rca_result = generate_rca(
            incident_context={"title": incident.title, "application": incident.application, "summary": incident.description},
            logs_summary=logs_summary,
            historical_matches=similar_incidents
        )
        
        incident.confidence_score = rca_result.get("confidence", 0.0)
        incident.suggested_resolution = rca_result.get("suggested_resolution", "")
        incident.status = "open"
        self.db.commit()
        
        return incident.id
