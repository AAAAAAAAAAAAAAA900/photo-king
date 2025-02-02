package com.condoncorp.photo_king_backend.model;


import jakarta.persistence.*;

import java.util.ArrayList;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false, length = 20, name = "username")
    private String username;
    @Column(nullable = false, length = 128, name = "password")
    private String password;
    @Column(unique = true, nullable = false, length = 320, name = "email")
    private String email;

    public User(int id, String username, String password, String email, ArrayList<Integer> groupId) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    public User() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
