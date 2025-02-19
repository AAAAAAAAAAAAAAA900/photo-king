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

    @Column(name = "user_id", nullable = false)
    private int userId;

    @Column(name = "group_id", nullable = false)
    private int groupId;

    @Column(name = "points")
    private int points;

    public UserImage(String url, String publicId, String image_name, int userId, int groupId) {
        this.url = url;
        this.publicId = publicId;
        this.image_name = image_name;
        this.userId = userId;
        this.groupId = groupId;
        this.points = 0;
    }

    public UserImage() {
        this.points = 0;
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

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }
}
