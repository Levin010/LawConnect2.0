package com.lawconnect.server.scheduler;

import com.lawconnect.server.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenCleanupScheduler {

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Scheduled(fixedRate = 3600000)
    public void cleanExpiredTokens() {
        blacklistedTokenRepository.deleteByExpiresAtBefore(new Date());
    }
}