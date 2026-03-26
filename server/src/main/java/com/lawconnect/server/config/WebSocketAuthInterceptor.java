package com.lawconnect.server.config;

import com.lawconnect.server.repository.BlacklistedTokenRepository;
import com.lawconnect.server.service.UserService;
import com.lawconnect.server.config.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Value("${jwt.token.prefix}")
    private String TOKEN_PREFIX;

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private UserService userDetailsService;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith(TOKEN_PREFIX)) {
                throw new IllegalArgumentException("Missing or invalid Authorization header on CONNECT");
            }

            String token = authHeader.replace(TOKEN_PREFIX, "").trim();

            if (blacklistedTokenRepository.existsByToken(token)) {
                throw new IllegalArgumentException("Token is blacklisted");
            }

            String username = tokenProvider.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (!tokenProvider.validateToken(token, userDetails)) {
                throw new IllegalArgumentException("Invalid JWT token");
            }

            UsernamePasswordAuthenticationToken auth =
                    tokenProvider.getAuthenticationToken(token, null, userDetails);
            accessor.setUser(auth);
        }

        return message;
    }
}
