package com.lawconnect.server.service;

public interface PasswordResetEmailService {
    void sendPasswordResetEmail(String email, String name, String resetUrl);
}
