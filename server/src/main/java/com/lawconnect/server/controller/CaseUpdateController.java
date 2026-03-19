package com.lawconnect.server.controller;

import com.lawconnect.server.model.CaseUpdate;
import com.lawconnect.server.service.CaseUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/cases/{caseId}/updates")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CaseUpdateController {

    @Autowired
    private CaseUpdateService caseUpdateService;

    @PreAuthorize("hasRole('ADVOCATE')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<CaseUpdate> createUpdate(
            @PathVariable String caseId,
            Principal principal,
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents) {
        return ResponseEntity.ok(caseUpdateService.createUpdate(
                caseId, principal.getName(), title, description, documents));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @PutMapping(value = "/{updateId}", consumes = "multipart/form-data")
    public ResponseEntity<CaseUpdate> editUpdate(
            @PathVariable String updateId,
            Principal principal,
            @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart(value = "documents", required = false) List<MultipartFile> documents) {
        return ResponseEntity.ok(caseUpdateService.editUpdate(
                updateId, principal.getName(), title, description, documents));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @DeleteMapping("/{updateId}")
    public ResponseEntity<?> deleteUpdate(
            @PathVariable String updateId,
            Principal principal) {
        caseUpdateService.deleteUpdate(updateId, principal.getName());
        return ResponseEntity.ok("Update deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<CaseUpdate>> getUpdates(@PathVariable String caseId) {
        return ResponseEntity.ok(caseUpdateService.getUpdatesByCase(caseId));
    }
}
