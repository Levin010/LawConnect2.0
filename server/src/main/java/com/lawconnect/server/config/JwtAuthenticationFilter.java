package com.lawconnect.server.config;

import com.lawconnect.server.repository.BlacklistedTokenRepository;
import com.lawconnect.server.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.header.string}")
    public String HEADER_STRING;

    @Value("${jwt.token.prefix}")
    public String TOKEN_PREFIX;

    @Autowired
    private UserService userDetailsService;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        System.out.println("[JWT] doFilterInternal path = " + req.getServletPath());
        System.out.println("[JWT] method = " + req.getMethod());
        System.out.println("[JWT] origin = " + req.getHeader("Origin"));
        System.out.println("[JWT] auth header present = " + (req.getHeader(HEADER_STRING) != null));

        String header = req.getHeader(HEADER_STRING);
        String username = null;
        String authToken = null;

        if (header != null && header.startsWith(TOKEN_PREFIX)) {
            authToken = header.replace(TOKEN_PREFIX, "").trim();

            try {
                username = jwtTokenUtil.getUsernameFromToken(authToken);
                System.out.println("[JWT] extracted username = " + username);
            } catch (IllegalArgumentException e) {
                logger.error("Error occurred while retrieving Username from Token", e);
            } catch (ExpiredJwtException e) {
                logger.warn("The token has expired", e);
            } catch (SignatureException e) {
                logger.error("Authentication Failed. Invalid username or password.");
            }
        } else {
            logger.warn("Bearer string not found, ignoring the header");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (blacklistedTokenRepository.existsByToken(authToken)) {
                System.out.println("[JWT] token is blacklisted");
                chain.doFilter(req, res);
                return;
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtTokenUtil.validateToken(authToken, userDetails)) {
                UsernamePasswordAuthenticationToken authentication = jwtTokenUtil.getAuthenticationToken(authToken, SecurityContextHolder.getContext().getAuthentication(), userDetails);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                logger.info("User authenticated: " + username + ", setting security context");
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        chain.doFilter(req, res);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        boolean skip = path.startsWith("/ws");

        System.out.println("[JWT] shouldNotFilter path = " + path);
        System.out.println("[JWT] shouldNotFilter skip = " + skip);

        return skip;
    }
}
