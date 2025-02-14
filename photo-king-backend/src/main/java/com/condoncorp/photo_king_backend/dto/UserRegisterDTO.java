package com.condoncorp.photo_king_backend.dto;


import com.condoncorp.photo_king_backend.model.User;

public class UserRegisterDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String firstname;
    private String lastname;

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

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public static User toUser(UserRegisterDTO userRegisterDTO) {
        User user = new User();

        user.setUsername(userRegisterDTO.getUsername());
        user.setPassword(userRegisterDTO.getPassword());
        user.setEmail(userRegisterDTO.getEmail());
        user.setPhone(userRegisterDTO.getPhone());
        user.setFirstname(userRegisterDTO.getFirstname());
        user.setLastname(userRegisterDTO.getLastname());
        return user;
    }
}
