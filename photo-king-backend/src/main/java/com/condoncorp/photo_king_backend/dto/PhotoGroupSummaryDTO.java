package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.PhotoGroupSummary;

import java.util.List;

public class PhotoGroupSummaryDTO {
    private final int id;
    private final List<UserImageDTO> userImages;

    public PhotoGroupSummaryDTO(PhotoGroupSummary photoGroupSummary) {
        this.id = photoGroupSummary.getId();
        this.userImages = photoGroupSummary.getUserImages().stream().map(UserImageDTO::new).toList();
    }

    public int getId() {
        return id;
    }

    public List<UserImageDTO> getUserImages() {
        return userImages;
    }
}
