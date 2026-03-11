package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "legal_cases")
public class LegalCase {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @ManyToOne
    @JoinColumn(name = "advocate_id", nullable = false)
    private User advocate;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = true)
    private User client;

    @Column(nullable = false)
    private String caseName;

    @Column(nullable = false, unique = true)
    private String caseNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientRole clientRole;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String caseDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status = CaseStatus.OPEN;

    @Column(nullable = false)
    private LocalDateTime dateLaunched;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        dateLaunched = LocalDateTime.now();
    }
}
