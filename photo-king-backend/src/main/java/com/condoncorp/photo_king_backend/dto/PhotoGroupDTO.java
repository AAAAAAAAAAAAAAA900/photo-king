package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.PhotoGroup;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class PhotoGroupDTO {
    private int id;
    private String name;
    private int ownerId;
    private Set<FriendDTO> users;
    private LocalDateTime expiresAt;
    private Map<Integer, Integer> userPoints = new HashMap<>();

    // SENDING DATA TO FRONTEND
    public PhotoGroupDTO(PhotoGroup photoGroup) {
        this.id = photoGroup.getId();
        this.name = photoGroup.getName();
        this.ownerId = photoGroup.getOwnerId();
        this.users = photoGroup.getUsers().stream().map(FriendDTO::new).collect(Collectors.toSet());
        this.expiresAt = photoGroup.getExpiresAt();
        this.userPoints = new HashMap<>();
        photoGroup.getPhotoGroupPoints().forEach(photoGroupPoint -> userPoints.put(photoGroupPoint.getUser().getId(), photoGroupPoint.getPoints()));
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

    public Set<FriendDTO> getUsers() {
        return users;
    }
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public Map<Integer, Integer> getUserPoints() {
        return userPoints;
    }

}
