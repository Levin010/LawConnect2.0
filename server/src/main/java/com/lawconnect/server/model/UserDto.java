package com.lawconnect.server.model;

import lombok.Data;

@Data
public class UserDto {

    private String username;
    private String password;
    private String email;
    private String phone;
    private String name;
    private Role role;

    public User getUserFromDto() {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        user.setPhone(phone);
        user.setName(name);
        user.setRole(role);
        return user;
    }
}
