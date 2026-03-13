package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
@Table(name = "case_update_documents")
public class CaseUpdateDocument {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @ManyToOne
    @JoinColumn(name = "case_update_id", nullable = false)
    private CaseUpdate caseUpdate;

    @Column(nullable = false)
    private String documentUrl;

    @Column
    private String documentName;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
    }
}
