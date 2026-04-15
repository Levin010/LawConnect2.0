package com.lawconnect.server.controller;

import com.lawconnect.server.dto.DashboardStats;
import com.lawconnect.server.dto.LegalCaseDto;
import com.lawconnect.server.model.LegalCase;
import com.lawconnect.server.service.LegalCaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/cases")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LegalCaseController {

    @Autowired
    private LegalCaseService legalCaseService;

    @PreAuthorize("hasRole('ADVOCATE')")
    @PostMapping
    public ResponseEntity<LegalCase> createCase(
            Principal principal,
            @RequestBody @Valid LegalCaseDto dto) {
        return ResponseEntity.ok(legalCaseService.createCase(principal.getName(), dto));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @PutMapping("/{caseId}")
    public ResponseEntity<LegalCase> updateCase(
            Principal principal,
            @PathVariable String caseId,
            @RequestBody @Valid LegalCaseDto dto) {
        return ResponseEntity.ok(legalCaseService.updateCase(caseId, principal.getName(), dto));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @PutMapping("/{caseId}/close")
    public ResponseEntity<LegalCase> closeCase(
            Principal principal,
            @PathVariable String caseId) {
        return ResponseEntity.ok(legalCaseService.closeCase(caseId, principal.getName()));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @PutMapping("/{caseId}/reopen")
    public ResponseEntity<LegalCase> reopenCase(
            Principal principal,
            @PathVariable String caseId) {
        return ResponseEntity.ok(legalCaseService.reopenCase(caseId, principal.getName()));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @GetMapping("/my-cases")
    public ResponseEntity<List<LegalCase>> getAdvocateCases(Principal principal) {
        return ResponseEntity.ok(legalCaseService.getCasesByAdvocate(principal.getName()));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/my-cases/client")
    public ResponseEntity<List<LegalCase>> getClientCases(Principal principal) {
        return ResponseEntity.ok(legalCaseService.getCasesByClient(principal.getName()));
    }

    @GetMapping("/{caseId}")
    public ResponseEntity<LegalCase> getCaseById(@PathVariable String caseId) {
        return ResponseEntity.ok(legalCaseService.getCaseById(caseId));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(Principal principal) {
        return ResponseEntity.ok(legalCaseService.getAdvocateDashboardStats(principal.getName()));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/dashboard/stats/client")
    public ResponseEntity<DashboardStats> getClientDashboardStats(Principal principal) {
        return ResponseEntity.ok(legalCaseService.getClientDashboardStats(principal.getName()));
    }
}
