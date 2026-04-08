package com.lawconnect.server.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class WsHandshakeLoggingInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        System.out.println("[WS-HANDSHAKE] beforeHandshake called");
        System.out.println("[WS-HANDSHAKE] uri = " + request.getURI());
        System.out.println("[WS-HANDSHAKE] headers = " + request.getHeaders());

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest req = servletRequest.getServletRequest();
            System.out.println("[WS-HANDSHAKE] servletPath = " + req.getServletPath());
            System.out.println("[WS-HANDSHAKE] origin = " + req.getHeader("Origin"));
            System.out.println("[WS-HANDSHAKE] upgrade = " + req.getHeader("Upgrade"));
            System.out.println("[WS-HANDSHAKE] connection = " + req.getHeader("Connection"));
        }

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        System.out.println("[WS-HANDSHAKE] afterHandshake called");
        System.out.println("[WS-HANDSHAKE] exception = " + exception);
    }
}
