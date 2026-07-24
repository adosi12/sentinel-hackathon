package com.bank.payment.service;
import java.util.HashMap;

public class FraudCheckService {
    // BUG_LOCATION: Memory Leak due to static Unbounded Cache
    private static HashMap<String, String> transactionCache = new HashMap<>();
    
    public void checkFraud(String txId) {
        transactionCache.put(txId, "CLEARED");
        // SUGGESTED_PATCH: Use an LRU Cache or Eviction policy instead of unbounded HashMap
    }
}
