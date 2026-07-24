# PROMPT: Generate Sample Banking Microservices Repository (`data/sample_repo/`)

Create a realistic banking microservices repository containing 3 services and 15 distinct business execution flows, intentionally embedding 15 real-world production incident patterns (system-level and flow-level).

---

## 📂 Target Directory Structure

```text
data/sample_repo/
├── order-payment-service/          # Spring Boot / Java Service
│   ├── src/main/java/com/bank/payment/
│   │   ├── controller/
│   │   │   ├── PaymentController.java
│   │   │   ├── AccountController.java
│   │   │   └── CardController.java
│   │   ├── service/
│   │   │   ├── PaymentProcessorService.java
│   │   │   ├── FXCalculationService.java
│   │   │   ├── FraudCheckService.java
│   │   │   ├── AccountService.java
│   │   │   └── CardService.java
│   │   ├── client/
│   │   │   ├── CoreBankingClient.java
│   │   │   └── PaymentGatewayClient.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   └── ConnectionPoolConfig.java
│   │   └── Application.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── core-banking-gateway/           # Python / FastAPI Service
│   ├── app/
│   │   ├── routers/
│   │   │   ├── ledger.py
│   │   │   ├── transfer.py
│   │   │   └── auth.py
│   │   ├── services/
│   │   │   ├── ledger_service.py
│   │   │   ├── transfer_service.py
│   │   │   └── token_service.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   └── main.py
│   ├── uat.env
│   ├── prod.env
│   └── requirements.txt
│
└── notification-audit-service/     # Node.js / Express Microservice
    ├── src/
    │   ├── controllers/
    │   │   ├── emailController.js
    │   │   ├── smsController.js
    │   │   └── auditLogController.js
    │   ├── services/
    │   │   ├── queueConsumer.js
    │   │   ├── VaultManager.js
    │   │   └── DatabasePool.js
    │   └── app.js
    └── package.json
```

---

## 🌊 15 Required Business Flows & Error-Prone Production Patterns

Each flow must contain an identifiable production bug/anti-pattern, structured logs with trace IDs, and configurable parameters:

### 1. Foreign Exchange (FX) Cross-Border Payment Flow (`FXCalculationService.java`)
- **System Pattern**: Integer overflow / Division by Zero on zero-rate currency lookup.
- **Root Cause**: Missing check for unmapped currency pairs resulting in rate `0.0`.
- **Log Signature**: `ArithmeticException: / by zero at FXCalculationService.java:48`

### 2. Real-Time Account Ledger Sync Flow (`ledger_service.py`)
- **System Pattern**: Database Connection Pool Exhaustion under high concurrency.
- **Root Cause**: Unclosed DB transaction cursor in `get_account_balance()` inside exception block.
- **Log Signature**: `TimeoutError: QueuePool limit of size 10 overflow 10 reached`

### 3. OTP & SMS Notification Dispatch Flow (`smsController.js`)
- **System Pattern**: Hardcoded SSL/TLS Certificate Expiration & Keystore failure.
- **Root Cause**: Expired self-signed cert path in HTTPS agent when calling SMS gateway provider.
- **Log Signature**: `FetchError: CA certificate expired or invalid (CERT_HAS_EXPIRED)`

### 4. International SwiftWire Clearing Flow (`CoreBankingClient.java`)
- **Flow Pattern**: HTTP Client Socket Timeout mismatch between UAT (60s) and PROD (2s).
- **Root Cause**: `readTimeout` set to `2000ms` in PROD `application.properties` while Swift response takes ~3500ms.
- **Log Signature**: `java.net.SocketTimeoutException: Read timed out after 2000ms`

### 5. User Authentication & Token Refresh Flow (`auth.py`)
- **Flow Pattern**: JWT Secret Key mismatch between Microservices.
- **Root Cause**: Gateway signs token with `PROD_SECRET_V2`, Payment service parses with staled `PROD_SECRET_V1`.
- **Log Signature**: `jwt.exceptions.InvalidSignatureError: Signature verification failed`

### 6. High-Value Fraud Detection Check Flow (`FraudCheckService.java`)
- **System Pattern**: Memory Leak due to static Unbounded Cache (`HashMap`).
- **Root Cause**: Transaction history cache never clears elements, triggering Heap Space OutOfMemory error.
- **Log Signature**: `java.lang.OutOfMemoryError: Java heap space at FraudCheckService.java:112`

