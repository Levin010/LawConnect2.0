package com.lawconnect.server.repository;

import com.lawconnect.server.model.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
    boolean existsByToken(String token);
    void deleteByExpiresAtBefore(Date date);
}
