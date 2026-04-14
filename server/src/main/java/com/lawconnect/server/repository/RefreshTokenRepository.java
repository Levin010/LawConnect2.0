package com.lawconnect.server.repository;

import com.lawconnect.server.model.RefreshToken;
import com.lawconnect.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByExpiresAtBefore(Date date);
    void deleteByRevokedTrueAndExpiresAtBefore(Date date);
    void deleteByUser(User user);
}
