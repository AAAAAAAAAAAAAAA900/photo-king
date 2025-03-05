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



    public PhotoGroup(String name, int ownerId) {
        this.name = name;
        this.ownerId = ownerId;
        this.users = new HashSet<>();
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

}
