package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.PhotoGroup;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class PhotoGroupDTO {
    private int id;
    private String name;
    private int ownerId;
    private Map<Integer, Boolean> userRanked;
    private Set<FriendDTO> users;

    // SENDING DATA TO FRONTEND
    public PhotoGroupDTO(PhotoGroup photoGroup) {
        this.id = photoGroup.getId();
        this.name = photoGroup.getName();
        this.ownerId = photoGroup.getOwnerId();
        this.userRanked = photoGroup.getUserRanked();
        this.users = photoGroup.getUsers().stream().map(FriendDTO::new).collect(Collectors.toSet());
    }

    // FOR CREATING A NEW PHOTO GROUP
    public PhotoGroupDTO(String name, int ownerId) {
        this.name = name;
        this.ownerId = ownerId;
    }

    public PhotoGroupDTO() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public Map<Integer, Boolean> getUserRanked() {
        return userRanked;
    }

    public void setUserRanked(Map<Integer, Boolean> userRanked) {
        this.userRanked = userRanked;
    }

    public Set<FriendDTO> getUsers() {
        return users;
    }

    public void setUsers(Set<FriendDTO> users) {
        this.users = users;
    }
}
