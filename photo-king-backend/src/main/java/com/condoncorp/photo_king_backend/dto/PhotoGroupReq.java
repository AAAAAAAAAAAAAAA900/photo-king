package com.condoncorp.photo_king_backend.dto;

public class PhotoGroupReq {
    private String name;
    private int ownerId;
    private int selectedDay;

    public String getName() {
        return name;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public int getSelectedDay() {
        return selectedDay;
    }
}
