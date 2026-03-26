package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "client_profiles")
public class ClientProfile {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column
    private String gender;

    @Column
    private String county;

    @Column
    private String address;

    @Column(name = "postal_address")
    private String postalAddress;

    @Column(name = "profile_picture")
    private String profilePicture;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID().toString();
    }
}
