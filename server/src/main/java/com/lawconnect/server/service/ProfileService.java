package com.lawconnect.server.service;

import com.lawconnect.server.dto.AdvocateProfileUpdateRequest;
import com.lawconnect.server.dto.ClientProfileDto;
import com.lawconnect.server.model.ClientProfile;

import java.util.Map;

public interface ProfileService {
    void updateAdvocateFullProfile(String username, AdvocateProfileUpdateRequest request);
    Map<String, Object> getAdvocateFullProfile(String username);
    ClientProfile saveOrUpdateClientProfile(String username, ClientProfileDto dto);
    ClientProfile getClientProfile(String username);
}
