package com.condoncorp.photo_king_backend.dto;


import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserDTO {

    private final int id;
    private final String username;
    private final String email;
    private final String phone;
    private final String name;
    private final String profileUrl;
    private final String profilePublicId;
    private final String role;
    private final Set<FriendDTO> friends;
    private final Set<PhotoGroupDTO> groups;
    private final List<UserImageDTO> userImages;

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
        this.userImages = user.getUserImages().stream().map(UserImageDTO::new).collect(Collectors.toList());
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

    public List<UserImageDTO> getUserImages() {
        return userImages;
    }
}
