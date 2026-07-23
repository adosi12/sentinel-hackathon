# Inject Investigation - Demo Scenarios

These are copy-pasteable scenarios designed to be used with the **"Inject Investigation"** feature in Sentinel AI. They simulate unstructured PagerDuty alerts, emails, or Slack messages from production.

Simply copy the text block from any scenario and paste it into the simulator.

---

### Scenario 1: SWIFT Payment Stuck (Message Queue)
**Context:** A critical backlog in the payment gateway.
```text
URGENT: We are seeing a massive backlog in the MT103 payment queue. The Payment Gateway service is throwing repeated MQ timeout exceptions. Latency is spiking and downstream processing is stalled. This started happening right after the weekend database maintenance window. We need an RCA immediately as we are at risk of a critical SLA breach for international transfers.
```

### Scenario 2: Mobile App Login Failures
**Context:** High latency on the mobile auth gateway.
```text
PagerDuty Alert [CRITICAL]: p99 latency on the mobile-api-gateway is exceeding 4000ms. Users on Twitter are complaining that the mobile app is hanging when they try to log in, and eventually throwing a 504 Gateway Timeout. The issue seems isolated to the /api/v1/auth/login endpoint. No recent deployments on the auth service.
```

### Scenario 3: Database Connection Exhaustion
**Context:** Core banking database is running out of connections.
```text
AWS CloudWatch Alert: The core-banking-rds PostgreSQL instance is currently at 95% of its max_connections limit. We are seeing intermittent "FATAL: sorry, too many clients already" errors in the core banking application logs. CPU and Memory look stable, but the connection count spiked suddenly about 15 minutes ago.
```

### Scenario 4: Letter of Credit Upload Failure
**Context:** Customers failing to upload large documents.
```text
Zendesk Escalation: We have received 15 tickets in the last hour from corporate clients who are unable to upload their Letter of Credit PDF documents to the Trade Finance portal. The network tab shows they are receiving an HTTP 413 Payload Too Large error when uploading files over 5MB. 
```

### Scenario 5: Sanctions Screening Timeout
**Context:** Third-party API dependency failure.
```text
Datadog Monitor [HIGH]: The Sanctions Screening microservice is experiencing a 100% failure rate. The logs show repeated ReadTimeoutExceptions when calling the external OFAC compliance API. Trade settlements are currently blocked because they cannot pass the mandatory screening step.
```

### Scenario 6: Kafka Consumer Lag
**Context:** Asynchronous event processing failure.
```text
Alertmanager [WARNING]: The Kafka consumer lag for the `fx-rates-sync` topic has crossed the threshold of 100,000 messages. The downstream FX pricing service is serving stale conversion rates. The consumer group appears to be stuck in a continuous rebalance loop.
```
