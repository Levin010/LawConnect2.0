package com.lawconnect.server.dto;

import lombok.Data;

@Data
public class AdvocateProfileUpdateRequest {
    private String name;
    private String phone;
    private String gender;
    private String category;
    private String lawFirm;
    private String county;
    private String address;
    private String postalAddress;
    private Integer experience;
    private String bio;
    private String profilePicture;
    private String practicingCertificate;
}