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
    private String name;
    private String profileUrl;
    private String profilePublicId;
    private String role;
    private Set<FriendDTO> friends;
    private Set<PhotoGroupDTO> groups;

    public UserDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.name = user.getName();
        this.profileUrl = user.getProfileUrl();
        this.profilePublicId = user.getProfilePublicId();
        this.role = user.getRole();
        this.friends = user.getFriends().stream().map(FriendDTO::new).collect(Collectors.toSet());
        this.groups = user.getPhotoGroups().stream().map(PhotoGroupDTO::new).collect(Collectors.toSet());
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

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getProfileUrl() {
        return profileUrl;
    }

    public String getProfilePublicId() {
        return profilePublicId;
    }

    public Set<FriendDTO> getFriends(){ return friends; }
    public Set<PhotoGroupDTO> getGroups(){ return groups; }
}
