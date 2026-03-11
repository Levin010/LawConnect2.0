package com.lawconnect.server.dto;

import com.lawconnect.server.model.ClientRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LegalCaseDto {

    @NotBlank(message = "Case name is required")
    private String caseName;

    @NotBlank(message = "Case number is required")
    private String caseNumber;

    @NotNull(message = "Client role is required")
    private ClientRole clientRole;

    @NotBlank(message = "Case description is required")
    private String caseDescription;

    private String clientUsername;
}
