package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "representation_requests")
public class RepresentationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name = "advocate_id", nullable = false)
    private User advocate;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartyRole partyRole;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String caseDescription;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    @PrePersist
    public void prePersist() {
        requestedAt = LocalDateTime.now();
    }
}
