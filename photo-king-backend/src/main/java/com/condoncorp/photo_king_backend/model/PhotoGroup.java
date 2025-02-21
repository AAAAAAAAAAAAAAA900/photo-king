package com.condoncorp.photo_king_backend.model;


import jakarta.persistence.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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

    @ManyToMany(mappedBy = "photoGroups")
    private Set<User> users = new HashSet<>();

    @ElementCollection
    @MapKeyColumn(name = "user_id")
    @Column(name = "has_ranked")
    @CollectionTable(name = "photo_group_user_ranked", joinColumns = @JoinColumn(name = "photo_group_id"))
    private Map<Integer, Boolean> userRanked = new HashMap<>();


    public PhotoGroup(String name, int ownerId) {
        this.name = name;
        this.ownerId = ownerId;
        this.users = new HashSet<>();
        this.userRanked = new HashMap<>();
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

    public Map<Integer, Boolean> getUserRanked() {
        return userRanked;
    }

    public void setUserRanked(Map<Integer, Boolean> userRanked) {
        this.userRanked = userRanked;
    }
}
