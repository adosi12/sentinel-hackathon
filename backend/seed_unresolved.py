from app.db.session import SessionLocal
from app.db.models import Incident
from datetime import datetime

def seed():
    db = SessionLocal()
    
    # Check if we already seeded it
    existing = db.query(Incident).filter(Incident.id == "INC-8492").first()
    if existing:
        print("Already seeded.")
        return
        
    incident = Incident(
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
        created_at=datetime.utcnow()
    )
    
    db.add(incident)
    db.commit()
    print("Seeded INC-8492 successfully.")

if __name__ == "__main__":
    seed()
