package com.condoncorp.photo_king_backend.dto;

public class UserImageCommentReq {
    private String comment;
    private int userId;
    private int photoId;

    public UserImageCommentReq(int userId, int photoId, String comment){
        this.userId=userId;
        this.photoId=photoId;
        this.comment=comment;
    }

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
