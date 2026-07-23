package com.bank.payment.service;

public class AccountService {
    public void reconcile(String txId) {
        // BUG_LOCATION: Method doesn't exist in older Spring Data JPA version
        // repository.findByTransactionIdAndStatus(txId, "PENDING");
        // SUGGESTED_PATCH: Use findByTransactionId(txId) and filter by status in code
    }
}
