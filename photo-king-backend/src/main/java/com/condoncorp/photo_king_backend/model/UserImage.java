package com.condoncorp.photo_king_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_image")
public class UserImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, name = "url")
    private String url;

    @Column(nullable = false, name = "public_id")
    private String publicId;

    @Column(nullable = false, name = "image_name")
    private String image_name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private PhotoGroup photoGroup;

    public UserImage(String url, String publicId, String image_name, User user, PhotoGroup photoGroup) {
        this.url = url;
        this.publicId = publicId;
        this.image_name = image_name;
        this.user = user;
        this.photoGroup = photoGroup;
    }

    public UserImage() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }

    public String getImage_name() {
        return image_name;
    }

    public void setImage_name(String image_name) {
        this.image_name = image_name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PhotoGroup getPhotoGroup() {
        return photoGroup;
    }

    public void setPhotoGroup(PhotoGroup photoGroup) {
        this.photoGroup = photoGroup;
    }
}
