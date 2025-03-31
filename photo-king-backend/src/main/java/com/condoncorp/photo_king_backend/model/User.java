package com.condoncorp.photo_king_backend.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;


@Entity
@Table(name = "user")
public class User implements UserDetails {

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
    @Column(nullable = false, length = 30, name = "name")
    private String name;
    @Column(name = "profile_url")
    private String profileUrl;
    @Column(name = "profile_public_id")
    private String profilePublicId;
    @Column(name = "role")
    private String role;
    @Column(name = "bio")
    private String bio;

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

    @JsonIgnore
    @OneToMany(mappedBy = "user", orphanRemoval = true)
    @Cascade(CascadeType.ALL)
    private List<UserImage> userImages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "sender", orphanRemoval = true)
    @Cascade(CascadeType.ALL)
    private Set<FriendRequest> sentRequests = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "receiver", orphanRemoval = true)
    @Cascade(CascadeType.ALL)
    private Set<FriendRequest> receivedRequests = new HashSet<>();

    public User(String username, String password, String phone, String email, String name) {
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.name = name;
        this.profileUrl = "";
        this.profilePublicId = "";
        this.role = "user";
        this.bio = "";
        this.photoGroups = new HashSet<>();
        this.friends = new HashSet<>();
        this.userImages = new ArrayList<>();
        this.sentRequests = new HashSet<>();
        this.receivedRequests = new HashSet<>();
    }


    public User() {
        this.profileUrl = "";
        this.profilePublicId = "";
        this.role = "user";
        this.bio = "";
        this.photoGroups = new HashSet<>();
        this.friends = new HashSet<>();
        this.userImages = new ArrayList<>();
        this.sentRequests = new HashSet<>();
        this.receivedRequests = new HashSet<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
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

    public List<UserImage> getUserImages() {
        return userImages;
    }

    public void setUserImages(List<UserImage> userImages) {
        this.userImages = userImages;
    }

    public Set<FriendRequest> getSentRequests() {
        return sentRequests;
    }

    public void setSentRequests(Set<FriendRequest> sentRequests) {
        this.sentRequests = sentRequests;
    }

    public Set<FriendRequest> getReceivedRequests() {
        return receivedRequests;
    }

    public void setReceivedRequests(Set<FriendRequest> receivedRequests) {
        this.receivedRequests = receivedRequests;
    }

    public void addFriend(User friend) {
        this.friends.add(friend);
        friend.getFriends().add(this);
    }

    public void removeFriend(User friend) {
        this.friends.remove(friend);
        friend.getFriends().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}
