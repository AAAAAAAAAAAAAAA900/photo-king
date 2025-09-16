package com.condoncorp.photo_king_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

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
    private String imageName;

    @Column(name = "points")
    private int points;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_image_user"))
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id", foreignKey = @ForeignKey(name = "fk_image_group"))
    private PhotoGroup photoGroup;

    @ManyToOne
    @JoinColumn(name = "summary_id", foreignKey = @ForeignKey(name = "fk_image_summary"))
    private PhotoGroupSummary summary;

    @JsonIgnore
    @OneToMany(mappedBy = "userImage", orphanRemoval = true, fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<UserImageComment> comments = new ArrayList<>();


    public UserImage(String url, String publicId, String image_name, User user, PhotoGroup photoGroup) {
        this.url = url;
        this.publicId = publicId;
        this.imageName = image_name;
        this.user = user;
        this.photoGroup = photoGroup;
        this.points = 0;
        this.comments = new ArrayList<>();
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

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
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

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public List<UserImageComment> getComments() {
        return comments;
    }

    public void setComments(List<UserImageComment> comments) {
        this.comments = comments;
    }

    public PhotoGroupSummary getSummary() {
        return summary;
    }

    public void setSummary(PhotoGroupSummary summary) {
        this.summary = summary;
    }
}
