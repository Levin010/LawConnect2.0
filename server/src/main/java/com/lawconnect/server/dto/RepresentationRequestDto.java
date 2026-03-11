package com.lawconnect.server.dto;

import com.lawconnect.server.model.ClientRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RepresentationRequestDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Party role is required")
    private ClientRole clientRole;

    @NotBlank(message = "Case description is required")
    private String caseDescription;

    @NotBlank(message = "Advocate username is required")
    private String advocateUsername;
}
