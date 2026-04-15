package com.lawconnect.server.service;

import com.lawconnect.server.dto.LegalCaseDto;
import com.lawconnect.server.model.LegalCase;
import com.lawconnect.server.dto.DashboardStats;

import java.util.List;

public interface LegalCaseService {
    LegalCase createCase(String advocateUsername, LegalCaseDto dto);
    LegalCase updateCase(String caseId, String advocateUsername, LegalCaseDto dto);
    LegalCase closeCase(String caseId, String advocateUsername);
    LegalCase reopenCase(String caseId, String advocateUsername);
    List<LegalCase> getCasesByAdvocate(String advocateUsername);
    List<LegalCase> getCasesByClient(String clientUsername);
    LegalCase getCaseById(String caseId);
    DashboardStats getAdvocateDashboardStats(String advocateUsername);
    DashboardStats getClientDashboardStats(String clientUsername);
}
