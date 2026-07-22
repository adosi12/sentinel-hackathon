UPDATE incidents
SET description = E'From: datadog-alerts@bank.internal\nTo: oncall-auth@bank.internal, sre-team@bank.internal\nSubject: [CRITICAL] INC-8501 — Authentication Service Rate Limit Exceeded & 502s\n\nCRITICAL A production incident has been raised in Authentication.\n\nError details detected in API Gateway:\nThe nginx upstream is prematurely closing connections while reading response headers, resulting in a cascade of 502 Bad Gateway errors across the authentication endpoints. The rate limiting filter is simultaneously dropping 60% of incoming token refresh requests.\n\nTrans ID: N/A\nImpact: Critical — Users cannot log into the mobile app. Drop in active sessions by 40%. SLA Breach risk.'
WHERE id = 'INC-8501';

UPDATE incidents
SET description = E'From: aws-cloudwatch@bank.internal\nTo: sre-team@bank.internal, payments-l2-ops@bank.internal\nSubject: [HIGH] INC-8502 — RabbitMQ Queue Backlog for Settlement Worker\n\nHIGH A production incident has been raised in Settlement.\n\nError details detected in RabbitMQ (MQ):\nThe settlement worker nodes are experiencing CPU exhaustion (stuck at 99%) and failing to process incoming webhooks. The message queue depth has exceeded 50,000 for the ''settlement_dlq'' dead letter queue.\n\nTrans ID: BATCH_88291\nImpact: High — Transactions are succeeding at the gateway but funds are not settling into merchant accounts.'
WHERE id = 'INC-8502';

UPDATE incidents
SET description = E'From: monitoring@bank.internal\nTo: security-ops@bank.internal, sre-team@bank.internal\nSubject: [MEDIUM] INC-8503 — Certificate Manager SSL Handshake Failures\n\nMEDIUM A production incident has been raised in Certificate Manager.\n\nError details detected in Certificate Manager:\nExternal integration partners are reporting connection drops with SSLV3_ALERT_CERTIFICATE_EXPIRED when attempting to establish TLS connections to the legacy webhook receiver endpoints.\n\nTrans ID: WEBHOOK_911\nImpact: Medium — Third-party integrations failing to reach legacy endpoints, causing localized data sync delays.'
WHERE id = 'INC-8503';
