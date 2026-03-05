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

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private AdvocateProfileRepository advocateProfileRepository;

    @Autowired
    private ClientProfileRepository clientProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AdvocateProfile saveOrUpdateAdvocateProfile(String username, AdvocateProfileDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        AdvocateProfile profile = advocateProfileRepository.findByUser(user)
                .orElse(new AdvocateProfile());

        profile.setUser(user);
        profile.setGender(dto.getGender());
        profile.setCategory(dto.getCategory());
        profile.setLawFirm(dto.getLawFirm());
        profile.setCounty(dto.getCounty());
        profile.setAddress(dto.getAddress());
        profile.setPostalAddress(dto.getPostalAddress());
        profile.setExperience(dto.getExperience());
        profile.setBio(dto.getBio());
        profile.setProfilePicture(dto.getProfilePicture());
        profile.setPracticingCertificate(dto.getPracticingCertificate());

        return advocateProfileRepository.save(profile);
    }

    @Override
    public ClientProfile saveOrUpdateClientProfile(String username, ClientProfileDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        ClientProfile profile = clientProfileRepository.findByUser(user)
                .orElse(new ClientProfile());

        profile.setUser(user);
        profile.setGender(dto.getGender());
        profile.setCounty(dto.getCounty());
        profile.setAddress(dto.getAddress());
        profile.setPostalAddress(dto.getPostalAddress());
        profile.setProfilePicture(dto.getProfilePicture());

        return clientProfileRepository.save(profile);
    }

    @Override
    public AdvocateProfile getAdvocateProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return advocateProfileRepository.findByUser(user)
                .orElse(new AdvocateProfile());
    }

    @Override
    public ClientProfile getClientProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return clientProfileRepository.findByUser(user)
                .orElse(new ClientProfile());
    }
}
