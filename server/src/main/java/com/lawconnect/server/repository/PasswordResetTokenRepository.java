package com.lawconnect.server.repository;

import com.lawconnect.server.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);
    List<PasswordResetToken> findAllByUser_IdAndUsedAtIsNull(String userId);
    void deleteByExpiresAtBefore(Date cutoff);
}
