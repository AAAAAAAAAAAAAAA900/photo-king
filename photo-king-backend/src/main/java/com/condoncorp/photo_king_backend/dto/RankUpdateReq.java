package com.condoncorp.photo_king_backend.dto;

import java.util.List;

public class RankUpdateReq {
    private int userId;
    private int groupId;
    private List<Integer> images;

    public int getUserId() {
        return userId;
    }

    public int getGroupId() {
        return groupId;
    }

    public List<Integer> getImages() {
        return images;
    }
}
