package com.lawconnect.server.service.impl;

import com.lawconnect.server.service.PasswordResetRateLimiter;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class InMemoryPasswordResetRateLimiter implements PasswordResetRateLimiter {

    private static final long WINDOW_MILLIS = 15 * 60 * 1000L;
    private static final int EMAIL_LIMIT = 3;
    private static final int IP_LIMIT = 10;

    private final Map<String, ConcurrentLinkedDeque<Long>> emailAttempts = new ConcurrentHashMap<>();
    private final Map<String, ConcurrentLinkedDeque<Long>> ipAttempts = new ConcurrentHashMap<>();

    @Override
    public boolean isAllowed(String email, String ipAddress) {
        long now = System.currentTimeMillis();

        boolean emailAllowed = isAllowed(emailAttempts, "email:" + email, EMAIL_LIMIT, now);
        boolean ipAllowed = isAllowed(ipAttempts, "ip:" + ipAddress, IP_LIMIT, now);

        return emailAllowed && ipAllowed;
    }

    private boolean isAllowed(Map<String, ConcurrentLinkedDeque<Long>> attempts, String key, int limit, long now) {
        ConcurrentLinkedDeque<Long> timestamps = attempts.computeIfAbsent(key, ignored -> new ConcurrentLinkedDeque<>());

        synchronized (timestamps) {
            purgeExpired(timestamps, now);
            if (timestamps.size() >= limit) {
                return false;
            }

            timestamps.addLast(now);
            if (timestamps.isEmpty()) {
                attempts.remove(key);
            }
            return true;
        }
    }

    private void purgeExpired(ConcurrentLinkedDeque<Long> timestamps, long now) {
        while (true) {
            Long oldest = timestamps.peekFirst();
            if (oldest == null || now - oldest <= WINDOW_MILLIS) {
                return;
            }
            timestamps.pollFirst();
        }
    }
}
