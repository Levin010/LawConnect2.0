package com.lawconnect.server.service.impl;

import com.lawconnect.server.dto.AdvocateProfileDto;
import com.lawconnect.server.dto.ClientProfileDto;
import com.lawconnect.server.model.AdvocateProfile;
import com.lawconnect.server.model.ClientProfile;
import com.lawconnect.server.model.User;
import com.lawconnect.server.repository.AdvocateProfileRepository;
import com.lawconnect.server.repository.ClientProfileRepository;
import com.lawconnect.server.repository.UserRepository;
import com.lawconnect.server.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private AdvocateProfileRepository advocateProfileRepository;

    @Autowired
    private ClientProfileRepository clientProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void updateAdvocateFullProfile(String username, AdvocateProfileDto request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setFirstName(normalizeRequiredValue(request.getFirstName()));
        user.setLastName(normalizeRequiredValue(request.getLastName()));
        user.setPhone(request.getPhone());
        userRepository.save(user);

        AdvocateProfile profile = advocateProfileRepository.findByUser(user)
                .orElse(new AdvocateProfile());

        profile.setUser(user);
        profile.setGender(request.getGender());
        profile.setCategory(request.getCategory());
        profile.setLawFirm(request.getLawFirm());
        profile.setCounty(request.getCounty());
        profile.setAddress(request.getAddress());
        profile.setPostalAddress(request.getPostalAddress());
        profile.setExperience(request.getExperience());
        profile.setBio(request.getBio());
        profile.setProfilePicture(request.getProfilePicture());
        profile.setPracticingCertificate(request.getPracticingCertificate());

        advocateProfileRepository.save(profile);
    }

    @Override
    public Map<String, Object> getAdvocateFullProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        AdvocateProfile profile = advocateProfileRepository.findByUser(user)
                .orElse(new AdvocateProfile());

        Map<String, Object> response = new HashMap<>();
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("username", user.getUsername());
        response.put("gender", profile.getGender());
        response.put("category", profile.getCategory());
        response.put("lawFirm", profile.getLawFirm());
        response.put("county", profile.getCounty());
        response.put("address", profile.getAddress());
        response.put("postalAddress", profile.getPostalAddress());
        response.put("experience", profile.getExperience());
        response.put("bio", profile.getBio());
        response.put("profilePicture", profile.getProfilePicture());
        response.put("practicingCertificate", profile.getPracticingCertificate());

        return response;
    }

    @Override
    public List<Map<String, Object>> getAllAdvocates(String search, String category, String county) {
        List<AdvocateProfile> profiles = advocateProfileRepository.searchAdvocates(
                normalizeSearchValue(search),
                normalizeFilterValue(category),
                normalizeFilterValue(county)
        );

        return profiles.stream().map(profile -> {
            Map<String, Object> response = new HashMap<>();
            User user = profile.getUser();
            response.put("username", user.getUsername());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhone());
            response.put("gender", profile.getGender());
            response.put("category", profile.getCategory());
            response.put("lawFirm", profile.getLawFirm());
            response.put("county", profile.getCounty());
            response.put("address", profile.getAddress());
            response.put("postalAddress", profile.getPostalAddress());
            response.put("experience", profile.getExperience());
            response.put("bio", profile.getBio());
            response.put("profilePicture", profile.getProfilePicture());
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateClientFullProfile(String username, ClientProfileDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setFirstName(normalizeRequiredValue(dto.getFirstName()));
        user.setLastName(normalizeRequiredValue(dto.getLastName()));
        user.setPhone(dto.getPhone());
        userRepository.save(user);

        ClientProfile profile = clientProfileRepository.findByUser(user)
                .orElse(new ClientProfile());

        profile.setUser(user);
        profile.setGender(dto.getGender());
        profile.setCounty(dto.getCounty());
        profile.setAddress(dto.getAddress());
        profile.setPostalAddress(dto.getPostalAddress());
        profile.setProfilePicture(dto.getProfilePicture());

        clientProfileRepository.save(profile);
    }

    @Override
    public Map<String, Object> getClientFullProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ClientProfile profile = clientProfileRepository.findByUser(user)
                .orElse(new ClientProfile());

        Map<String, Object> response = new HashMap<>();
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("username", user.getUsername());
        response.put("gender", profile.getGender());
        response.put("county", profile.getCounty());
        response.put("address", profile.getAddress());
        response.put("postalAddress", profile.getPostalAddress());
        response.put("profilePicture", profile.getProfilePicture());

        return response;
    }

    private String normalizeSearchValue(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : "%" + trimmed.toLowerCase(Locale.ROOT) + "%";
    }

    private String normalizeFilterValue(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed.toLowerCase(Locale.ROOT);
    }

    private String normalizeRequiredValue(String value) {
        return value == null ? "" : value.trim();
    }
}