### 7. Automated Direct Debit Retry Flow (`queueConsumer.js`)
- **System Pattern**: Kafka / MQ Poison Pill & Infinite Dead-Letter Queue Loop.
- **Root Cause**: Consumer fails to deserialize malformed JSON payload without catching `SyntaxError`, failing back onto queue infinitely.
- **Log Signature**: `SyntaxError: Unexpected token in JSON at position 0 - Infinite retry triggered`

### 8. Vault API Credential & Key Rotation Flow (`VaultManager.js`)
- **System Pattern**: Vault Token Expiration without Auto-Renewal.
- **Root Cause**: Expired Vault secret lease path resulting in HTTP 403 Forbidden on database credential fetch.
- **Log Signature**: `VaultError: client token expired - permission denied HTTP 403`

### 9. Debit Card Transaction Authorization Flow (`CardService.java`)
- **Flow Pattern**: Race condition / Deadlock on Account Balance row updates.
- **Root Cause**: Inconsistent lock ordering (`accountA -> accountB` vs `accountB -> accountA`).
- **Log Signature**: `org.hibernate.exception.LockAcquisitionException: Deadlock detected when trying to get lock`

### 10. Audit Compliance Log Archival Flow (`auditLogController.js`)
- **System Pattern**: Disk I/O Block / File Descriptor Leak.
- **Root Cause**: Write stream created on every log write without calling `.close()` or using auto-flush.
- **Log Signature**: `Error: EMFILE: too many open files, open '/var/log/audit/audit_2026.log'`

### 11. Customer Onboarding & KYC Document Validation Flow (`transfer_service.py`)
- **System Pattern**: Unhandled Third-Party Rate Limit (HTTP 429 Too Many Requests).
- **Root Cause**: Missing Exponential Backoff / Circuit Breaker wrapper around KYC verification REST endpoint.
- **Log Signature**: `HTTPError: 429 Client Error: Too Many Requests for url: https://api.kyc-provider.com/v1/verify`

### 12. Batch Interest Calculation & Payout Flow (`PaymentProcessorService.java`)
- **Flow Pattern**: Jackson JSON Deserialization NullPointerException on missing optional field `taxExemptionCode`.
- **Root Cause**: Dependency bump in `pom.xml` to `jackson-databind 2.15.0` changed default `FAIL_ON_UNKNOWN_PROPERTIES` behavior.
- **Log Signature**: `com.fasterxml.jackson.databind.exc.MismatchedInputException: Cannot construct instance`

### 13. Mobile Banking Push Notification Flow (`emailController.js`)
- **System Pattern**: Thread Pool Starvation / Async Unhandled Rejection.
- **Root Cause**: `Promise.all()` on 50,000 email dispatches without batching/chunking.
- **Log Signature**: `UnhandledPromiseRejectionWarning: RangeError: Maximum call stack size exceeded`

### 14. Standing Instruction Recurring Transfer Flow (`transfer.py`)
- **Flow Pattern**: Off-by-one Leap Year / Timezone Timestamp Parsing Defect.
- **Root Cause**: `datetime.strptime()` parsed without explicit UTC offsets, causing transactions scheduled at midnight to execute twice or skip.
- **Log Signature**: `ValueError: day is out of range for month at transfer.py:89`

### 15. Merchant Settlement Reconciliation Flow (`AccountService.java`)
- **System Pattern**: Microservice Dependency Version Mismatch (UAT vs PROD).
- **Root Cause**: UAT uses `spring-boot-starter-data-jpa:3.1.2`, PROD uses `spring-boot-starter-data-jpa:2.7.0` where method `findByTransactionIdAndStatus` doesn't exist.
- **Log Signature**: `java.lang.NoSuchMethodError: org.springframework.data.jpa.repository.JpaRepository.findByTransactionIdAndStatus`

---

## 🔧 Instructions for Code Generator AI

1. Generate fully runnable/valid file syntax for all 3 microservices.
2. Ensure log statements include `[TRACE_ID] [TIMESTAMP] [LEVEL]` to match Sentinel's log correlation engine in `data/logs/`.
3. Provide inline comments demarcating `# BUG_LOCATION` and `// SUGGESTED_PATCH` so the Sentinel Code Investigator & Patch Application API (`/api/repo/apply-patch`) can demonstrate before/after patch states.
