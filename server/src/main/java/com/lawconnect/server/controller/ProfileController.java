package com.lawconnect.server.controller;

import com.lawconnect.server.dto.AdvocateProfileDto;
import com.lawconnect.server.dto.ClientProfileDto;
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
            @RequestBody @Valid AdvocateProfileDto request) {
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

    @GetMapping("/advocates/{username}")
    public ResponseEntity<?> getAdvocateByUsername(@PathVariable String username) {
        return ResponseEntity.ok(profileService.getAdvocateFullProfile(username));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PutMapping("/client")
    public ResponseEntity<?> updateClientProfile(
            Principal principal,
            @RequestBody ClientProfileDto dto) {
        profileService.updateClientFullProfile(principal.getName(), dto);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/client")
    public ResponseEntity<?> getClientProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getClientFullProfile(principal.getName()));
    }
}