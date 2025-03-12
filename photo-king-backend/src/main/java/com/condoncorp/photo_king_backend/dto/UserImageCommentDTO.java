package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.UserImageComment;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class UserImageCommentDTO {
    private int id;
    private String comment;
    private int userId;
    private int imageId;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime date;

    public UserImageCommentDTO(UserImageComment userImageComment) {
        this.id = userImageComment.getId();
        this.comment = userImageComment.getComment();
        this.date = userImageComment.getCreatedAt();
        this.userId = userImageComment.getUser().getId();
        this.imageId = userImageComment.getUserImage().getId();
    }

    public UserImageCommentDTO() {

    }

    public int getId() {
        return id;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public int getUserId() {
        return userId;
    }

    public int getImageId() {
        return imageId;
    }
}
