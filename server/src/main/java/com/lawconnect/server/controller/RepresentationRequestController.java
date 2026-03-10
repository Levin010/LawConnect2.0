package com.lawconnect.server.controller;

import com.lawconnect.server.dto.RepresentationRequestDto;
import com.lawconnect.server.model.RepresentationRequest;
import com.lawconnect.server.model.RequestStatus;
import com.lawconnect.server.service.RepresentationRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/representation-requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RepresentationRequestController {

    @Autowired
    private RepresentationRequestService representationRequestService;

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping
    public ResponseEntity<RepresentationRequest> sendRequest(
            Principal principal,
            @RequestBody @Valid RepresentationRequestDto dto) {
        return ResponseEntity.ok(representationRequestService.sendRequest(principal.getName(), dto));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @GetMapping("/incoming")
    public ResponseEntity<List<RepresentationRequest>> getIncomingRequests(Principal principal) {
        return ResponseEntity.ok(representationRequestService.getRequestsForAdvocate(principal.getName()));
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/my-requests")
    public ResponseEntity<List<RepresentationRequest>> getMyRequests(Principal principal) {
        return ResponseEntity.ok(representationRequestService.getRequestsByClient(principal.getName()));
    }

    @PreAuthorize("hasRole('ADVOCATE')")
    @PutMapping("/{requestId}/status")
    public ResponseEntity<RepresentationRequest> updateStatus(
            @PathVariable Long requestId,
            @RequestParam RequestStatus status,
            Principal principal) {
        return ResponseEntity.ok(representationRequestService.updateRequestStatus(requestId, status, principal.getName()));
    }
}
