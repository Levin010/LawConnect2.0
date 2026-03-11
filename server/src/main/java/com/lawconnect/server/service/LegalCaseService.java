package com.lawconnect.server.service;

import com.lawconnect.server.dto.LegalCaseDto;
import com.lawconnect.server.model.LegalCase;

import java.util.List;

public interface LegalCaseService {
    LegalCase createCase(String advocateUsername, LegalCaseDto dto);
    LegalCase updateCase(Long caseId, String advocateUsername, LegalCaseDto dto);
    LegalCase closeCase(Long caseId, String advocateUsername);
    List<LegalCase> getCasesByAdvocate(String advocateUsername);
    List<LegalCase> getCasesByClient(String clientUsername);
    LegalCase getCaseById(Long caseId);
}
