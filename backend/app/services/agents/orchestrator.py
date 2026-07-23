from app.services.agents.intake import analyze_incident_intake, IncidentIntakeResult
from app.services.agents.rca import generate_rca
from app.db.models import Incident, Log
from sqlalchemy.orm import Session
from datetime import datetime

class OrchestratorAgent:
    def __init__(self, db: Session):
        self.db = db
        
    def process_new_alert(self, raw_alert: str, triggered_by: str = None) -> str:
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
            status="simulated",
            est_customers_impacted=0,
            est_financial_exposure=0.0,
            mttr_saved=0.0,
            triggered_by=triggered_by
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
        try:
            rca_result = generate_rca(
                incident_context={"title": incident.title, "application": incident.application, "summary": incident.description},
                logs_summary=logs_summary,
                historical_matches=similar_incidents
            )
            
            incident.confidence_score = rca_result.get("confidence", 0.0)
            incident.suggested_resolution = rca_result.get("suggested_resolution", "")
            incident.impacted_services = rca_result.get("impacted_services", [])
            
            # Save generated notification contents
            incident.jira_content = rca_result.get("jira_ticket_content", "")
            incident.slack_content = rca_result.get("slack_message_content", "")
            incident.email_content = rca_result.get("email_notification_content", "")
        except Exception as e:
            # Fallback if API rate limits are hit
            print(f"API Error during RCA generation: {e}")
            incident.confidence_score = 0.99
            incident.suggested_resolution = "API Quota Exceeded! Could not generate a dynamic RCA. Please check billing settings."
            incident.impacted_services = [incident.component]
            incident.jira_content = "API Quota Exceeded. Ticket generation failed."
            incident.slack_content = "API Quota Exceeded. Notification failed."
            incident.email_content = "API Quota Exceeded. Email generation failed."
        
        incident.status = "simulated"
        self.db.commit()
        
        return incident.id

    def investigate_existing_alert(self, incident_id: str) -> str:
        # Fetch the existing unresolved incident
        incident = self.db.query(Incident).filter(Incident.id == incident_id).first()
        if not incident:
            raise ValueError(f"Incident {incident_id} not found")
            
        # The description holds the raw email text. We parse it.
        raw_alert = incident.description
        
        # Step 1: Intake Analysis
        intake_result = analyze_incident_intake(raw_alert)
        
        # Update incident with extracted structure
        incident.title = intake_result.title
        incident.description = intake_result.summary
        incident.severity = intake_result.severity
        incident.application = intake_result.application
        incident.component = intake_result.component
        
        # Step 2: RCA Generation
        from app.services.vector_store import vector_store
        similar_incidents = vector_store.search_similar_incidents(query_text=intake_result.summary, n_results=2)
        logs_summary = f"Simulated logs for {incident.application} - {incident.component}: Anomaly detected."
        
        try:
            rca_result = generate_rca(
                incident_context={"title": incident.title, "application": incident.application, "summary": incident.description},
                logs_summary=logs_summary,
                historical_matches=similar_incidents
            )
            
            incident.confidence_score = rca_result.get("confidence", 0.0)
            incident.suggested_resolution = rca_result.get("suggested_resolution", "")
            incident.impacted_services = rca_result.get("impacted_services", [])
            
            # Save generated notification contents
            incident.jira_content = rca_result.get("jira_ticket_content", "")
            incident.slack_content = rca_result.get("slack_message_content", "")
            incident.email_content = rca_result.get("email_notification_content", "")
        except Exception as e:
            print(f"API Error during RCA generation: {e}")
            incident.confidence_score = 0.99
            incident.suggested_resolution = "API Quota Exceeded! Could not generate a dynamic RCA. Please check billing settings."
            incident.impacted_services = [incident.component]
            incident.jira_content = "API Quota Exceeded. Ticket generation failed."
            incident.slack_content = "API Quota Exceeded. Notification failed."
            incident.email_content = "API Quota Exceeded. Email generation failed."
        
        # Mark as resolved
        incident.status = "investigating"
        self.db.commit()
        
        return incident.id
