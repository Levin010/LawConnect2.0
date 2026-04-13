package com.lawconnect.server.service;

public interface PasswordResetService {
    void requestPasswordReset(String email, String ipAddress);
    void resetPassword(String rawToken, String newPassword);
}
