package com.lawconnect.server.service;

public interface PasswordResetEmailService {
    void sendPasswordResetEmail(String email, String firstName, String lastName, String resetUrl);
}
