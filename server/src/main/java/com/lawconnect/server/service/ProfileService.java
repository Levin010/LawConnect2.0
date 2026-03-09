package com.lawconnect.server.service;

import com.lawconnect.server.dto.AdvocateProfileDto;
import com.lawconnect.server.dto.ClientProfileDto;

import java.util.List;
import java.util.Map;

public interface ProfileService {
    void updateAdvocateFullProfile(String username, AdvocateProfileDto request);
    Map<String, Object> getAdvocateFullProfile(String username);
    List<Map<String, Object>> getAllAdvocates();
    void updateClientFullProfile(String username, ClientProfileDto dto);
    Map<String, Object> getClientFullProfile(String username);
}
