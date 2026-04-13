package com.lawconnect.server.service.impl;

import com.lawconnect.server.model.PasswordResetToken;
import com.lawconnect.server.model.User;
import com.lawconnect.server.repository.PasswordResetTokenRepository;
import com.lawconnect.server.repository.UserRepository;
import com.lawconnect.server.service.PasswordResetEmailService;
import com.lawconnect.server.service.PasswordResetRateLimiter;
import com.lawconnect.server.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final long RESET_TOKEN_TTL_MILLIS = 30 * 60 * 1000L;
    private static final String GENERIC_ERROR = "This reset link is invalid or has expired.";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordResetRateLimiter passwordResetRateLimiter;

    @Autowired
    private PasswordResetEmailService passwordResetEmailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public void requestPasswordReset(String email, String ipAddress) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedIp = normalizeIp(ipAddress);

        if (!passwordResetRateLimiter.isAllowed(normalizedEmail, normalizedIp)) {
            return;
        }

        passwordResetTokenRepository.deleteByExpiresAtBefore(new Date());

        Optional<User> optionalUser = userRepository.findByEmail(normalizedEmail);
        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();
        invalidateActiveTokens(user.getId());

        String rawToken = generateSecureToken();
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setTokenHash(hashToken(rawToken));
        passwordResetToken.setExpiresAt(new Date(System.currentTimeMillis() + RESET_TOKEN_TTL_MILLIS));
        passwordResetToken.setRequestIp(normalizedIp);
        passwordResetToken.setUser(user);
        passwordResetTokenRepository.save(passwordResetToken);

        String resetUrl = buildResetUrl(rawToken);
        passwordResetEmailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetUrl);
    }

    @Override
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        passwordResetTokenRepository.deleteByExpiresAtBefore(new Date());

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(hashToken(rawToken))
                .orElseThrow(() -> new IllegalArgumentException(GENERIC_ERROR));

        Date now = new Date();
        if (resetToken.getUsedAt() != null || resetToken.getExpiresAt().before(now)) {
            throw new IllegalArgumentException(GENERIC_ERROR);
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordChangedAt(now);
        userRepository.save(user);

        invalidateActiveTokens(user.getId());
    }

    private void invalidateActiveTokens(String userId) {
        List<PasswordResetToken> activeTokens = passwordResetTokenRepository.findAllByUser_IdAndUsedAtIsNull(userId);
        Date now = new Date();
        for (PasswordResetToken token : activeTokens) {
            token.setUsedAt(now);
        }
        passwordResetTokenRepository.saveAll(activeTokens);
    }

    private String buildResetUrl(String rawToken) {
        return frontendUrl + "/reset-password?token=" + rawToken;
    }

    private String generateSecureToken() {
        byte[] buffer = new byte[32];
        secureRandom.nextBytes(buffer);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buffer);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte value : hash) {
                builder.append(String.format("%02x", value));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash reset token", ex);
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String normalizeIp(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank()) {
            return "unknown";
        }
        return ipAddress.trim();
    }
}
