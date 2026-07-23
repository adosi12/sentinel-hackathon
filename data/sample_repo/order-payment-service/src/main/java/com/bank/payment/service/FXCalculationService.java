package com.bank.payment.service;

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
