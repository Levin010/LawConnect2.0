package com.lawconnect.server.service;

public interface PasswordResetRateLimiter {
    boolean isAllowed(String email, String ipAddress);
}
