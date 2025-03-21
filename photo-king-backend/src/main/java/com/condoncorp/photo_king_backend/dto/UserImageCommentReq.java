package com.condoncorp.photo_king_backend.dto;

public class UserImageCommentReq {
    private String comment;
    private int userId;
    private int photoId;

    public int getUserId() {
        return userId;
    }

    public int getPhotoId() {
        return photoId;
    }

    public String getComment() {
        return comment;
    }
}
