package com.lawconnect.server.controller;

import com.lawconnect.server.dto.AdvocateProfileUpdateRequest;
import com.lawconnect.server.dto.ClientProfileDto;
import com.lawconnect.server.model.ClientProfile;
import com.lawconnect.server.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PreAuthorize("hasRole('ADVOCATE')")
    @PutMapping("/advocate")
    public ResponseEntity<?> updateAdvocateProfile(
            Principal principal,
            @RequestBody @Valid AdvocateProfileUpdateRequest request) {
        profileService.updateAdvocateFullProfile(principal.getName(), request);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @GetMapping("/advocate")
    public ResponseEntity<?> getAdvocateProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getAdvocateFullProfile(principal.getName()));
    }

    @GetMapping("/advocates")
    public ResponseEntity<List<Map<String, Object>>> getAllAdvocates() {
        return ResponseEntity.ok(profileService.getAllAdvocates());
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PutMapping("/client")
    public ResponseEntity<ClientProfile> saveClientProfile(
            Principal principal,
            @RequestBody ClientProfileDto dto) {
        return ResponseEntity.ok(profileService.saveOrUpdateClientProfile(
                principal.getName(), dto));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/client")
    public ResponseEntity<ClientProfile> getClientProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getClientProfile(principal.getName()));
    }
}