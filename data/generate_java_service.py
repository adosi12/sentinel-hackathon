import os
import pathlib

base_dir = pathlib.Path('D:/2026Projects/AimToApply/sentinel-hackathon/data/sample_repo/order-payment-service')
src_dir = base_dir / 'src/main/java/com/bank/payment'
res_dir = base_dir / 'src/main/resources'

dirs = [
    src_dir / 'controller',
    src_dir / 'service',
    src_dir / 'client',
    src_dir / 'config',
    res_dir
]

for d in dirs:
    d.mkdir(parents=True, exist_ok=True)

# pom.xml
pom_xml = """<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.bank</groupId>
  <artifactId>order-payment-service</artifactId>
  <version>1.0.0</version>
  <properties>
    <java.version>17</java.version>
    <!-- BUG_LOCATION: Jackson version 2.15.0 fails on unknown properties by default -->
    <jackson.version>2.15.0</jackson.version>
    <!-- SUGGESTED_PATCH: -->
    <!-- <jackson.version>2.14.2</jackson.version> -->
  </properties>
</project>"""
(base_dir / 'pom.xml').write_text(pom_xml)

# application.properties
app_props = """# BUG_LOCATION: Socket timeout set to 2000ms in PROD
rest.client.readTimeout=2000
# SUGGESTED_PATCH:
# rest.client.readTimeout=5000
"""
(res_dir / 'application.properties').write_text(app_props)

# FXCalculationService.java
fx = """package com.bank.payment.service;

public class FXCalculationService {
    public double calculateFX(double amount, String currency) {
        double rate = getRate(currency);
        // BUG_LOCATION: Missing check for 0.0 rate
        // SUGGESTED_PATCH: if (rate == 0.0) throw new IllegalArgumentException("Invalid currency rate");
        return amount / rate; 
    }
    private double getRate(String currency) {
        if ("USD".equals(currency)) return 1.0;
        return 0.0;
    }
}
"""
(src_dir / 'service/FXCalculationService.java').write_text(fx)

# FraudCheckService.java
fraud = """package com.bank.payment.service;
import java.util.HashMap;

public class FraudCheckService {
    // BUG_LOCATION: Memory Leak due to static Unbounded Cache
    private static HashMap<String, String> transactionCache = new HashMap<>();
    
    public void checkFraud(String txId) {
        transactionCache.put(txId, "CLEARED");
        // SUGGESTED_PATCH: Use an LRU Cache or Eviction policy instead of unbounded HashMap
    }
}
"""
(src_dir / 'service/FraudCheckService.java').write_text(fraud)

# PaymentProcessorService.java
payment = """package com.bank.payment.service;

public class PaymentProcessorService {
    // Uses jackson for deserialization, triggering the NPE on missing fields
    public void processPayment(String payload) {
        // ...
    }
}
"""
(src_dir / 'service/PaymentProcessorService.java').write_text(payment)

# CardService.java
card = """package com.bank.payment.service;

public class CardService {
    // BUG_LOCATION: Race condition / Deadlock on Account Balance row updates
    public void transfer(Account accountA, Account accountB, double amount) {
        synchronized(accountA) {
            synchronized(accountB) {
                // SUGGESTED_PATCH: Always acquire locks in a globally consistent order (e.g. by account ID)
                accountA.balance -= amount;
                accountB.balance += amount;
            }
        }
    }
}
class Account { public double balance; public String id; }
"""
(src_dir / 'service/CardService.java').write_text(card)

# AccountService.java
account = """package com.bank.payment.service;

public class AccountService {
    public void reconcile(String txId) {
        // BUG_LOCATION: Method doesn't exist in older Spring Data JPA version
        // repository.findByTransactionIdAndStatus(txId, "PENDING");
        // SUGGESTED_PATCH: Use findByTransactionId(txId) and filter by status in code
    }
}
"""
(src_dir / 'service/AccountService.java').write_text(account)

# CoreBankingClient.java
core = """package com.bank.payment.client;

public class CoreBankingClient {
    public void callSwiftWire() {
        // Reads timeout from properties
    }
}
"""
(src_dir / 'client/CoreBankingClient.java').write_text(core)

print('Java service structure created successfully!')
