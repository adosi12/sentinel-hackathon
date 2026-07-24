# Banking Realistic Incident Scenarios

These are fictional but realistic enterprise banking incidents for demos.

## SWIFT Payment Stuck
Symptoms: MT103 queue backlog, payment latency, MQ timeout.
Root Cause: MQ channel unavailable after maintenance.
Resolution: Restart channel and replay messages.

## Letter of Credit Upload Failed
Symptoms: HTTP 413, upload failure.
Root Cause: Reverse proxy upload size limit.
Resolution: Increase upload limit.

## Bank Guarantee OCR Failure
Symptoms: Empty OCR fields.
Root Cause: Poor scan quality.
Resolution: Better preprocessing and rescanning.

## Duplicate Invoice Processing
Root Cause: Duplicate detection based only on filename.
Resolution: Hash normalized invoice content.

## FX Rate Not Updated
Root Cause: Scheduler failure after DST.
Resolution: Fix cron and rerun sync.

## Sanctions Screening Timeout
Root Cause: Third-party API latency.
Resolution: Cache results and circuit breaker.

## Oracle Connection Pool Exhausted
Root Cause: Connection leak.
Resolution: Patch code and increase pool.

## Kafka Consumer Lag
Root Cause: Consumer rebalance.
Resolution: Restart consumers.

## Redis Memory Exhaustion
Root Cause: No eviction policy.
Resolution: Enable LRU.

## Common Trade Finance Issues
- Invalid IBAN
- Expired Letter of Credit
- SWIFT MT700 parsing error
- Missing beneficiary
- Shipment date mismatch
- Currency mismatch
- Signature verification failure
- Duplicate invoice
- Corrupted PDF/TIFF
- OCR extraction mismatch

## Suggested Demo Assets
For each scenario prepare email, logs, metrics, traces, topology map, deployment diff, config diff, AI RCA, patch, ticket, and postmortem.