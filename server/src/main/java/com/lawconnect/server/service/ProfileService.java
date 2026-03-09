package com.lawconnect.server.service;

import com.lawconnect.server.dto.AdvocateProfileDto;
import com.lawconnect.server.dto.ClientProfileDto;
import com.lawconnect.server.model.ClientProfile;

import java.util.List;
import java.util.Map;

public interface ProfileService {
    void updateAdvocateFullProfile(String username, AdvocateProfileDto request);
    Map<String, Object> getAdvocateFullProfile(String username);
    ClientProfile saveOrUpdateClientProfile(String username, ClientProfileDto dto);
    ClientProfile getClientProfile(String username);
    List<Map<String, Object>> getAllAdvocates();
}
