package com.lawconnect.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "case_updates")
public class CaseUpdate {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private LegalCase legalCase;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "caseUpdate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CaseUpdateDocument> documents;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
        createdAt = LocalDateTime.now();
    }
}