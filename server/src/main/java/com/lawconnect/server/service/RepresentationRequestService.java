package com.lawconnect.server.service;

import com.lawconnect.server.dto.RepresentationRequestDto;
import com.lawconnect.server.model.RepresentationRequest;
import com.lawconnect.server.model.RequestStatus;

import java.util.List;

public interface RepresentationRequestService {
    RepresentationRequest sendRequest(String clientUsername, RepresentationRequestDto dto);
    RepresentationRequest updateRequestStatus(Long requestId, RequestStatus status, String advocateUsername);
    List<RepresentationRequest> getRequestsForAdvocate(String advocateUsername);
    List<RepresentationRequest> getRequestsByClient(String clientUsername);
}
