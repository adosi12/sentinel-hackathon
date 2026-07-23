from app.db.session import SessionLocal
from app.db.models import Incident
from datetime import datetime

def seed():
    db = SessionLocal()
    
    incidents = [
        dict(
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
        ),
        dict(
            id="INC-8501",
            title="[HIGH] INC-8501 — Mobile App — Login API Latency Spike",
            description="""From: datadog-alerts@bank.internal
To: oncall-mobile@bank.internal
Subject: [HIGH] INC-8501 — Mobile App — Login API Latency Spike

HIGH Alert triggered on mobile-api-gateway

Metric: p99 latency > 4000ms
Service: /api/v1/auth/login
Impact: High — Users experiencing timeouts during login

Sentinel AI is beginning autonomous investigation. Reference: INC0094833""",
            status="unresolved",
            severity="HIGH",
            application="Mobile App",
            component="Auth Service",
            needs_human_input=False,
            human_prompt=None,
            confidence_score=0.0
        ),
        dict(
            id="INC-8502",
            title="[MEDIUM] INC-8502 — Core Banking — Database Connections Near Limit",
            description="""From: aws-cloudwatch@bank.internal
To: db-admins@bank.internal
Subject: [MEDIUM] INC-8502 — Core Banking — Database Connections Near Limit

MEDIUM Alert triggered on core-banking-rds

Metric: DatabaseConnections > 90% of max_connections
Impact: Medium — Potential new connection rejections

Sentinel AI is beginning autonomous investigation. Reference: INC0094844""",
            status="unresolved",
            severity="MEDIUM",
            application="Core Banking",
            component="PostgreSQL RDS",
            needs_human_input=False,
            human_prompt=None,
            confidence_score=0.0
        )
    ]
    
    for incident_data in incidents:
        existing = db.query(Incident).filter(Incident.id == incident_data["id"]).first()
        if existing:
            for k, v in incident_data.items():
                setattr(existing, k, v)
            db.commit()
            print(f"Updated {incident_data['id']} successfully.")
        else:
            incident_data['created_at'] = datetime.utcnow()
            incident = Incident(**incident_data)
            db.add(incident)
            db.commit()
            print(f"Seeded {incident_data['id']} successfully.")

if __name__ == "__main__":
    seed()
