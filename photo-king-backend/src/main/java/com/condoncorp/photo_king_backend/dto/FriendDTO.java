package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;

import java.util.Set;

public class FriendDTO {
    private int id;
    private String username;
    private String pfp;

    public FriendDTO(User user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.pfp = user.getProfileUrl();
    }

    public FriendDTO(UserDTO user){
        this.id = user.getId();
        this.username = user.getUsername();
        this.pfp = user.getProfileUrl();
    }

    public int getId() {
        return id;
    }

    public String getUsername(){return username;}
    public String getPfp(){return pfp;}


}
