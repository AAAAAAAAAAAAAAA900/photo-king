package com.condoncorp.photo_king_backend.model;


import  com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "photo_group")
public class PhotoGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false, length = 20, name = "name")
    private String name;

    @Column(name = "owner_id", nullable = false)
    private int ownerId;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @ManyToMany(mappedBy = "photoGroups")
    private Set<User> users = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "photoGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserImage> userImages = new ArrayList<>();

    public PhotoGroup(String name, int ownerId) {
        this.name = name;
        this.ownerId = ownerId;
        this.users = new HashSet<>();
        this.userImages = new ArrayList<>();
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
}
