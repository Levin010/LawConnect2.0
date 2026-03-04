package com.lawconnect.server.service;

import com.lawconnect.server.model.User;
import com.lawconnect.server.model.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User save(UserDto user);
    List<User> findAll();
    User findOne(String username);
}