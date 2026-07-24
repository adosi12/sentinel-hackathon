package com.bank.payment.service;

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
