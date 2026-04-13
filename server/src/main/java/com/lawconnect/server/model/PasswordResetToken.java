package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Entity
@Data
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(nullable = false, unique = true, length = 128)
    private String tokenHash;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date expiresAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date usedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date createdAt;

    @Column(length = 255)
    private String requestIp;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        if (createdAt == null) createdAt = new Date();
    }
}
