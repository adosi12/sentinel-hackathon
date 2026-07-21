import json
import random
from datetime import datetime, timedelta
import uuid

# Synthetic Enterprise Banking Data Generator

SERVICES = [
    "API Gateway", "Authentication", "Certificate Manager", "MQ", "Kafka",
    "Settlement", "Core Banking", "Notification", "SWIFT Gateway", "Payments",
    "Treasury", "Reference Data"
]

COMPONENTS = {
    "API Gateway": ["Nginx", "Kong", "WAF"],
    "Authentication": ["OAuth Service", "LDAP Sync", "JWT Issuer"],
    "Certificate Manager": ["Vault", "Certbot", "TLS Terminator"],
    "MQ": ["RabbitMQ", "IBM MQ", "ActiveMQ"],
    "Kafka": ["Broker", "Zookeeper", "Schema Registry"],
    "Settlement": ["Ledger", "Reconciliation engine", "Clearing"],
    "Core Banking": ["Oracle DB", "Mainframe adapter", "Account Service"],
    "Notification": ["SMS Service", "Email Gateway", "Slack App"],
    "SWIFT Gateway": ["Alliance Access", "Message Parser", "Signature Validator"],
    "Payments": ["SEPA Engine", "Fedwire Adapter", "Cross-Border"],
    "Treasury": ["Liquidity Engine", "Forex Pricer", "Risk Engine"],
    "Reference Data": ["Market Data Sync", "Instrument Service", "Counterparty DB"]
}

SCENARIOS = [
    {"title": "MQ connection refused after certificate renewal", "root_cause": "TLS handshake failed due to expired intermediate certificate in the trust store.", "severity": "High"},
    {"title": "Kafka Consumer Lag Spiking", "root_cause": "Database connection pool exhaustion in Downstream Settlement service.", "severity": "Critical"},
    {"title": "Oracle DB Connectivity Timeout", "root_cause": "Network firewall rule updated improperly blocking port 1521.", "severity": "Critical"},
    {"title": "SWIFT Message parsing failure", "root_cause": "New schema rollout introduced a backwards-incompatible date format.", "severity": "High"},
    {"title": "Payment API Gateway 502 Bad Gateway", "root_cause": "Upstream Core Banking service scaling event caused temporary pod unreadiness.", "severity": "Medium"}
]

def generate_incidents(count=20):
    incidents = []
    for i in range(count):
        scenario = random.choice(SCENARIOS)
        app = random.choice(SERVICES)
        comp = random.choice(COMPONENTS[app])
        created_at = datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
        
        incident = {
            "id": f"INC-{1000 + i}",
            "title": scenario["title"],
            "description": f"Incident reported in {app} - {comp}. Users experiencing errors.",
            "status": random.choice(["open", "resolved", "investigating"]),
            "severity": scenario["severity"],
            "application": app,
            "component": comp,
            "created_at": created_at.isoformat(),
            "resolved_at": (created_at + timedelta(hours=random.randint(1, 10))).isoformat() if random.choice([True, False]) else None,
            "confidence_score": round(random.uniform(0.6, 0.99), 2),
            "suggested_resolution": f"Based on historical data for {scenario['title']}, the root cause is likely: {scenario['root_cause']}\n\nRecommended Action: Apply standard runbook for {comp} restart and verify upstream dependencies.",
            "mttr_saved": round(random.uniform(1.0, 5.0), 1),
            "est_customers_impacted": random.randint(100, 10000),
            "est_financial_exposure": round(random.uniform(10000, 500000), 2)
        }
        incidents.append(incident)
    return incidents

def save_data(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Saved {filename}")

if __name__ == "__main__":
    print("Generating Synthetic Enterprise Banking Data for Sentinel...")
    incidents = generate_incidents(50)
    save_data(incidents, "synthetic_incidents.json")
    print("Data generation complete.")
