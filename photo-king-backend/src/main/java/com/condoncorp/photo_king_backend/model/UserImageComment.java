package com.condoncorp.photo_king_backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_image_comment")
public class UserImageComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_comment_user"))
    private User user;

    @ManyToOne
    @JoinColumn(name = "user_image_id", nullable = false, foreignKey = @ForeignKey(name = "fk_comment_user_image"))
    private UserImage userImage;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    public UserImageComment(String comment, User user, UserImage userImage) {
        this.comment = comment;
        this.user = user;
        this.userImage = userImage;
        this.createdAt = LocalDateTime.now();
    }

    public UserImageComment(Comment comment) {
        this.comment = comment.getMessage();
        this.user = comment.getSender();
        this.userImage = comment.getUserImage();
        this.createdAt = comment.getCreatedAt();
    }

    public UserImageComment() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserImage getUserImage() {
        return userImage;
    }

    public void setUserImage(UserImage userImage) {
        this.userImage = userImage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
