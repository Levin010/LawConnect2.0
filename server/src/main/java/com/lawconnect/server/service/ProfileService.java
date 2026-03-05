package com.lawconnect.server.service;

import com.lawconnect.server.dto.AdvocateProfileDto;
import com.lawconnect.server.dto.ClientProfileDto;
import com.lawconnect.server.model.AdvocateProfile;
import com.lawconnect.server.model.ClientProfile;

public interface ProfileService {
    AdvocateProfile saveOrUpdateAdvocateProfile(String username, AdvocateProfileDto dto);
    ClientProfile saveOrUpdateClientProfile(String username, ClientProfileDto dto);
    AdvocateProfile getAdvocateProfile(String username);
    ClientProfile getClientProfile(String username);
}
