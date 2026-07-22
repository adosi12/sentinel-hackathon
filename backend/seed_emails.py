from app.db.session import SessionLocal
from app.db.models import Incident
from datetime import datetime, timedelta

def seed():
    db = SessionLocal()
    
    # 1. Set ALL existing incidents to 'resolved'
    db.query(Incident).update({"status": "resolved"})
    
    # 2. Add 3 new completely untested Unresolved incidents
    unresolved_incidents = [
        {
            "id": "INC-8501",
            "title": "[CRITICAL] Authentication Service - Rate Limit Exceeded & 502s",
            "description": "From: datadog-alerts@bank.internal\nTo: oncall-auth@bank.internal\nSubject: [CRITICAL] INC-8501 - Authentication Service - Rate Limit Exceeded & 502s\n\nCRITICAL A production incident has been raised in Authentication.\n\nError: nginx upstream prematurely closed connection while reading response header from upstream\nImpact: Users cannot log into the mobile app. Drop in active sessions by 40%.\n\nSentinel AI is pending autonomous investigation.",
            "severity": "CRITICAL",
            "application": "Authentication",
            "component": "API Gateway",
            "status": "unresolved"
        },
        {
            "id": "INC-8502",
            "title": "[HIGH] RabbitMQ - Queue Backlog for Settlement Worker",
            "description": "From: aws-cloudwatch@bank.internal\nTo: sre-team@bank.internal\nSubject: [HIGH] INC-8502 - RabbitMQ - Queue Backlog for Settlement Worker\n\nHIGH A production incident has been raised in Settlement.\n\nError: Worker CPU stuck at 99%. Queue depth > 50,000 for 'settlement_dlq'.\nImpact: Transactions are succeeding but funds are not settling into merchant accounts.\n\nSentinel AI is pending autonomous investigation.",
            "severity": "HIGH",
            "application": "Settlement",
            "component": "RabbitMQ (MQ)",
            "status": "unresolved"
        },
        {
            "id": "INC-8503",
            "title": "[MEDIUM] Certificate Manager - SSL Handshake Failures",
            "description": "From: monitoring@bank.internal\nTo: security-ops@bank.internal\nSubject: [MEDIUM] INC-8503 - Certificate Manager - SSL Handshake Failures\n\nMEDIUM A production incident has been raised in Certificate Manager.\n\nError: SSLV3_ALERT_CERTIFICATE_EXPIRED\nImpact: Third-party webhooks failing to reach our legacy endpoints.\n\nSentinel AI is pending autonomous investigation.",
            "severity": "MEDIUM",
            "application": "Certificate Manager",
            "component": "Certificate Manager",
            "status": "unresolved"
        }
    ]

    for data in unresolved_incidents:
        existing = db.query(Incident).filter(Incident.id == data["id"]).first()
        if existing:
             db.delete(existing)
        
        inc = Incident(
            id=data["id"],
            title=data["title"],
            description=data["description"],
            severity=data["severity"],
            application=data["application"],
            component=data["component"],
            status=data["status"],
            created_at=datetime.utcnow() - timedelta(minutes=5),
            est_customers_impacted=0,
            est_financial_exposure=0.0,
            mttr_saved=0.0
        )
        db.add(inc)
    
    db.commit()
    print("Seeded 3 new unresolved incidents and marked all others resolved.")

if __name__ == "__main__":
    seed()
