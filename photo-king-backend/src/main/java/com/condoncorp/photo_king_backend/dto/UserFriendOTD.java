package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.User;

import java.util.Set;

public class UserFriendOTD {

    private String username;
    private Set<User> friends;

    public UserFriendOTD() {

    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<User> getFriends() {
        return friends;
    }

    public void setFriends(Set<User> friends) {
        this.friends = friends;
    }

    public static UserFriendOTD convertUserToOTD(User user) {
        UserFriendOTD userFriendOTD = new UserFriendOTD();
        userFriendOTD.setUsername(user.getUsername());
        userFriendOTD.setFriends(user.getFriends());
        return userFriendOTD;
    }

}
