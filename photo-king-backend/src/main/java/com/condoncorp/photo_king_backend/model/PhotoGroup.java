package com.condoncorp.photo_king_backend.model;


import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.PhotoGroupReq;
import com.condoncorp.photo_king_backend.service.PhotoGroupService;
import  com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Entity
@Table(name = "photo_group")
public class PhotoGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 20, name = "name")
    private String name;

    @Column(name = "owner_id", nullable = false)
    private int ownerId;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @ManyToMany(mappedBy = "photoGroups")
    private Set<User> users = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "photoGroup", cascade = CascadeType.ALL)
    private List<UserImage> userImages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "photoGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PhotoGroupPoints> photoGroupPoints = new ArrayList<>();


    public PhotoGroup(String name, int ownerId) {
        this.name = name;
        this.ownerId = ownerId;
        this.users = new HashSet<>();
        this.userImages = new ArrayList<>();
        this.photoGroupPoints = new ArrayList<>();
    }

    public PhotoGroup(PhotoGroupReq group) {
        this.name = group.getName();
        this.ownerId = group.getOwnerId();
        LocalDateTime now = LocalDateTime.now();
        if (now.getDayOfWeek().getValue() > group.getSelectedDay())
            now = now.plusWeeks(1);
        this.setExpiresAt(now.with(TemporalAdjusters.next(DayOfWeek.of(group.getSelectedDay()))).with(LocalTime.of(23, 59, 59)));
        this.users = new HashSet<>();
        this.userImages = new ArrayList<>();
        this.photoGroupPoints = new ArrayList<>();
    }

    public PhotoGroup() {

    }

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

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public List<UserImage> getUserImages() {
        return userImages;
    }

    public void setUserImages(List<UserImage> userImages) {
        this.userImages = userImages;
    }

    public List<PhotoGroupPoints> getPhotoGroupPoints() {
        return photoGroupPoints;
    }

    public void setPhotoGroupPoints(List<PhotoGroupPoints> photoGroupPoints) {
        this.photoGroupPoints = photoGroupPoints;
    }


    public UserImage getCurrentFirstPlaceImage() {
        if (userImages.isEmpty()) {
            return null;
        }

        if (userImages.size() == 1) {
            return userImages.get(0);
        }

        userImages.sort((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()));
        return userImages.get(0);
    }

    public UserImage getCurrentSecondPlaceImage() {
        if (userImages.isEmpty()) {
            return null;
        }

        if (userImages.size() == 1) {
            return null;
        }

        userImages.sort((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()));
        return userImages.get(1);
    }

    public UserImage getCurrentThirdPlaceImage() {
        if (userImages.isEmpty()) {
            return null;
        }

        if (userImages.size() == 1) {
            return null;
        }

        userImages.sort((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()));
        return userImages.get(2);
    }
}
