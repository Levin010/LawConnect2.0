package com.lawconnect.server.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(1)
public class WsDebugFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return !request.getServletPath().startsWith("/ws");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        System.out.println("[WS-HTTP] Incoming request");
        System.out.println("[WS-HTTP] path = " + request.getServletPath());
        System.out.println("[WS-HTTP] uri = " + request.getRequestURI());
        System.out.println("[WS-HTTP] method = " + request.getMethod());
        System.out.println("[WS-HTTP] origin = " + request.getHeader("Origin"));
        System.out.println("[WS-HTTP] auth = " + request.getHeader("Authorization"));

        filterChain.doFilter(request, response);

        System.out.println("[WS-HTTP] response status = " + response.getStatus());
        System.out.println("[WS-HTTP] response ACAO = " + response.getHeader("Access-Control-Allow-Origin"));
    }
}
