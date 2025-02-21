package com.condoncorp.photo_king_backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.HashSet;
import java.util.Set;


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
    @Column(unique = true, nullable = false, length = 20, name = "phone")
    private String phone;
    @Column(nullable = false, length = 20, name = "firstname")
    private String firstname;
    @Column(nullable = false, length = 20, name = "lastname")
    private String lastname;
    @Column(name = "profile_url")
    private String profileUrl;
    @Column(name = "profile_public_id")
    private String profilePublicId;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_group",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    @Cascade(CascadeType.ALL)
    private Set<PhotoGroup> photoGroups = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "friends_list",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    @Cascade(CascadeType.ALL)
    private Set<User> friends = new HashSet<>();

    public User(String username, String password, String phone, String email, String lastname, String firstname) {
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.lastname = lastname;
        this.firstname = firstname;
        this.profileUrl = "";
        this.profilePublicId = "";
        this.photoGroups = new HashSet<>();
        this.friends = new HashSet<>();
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getProfileUrl() {
        return profileUrl;
    }

    public void setProfileUrl(String profileUrl) {
        this.profileUrl = profileUrl;
    }

    public String getProfilePublicId() {
        return profilePublicId;
    }

    public void setProfilePublicId(String profilePublicId) {
        this.profilePublicId = profilePublicId;
    }

    public Set<PhotoGroup> getPhotoGroups() {
        return photoGroups;
    }

    public void setPhotoGroups(Set<PhotoGroup> photoGroups) {
        this.photoGroups = photoGroups;
    }

    public Set<User> getFriends() {
        return friends;
    }

    public void setFriends(Set<User> friends) {
        this.friends = friends;
    }

    public void addFriend(User friend) {
        this.friends.add(friend);
        friend.getFriends().add(this);
    }

    public void removeFriend(User friend) {
        this.friends.remove(friend);
        friend.getFriends().remove(this);
    }

}
