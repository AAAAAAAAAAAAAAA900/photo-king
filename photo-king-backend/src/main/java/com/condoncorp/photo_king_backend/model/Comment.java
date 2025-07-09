package com.condoncorp.photo_king_backend.model;

import java.time.LocalDateTime;

public class Comment {

    private String message;
    private LocalDateTime createdAt;
    private User sender;
    private UserImage userImage;

    public Comment(String message, User sender, UserImage userImage) {
        this.message = message;
        this.sender = sender;
        this.createdAt = LocalDateTime.now();
        this.userImage = userImage;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public User getSender() {
        return sender;
    }
    public void setSender(User sender) {
        this.sender = sender;
    }

    public UserImage getUserImage() {
        return userImage;
    }
    public void setUserImage(UserImage userImage) {
        this.userImage = userImage;
    }
}
