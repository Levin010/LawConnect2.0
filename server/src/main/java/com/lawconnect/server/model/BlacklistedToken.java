package com.lawconnect.server.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "blacklisted_tokens")
public class BlacklistedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(nullable = false)
    private Date expiresAt;

    public BlacklistedToken() {}

    public BlacklistedToken(String token, Date expiresAt) {
        this.token = token;
        this.expiresAt = expiresAt;
    }

    public String getToken() { return token; }
    public Date getExpiresAt() { return expiresAt; }
}
