package com.lawconnect.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdvocateProfileDto {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Phone is required")
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
