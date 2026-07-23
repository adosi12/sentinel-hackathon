from app.db.session import SessionLocal
from app.db.models import Incident
from datetime import datetime

def seed():
    db = SessionLocal()
    
    incident_data = dict(
        id="INC-8492",
        title="[CRITICAL] INC-8492 — Payment Gateway — Jackson Deserialization Failure",
        description="""From: monitoring-alerts@bank.internal
To: sre-team@bank.internal, payments-l2-ops@bank.internal
Subject: [CRITICAL] INC-8492 — Payment Gateway — Jackson Deserialization Failure

CRITICAL A production incident has been raised in payment-gateway.

Error: java.lang.NoSuchMethodError: com.fasterxml.jackson.databind.ObjectMapper.readTree...
Trans ID: TXN_98765
Impact: Critical — SLA breach risk

Sentinel AI is beginning autonomous investigation. Reference: INC0094821""",
        status="unresolved",
        severity="CRITICAL",
        application="payment-gateway",
        component="payment-gateway",
        needs_human_input=True,
        human_prompt="There are conflicting Jackson dependencies in the recent deployment. Was the Jackson library version pinned across all modules in the latest release?",
        confidence_score=45.0
    )
    
    existing = db.query(Incident).filter(Incident.id == "INC-8492").first()
    if existing:
        for k, v in incident_data.items():
            setattr(existing, k, v)
        db.commit()
        print("Updated INC-8492 successfully.")
    else:
        incident_data['created_at'] = datetime.utcnow()
        incident = Incident(**incident_data)
        db.add(incident)
        db.commit()
        print("Seeded INC-8492 successfully.")

if __name__ == "__main__":
    seed()
