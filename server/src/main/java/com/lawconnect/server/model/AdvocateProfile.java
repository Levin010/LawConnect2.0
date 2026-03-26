package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "advocate_profiles")
public class AdvocateProfile {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column
    private String gender;

    @Column
    private String category;

    @Column(name = "law_firm")
    private String lawFirm;

    @Column
    private String county;

    @Column
    private String address;

    @Column(name = "postal_address")
    private String postalAddress;

    @Column
    private Integer experience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "practicing_certificate")
    private String practicingCertificate;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
    }
}
