package com.lawconnect.server.controller;

import com.lawconnect.server.config.TokenProvider;
import com.lawconnect.server.dto.AuthToken;
import com.lawconnect.server.dto.LoginUser;
import com.lawconnect.server.model.BlacklistedToken;
import com.lawconnect.server.model.User;
import com.lawconnect.server.dto.UserDto;
import com.lawconnect.server.repository.BlacklistedTokenRepository;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

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
        return ResponseEntity.ok(new AuthToken(token));
    }

    @PostMapping("/register")
    public ResponseEntity<User> saveUser(@Valid @RequestBody UserDto user) {
        return ResponseEntity.ok(userService.save(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            Date expiration = jwtTokenUtil.getExpirationDateFromToken(token);
            blacklistedTokenRepository.save(new BlacklistedToken(token, expiration));
        }
        return ResponseEntity.ok("Logged out successfully");
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
}
