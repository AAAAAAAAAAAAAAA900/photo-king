package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.PhotoGroup;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class PhotoGroupDTO {
    private int id;
    private String name;
    private int ownerId;
    private int selectedDay;
    private Set<FriendDTO> users;
    private List<UserImageDTO> userImages;

    // SENDING DATA TO FRONTEND
    public PhotoGroupDTO(PhotoGroup photoGroup) {
        this.id = photoGroup.getId();
        this.name = photoGroup.getName();
        this.ownerId = photoGroup.getOwnerId();
        this.users = photoGroup.getUsers().stream().map(FriendDTO::new).collect(Collectors.toSet());
        this.userImages = photoGroup.getUserImages().stream().map(UserImageDTO::new).collect(Collectors.toList());
    }

    // FOR CREATING A NEW PHOTO GROUP
    public PhotoGroupDTO(String name, int ownerId) {
        this.name = name;
        this.ownerId = ownerId;
        this.selectedDay = 1;
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

    public int getSelectedDay() {
        return selectedDay;
    }

    public Set<FriendDTO> getUsers() {
        return users;
    }

    public List<UserImageDTO> getUserImages() {
        return userImages;
    }
}
