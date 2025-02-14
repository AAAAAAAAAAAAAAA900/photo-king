package com.condoncorp.photo_king_backend.dto;


import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;

import java.util.Set;
import java.util.stream.Collectors;

public class UserDTO {

    private int id;
    private String username;
    private String email;
    private String phone;
    private String firstname;
    private String lastname;
    private Set<FriendDTO> friends;
    private Set<PhotoGroup> groups;

    public UserDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.friends = user.getFriends().stream()
                .map(FriendDTO::new).collect(Collectors.toSet());
        this.groups = user.getPhotoGroups();
    }

    public int getId() { return id; }
    public String getUsername() {
        return username;
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

    public Set<FriendDTO> getFriends(){ return friends; }
    public Set<PhotoGroup> getGroups(){ return groups; }
}
