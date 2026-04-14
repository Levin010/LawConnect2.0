package com.lawconnect.server.service.impl;

import com.lawconnect.server.model.RefreshToken;
import com.lawconnect.server.model.User;
import com.lawconnect.server.repository.RefreshTokenRepository;
import com.lawconnect.server.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Value("${jwt.refresh-token.validity}")
    private long refreshTokenValidity;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString() + UUID.randomUUID());
        refreshToken.setUser(user);
        refreshToken.setCreatedAt(new Date());
        refreshToken.setExpiresAt(new Date(System.currentTimeMillis() + refreshTokenValidity * 1000));
        refreshToken.setRevoked(false);
        refreshToken.setRevokedAt(null);
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    @Transactional
    public RefreshToken rotateRefreshToken(String token) {
        RefreshToken existingToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        validateRefreshToken(existingToken);

        existingToken.setRevoked(true);
        existingToken.setRevokedAt(new Date());
        refreshTokenRepository.save(existingToken);

        return createRefreshToken(existingToken.getUser());
    }

    @Override
    @Transactional
    public void revokeRefreshToken(String token) {
        if (token == null || token.isBlank()) {
            return;
        }

        refreshTokenRepository.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            refreshToken.setRevokedAt(new Date());
            refreshTokenRepository.save(refreshToken);
        });
    }

    @Override
    @Transactional
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteByExpiresAtBefore(new Date());
    }

    @Override
    @Transactional
    public void deleteExpiredRevokedTokens() {
        refreshTokenRepository.deleteByRevokedTrueAndExpiresAtBefore(new Date());
    }

    private void validateRefreshToken(RefreshToken refreshToken) {
        Date now = new Date();

        if (refreshToken.isRevoked()) {
            throw new IllegalArgumentException("Refresh token has been revoked");
        }

        if (refreshToken.getExpiresAt().before(now)) {
            throw new IllegalArgumentException("Refresh token has expired");
        }

        Date passwordChangedAt = refreshToken.getUser().getPasswordChangedAt();
        Date createdAt = refreshToken.getCreatedAt();
        if (passwordChangedAt != null && createdAt != null && createdAt.before(passwordChangedAt)) {
            throw new IllegalArgumentException("Refresh token is no longer valid");
        }
    }
}
