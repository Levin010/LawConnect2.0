package com.lawconnect.server.scheduler;

import com.lawconnect.server.repository.BlacklistedTokenRepository;
import com.lawconnect.server.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Component
public class TokenCleanupScheduler {

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanExpiredTokens() {
        blacklistedTokenRepository.deleteByExpiresAtBefore(new Date());
        refreshTokenService.deleteExpiredTokens();
        refreshTokenService.deleteExpiredRevokedTokens();
    }
}
