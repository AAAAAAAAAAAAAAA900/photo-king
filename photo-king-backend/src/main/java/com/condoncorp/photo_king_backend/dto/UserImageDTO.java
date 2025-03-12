package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.UserImage;

import java.util.List;

public class UserImageDTO {
    private final int id;
    private final String url;
    private final String publicId;
    private final String imageName;
    private final int userId;
    private final int groupId;
    private final int points;
    private final List<UserImageCommentDTO> comments;

    public UserImageDTO(UserImage userImage) {
        this.id = userImage.getId();
        this.url = userImage.getUrl();
        this.publicId = userImage.getPublicId();
        this.imageName = userImage.getImageName();
        this.userId = userImage.getUser().getId();
        this.groupId = userImage.getPhotoGroup().getId();
        this.points = userImage.getPoints();
        this.comments = userImage.getComments().stream().map(UserImageCommentDTO::new).toList();
    }

    public int getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public String getPublicId() {
        return publicId;
    }

    public String getImageName() {
        return imageName;
    }

    public int getUserId() {
        return userId;
    }

    public int getGroupId() {
        return groupId;
    }

    public int getPoints() {
        return points;
    }

    public List<UserImageCommentDTO> getComments() {
        return comments;
    }
}
