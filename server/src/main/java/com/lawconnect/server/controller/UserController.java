package com.lawconnect.server.controller;

import com.lawconnect.server.config.TokenProvider;
import com.lawconnect.server.dto.AuthToken;
import com.lawconnect.server.dto.ForgotPasswordRequest;
import com.lawconnect.server.dto.LoginUser;
import com.lawconnect.server.dto.RefreshTokenRequest;
import com.lawconnect.server.dto.ResetPasswordRequest;
import com.lawconnect.server.model.BlacklistedToken;
import com.lawconnect.server.model.RefreshToken;
import com.lawconnect.server.model.User;
import com.lawconnect.server.dto.UserDto;
import com.lawconnect.server.repository.BlacklistedTokenRepository;
import com.lawconnect.server.repository.UserRepository;
import com.lawconnect.server.service.PasswordResetService;
import com.lawconnect.server.service.RefreshTokenService;
import com.lawconnect.server.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/auth")
    public ResponseEntity<?> generateToken(@RequestBody LoginUser loginUser) throws AuthenticationException {
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUser.getUsername(),
                        loginUser.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtTokenUtil.generateToken(authentication);
        User user = userService.findOne(authentication.getName());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        return ResponseEntity.ok(new AuthToken(token, refreshToken.getToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<User> saveUser(@Valid @RequestBody UserDto user) {
        return ResponseEntity.ok(userService.save(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            @RequestBody(required = false) RefreshTokenRequest refreshTokenRequest
    ) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Date expiration = jwtTokenUtil.getExpirationDateFromToken(token);
                blacklistedTokenRepository.save(new BlacklistedToken(token, expiration));
            } catch (Exception ignored) {
                // Access token may already be expired; refresh token revocation is the important part.
            }
        }

        if (refreshTokenRequest != null) {
            refreshTokenService.revokeRefreshToken(refreshTokenRequest.getRefreshToken());
        }

        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        RefreshToken rotatedRefreshToken = refreshTokenService.rotateRefreshToken(refreshTokenRequest.getRefreshToken());
        User user = rotatedRefreshToken.getUser();
        UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
        String accessToken = jwtTokenUtil.generateToken(
                new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities())
        );

        return ResponseEntity.ok(new AuthToken(accessToken, rotatedRefreshToken.getToken()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        passwordResetService.requestPasswordReset(request.getEmail(), extractClientIp(httpRequest));
        return ResponseEntity.ok(Map.of(
                "message",
                "If an account exists for that email, a password reset link has been sent."
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(request.getToken(), request.getPassword());
            return ResponseEntity.ok(Map.of("message", "Password reset successful. You can now log in."));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/find/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/find/by/username")
    public ResponseEntity<User> getUserByUsername(@RequestParam String username) {
        return ResponseEntity.ok(userService.findOne(username));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @GetMapping("/advocateping")
    public String advocatePing() {
        return "Only Advocates Can Read This";
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/clientping")
    public String clientPing() {
        return "Only Clients Can Read This";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/adminping")
    public String adminPing() {
        return "Only Admins Can Read This";
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(Map.of("id", user.getId(), "username", user.getUsername()));
    }

    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }

        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }
}
