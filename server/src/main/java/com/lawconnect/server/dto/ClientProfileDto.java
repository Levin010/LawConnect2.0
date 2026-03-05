package com.lawconnect.server.dto;

import lombok.Data;

@Data
public class ClientProfileDto {
    private String gender;
    private String county;
    private String address;
    private String postalAddress;
    private String profilePicture;
}