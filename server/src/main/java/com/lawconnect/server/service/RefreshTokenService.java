package com.lawconnect.server.service;

import com.lawconnect.server.model.RefreshToken;
import com.lawconnect.server.model.User;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(User user);
    RefreshToken rotateRefreshToken(String token);
    void revokeRefreshToken(String token);
    void deleteExpiredTokens();
    void deleteExpiredRevokedTokens();
}
