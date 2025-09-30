package com.condoncorp.photo_king_backend.dto;


import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class UserDTO {

    private final int id;
    private final String username;
    private final String email;
    private final String name;
    private final String profileUrl;
    private final Set<FriendDTO> friends;
    private final Set<PhotoGroupDTO> groups;
    private final boolean policyAccepted;
    private final Map<Integer, String> blockedUsers;

    public UserDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.name = user.getName();
        this.profileUrl = user.getProfileUrl();
        this.policyAccepted = user.isPolicyAccepted();
        this.friends = user.getFriends().stream().map(FriendDTO::new).collect(Collectors.toSet());
        this.groups = user.getPhotoGroups().stream().map(PhotoGroupDTO::new).collect(Collectors.toSet());
        this.blockedUsers = user.getBlockedUsers().stream().collect(Collectors.toMap(User::getId, User::getUsername));
    }

    public int getId() { return id; }
    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }


    public String getName() {
        return name;
    }
    public String getProfileUrl() {
        return profileUrl;
    }
    public boolean isPolicyAccepted() {return policyAccepted;}
    public Set<FriendDTO> getFriends(){ return friends; }
    public Set<PhotoGroupDTO> getGroups(){ return groups; }
    public Map<Integer,String> getBlockedUsers() {return blockedUsers;}
}
