package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.User;

public class FriendDTO {
    private int id;
    private String username;
    private String pfp;

    public FriendDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.pfp = null;    // For when we implement pfps
    }

    public FriendDTO(UserDTO user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.pfp = null;    // For when we implement pfps
    }

    public int getId() {
        return id;
    }

    public String getUsername(){return username;}
    public String getPfp(){return pfp;}

}
