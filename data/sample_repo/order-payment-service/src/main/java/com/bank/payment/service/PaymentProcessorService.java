package com.bank.payment.service;

public class PaymentProcessorService {
    // Uses jackson for deserialization, triggering the NPE on missing fields
    public void processPayment(String payload) {
        // ...
    }
}
