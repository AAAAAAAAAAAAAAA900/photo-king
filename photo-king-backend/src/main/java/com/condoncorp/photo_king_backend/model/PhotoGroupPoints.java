package com.condoncorp.photo_king_backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
public class PhotoGroupPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "photo_group_id", nullable = false)
    private PhotoGroup photoGroup;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "points")
    private Integer points;

    public PhotoGroupPoints() {}

    public PhotoGroupPoints(PhotoGroup photoGroup, User user, Integer points) {
        this.photoGroup = photoGroup;
        this.user = user;
        this.points = points;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public PhotoGroup getPhotoGroup() {
        return photoGroup;
    }

    public void setPhotoGroup(PhotoGroup photoGroup) {
        this.photoGroup = photoGroup;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
}
