package com.condoncorp.photo_king_backend.dto;


import com.condoncorp.photo_king_backend.model.User;

public class UserRegisterDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String name;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getName() {
        return name;
    }

    public static User toUser(UserRegisterDTO userRegisterDTO) {
        User user = new User();
        user.setUsername(userRegisterDTO.getUsername());
        user.setPassword(userRegisterDTO.getPassword());
        user.setEmail(userRegisterDTO.getEmail());
        user.setPhone(userRegisterDTO.getPhone());
        user.setName(userRegisterDTO.getName());
        user.setRole("user");
        return user;
    }
}
