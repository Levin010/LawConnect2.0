package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "legal_cases")
public class LegalCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
        dateLaunched = LocalDateTime.now();
    }
}
