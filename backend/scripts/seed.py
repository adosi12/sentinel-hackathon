import json
import os
import sys
from datetime import datetime

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.db.models import Incident
from app.db.session import engine
from app.db.models import Base

def seed_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Reading synthetic_incidents.json...")
    filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "synthetic_incidents.json")
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return

    with open(filepath, "r") as f:
        incidents_data = json.load(f)

    db = SessionLocal()
    try:
        for data in incidents_data:
            # Check if incident already exists
            existing = db.query(Incident).filter(Incident.id == data["id"]).first()
            if not existing:
                incident = Incident(
                    id=data["id"],
                    title=data["title"],
                    description=data["description"],
                    status=data["status"],
                    severity=data["severity"],
                    application=data["application"],
                    component=data["component"],
                    created_at=datetime.fromisoformat(data["created_at"]),
                    resolved_at=datetime.fromisoformat(data["resolved_at"]) if data.get("resolved_at") else None,
                    confidence_score=data.get("confidence_score"),
                    suggested_resolution=data.get("suggested_resolution"),
                    mttr_saved=data.get("mttr_saved"),
                    est_customers_impacted=data.get("est_customers_impacted"),
                    est_financial_exposure=data.get("est_financial_exposure")
                )
                db.add(incident)
                
                # Also index in Vector Store for RAG
                try:
                    from app.services.vector_store import vector_store
                    
                    # Extract a mock root cause from the suggested resolution if possible
                    root_cause = "Unknown root cause"
                    if incident.suggested_resolution and "root cause is likely:" in incident.suggested_resolution:
                        parts = incident.suggested_resolution.split("root cause is likely:")
                        root_cause = parts[1].split("\n\n")[0].strip()
                        
                    vector_store.index_incident(
                        incident_id=incident.id,
                        title=incident.title,
                        description=incident.description,
                        resolution=incident.suggested_resolution or "No resolution provided",
                        root_cause=root_cause
                    )
                except Exception as e:
                    print(f"Warning: Failed to index incident {incident.id} into ChromaDB: {e}")

        db.commit()
        print(f"Successfully inserted {len(incidents_data)} incidents into the database.")
    except Exception as e:
        db.rollback()
        print(f"Error inserting data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
