package com.lawconnect.server.service.impl;

import com.lawconnect.server.dto.RepresentationRequestDto;
import com.lawconnect.server.model.RepresentationRequest;
import com.lawconnect.server.model.RequestStatus;
import com.lawconnect.server.model.User;
import com.lawconnect.server.repository.RepresentationRequestRepository;
import com.lawconnect.server.repository.UserRepository;
import com.lawconnect.server.service.RepresentationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepresentationRequestServiceImpl implements RepresentationRequestService {

    @Autowired
    private RepresentationRequestRepository representationRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public RepresentationRequest sendRequest(String clientUsername, RepresentationRequestDto dto) {
        User client = userRepository.findByUsername(clientUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Client not found"));

        User advocate = userRepository.findByUsername(dto.getAdvocateUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Advocate not found"));

        RepresentationRequest request = new RepresentationRequest();
        request.setClient(client);
        request.setAdvocate(advocate);
        request.setFirstName(dto.getFirstName());
        request.setLastName(dto.getLastName());
        request.setClientRole(dto.getClientRole());
        request.setCaseDescription(dto.getCaseDescription());

        return representationRequestRepository.save(request);
    }

    @Override
    public List<RepresentationRequest> getRequestsForAdvocate(String advocateUsername) {
        User advocate = userRepository.findByUsername(advocateUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Advocate not found"));
        return representationRequestRepository.findByAdvocate(advocate);
    }

    @Override
    public List<RepresentationRequest> getRequestsByClient(String clientUsername) {
        User client = userRepository.findByUsername(clientUsername)
                .orElseThrow(() -> new UsernameNotFoundException("Client not found"));
        return representationRequestRepository.findByClient(client);
    }

    @Override
    public RepresentationRequest updateRequestStatus(String requestId, RequestStatus status, String advocateUsername) {
        RepresentationRequest request = representationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getAdvocate().getUsername().equals(advocateUsername)) {
            throw new RuntimeException("Unauthorized to update this request");
        }

        request.setStatus(status);
        return representationRequestRepository.save(request);
    }
}
