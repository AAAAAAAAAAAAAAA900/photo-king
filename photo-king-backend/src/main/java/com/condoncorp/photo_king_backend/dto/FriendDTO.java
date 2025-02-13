package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.User;

public class FriendDTO {
    private String username;
    private String pfp;

    public FriendDTO(User user){
        this.username = user.getUsername();
        this.pfp = null;    // For when we implement pfps
    }

    public FriendDTO(UserDTO user){
        this.username = user.getUsername();
        this.pfp = null;    // For when we implement pfps
    }

    public String getUsername(){return username;}
    public String getPfp(){return pfp;}

}
