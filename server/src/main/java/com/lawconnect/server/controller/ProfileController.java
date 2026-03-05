package com.lawconnect.server.controller;

import com.lawconnect.server.dto.AdvocateProfileDto;
import com.lawconnect.server.dto.ClientProfileDto;
import com.lawconnect.server.model.AdvocateProfile;
import com.lawconnect.server.model.ClientProfile;
import com.lawconnect.server.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PreAuthorize("hasRole('ADVOCATE')")
    @PostMapping("/advocate")
    public ResponseEntity<AdvocateProfile> saveAdvocateProfile(
            Authentication authentication,
            @RequestBody AdvocateProfileDto dto) {
        return ResponseEntity.ok(profileService.saveOrUpdateAdvocateProfile(
                authentication.getName(), dto));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @GetMapping("/advocate")
    public ResponseEntity<AdvocateProfile> getAdvocateProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getAdvocateProfile(authentication.getName()));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping("/client")
    public ResponseEntity<ClientProfile> saveClientProfile(
            Authentication authentication,
            @RequestBody ClientProfileDto dto) {
        return ResponseEntity.ok(profileService.saveOrUpdateClientProfile(
                authentication.getName(), dto));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/client")
    public ResponseEntity<ClientProfile> getClientProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getClientProfile(authentication.getName()));
    }
}