package com.condoncorp.photo_king_backend.dto;

import org.apache.tomcat.util.codec.binary.StringUtils;

public class UserProfileReq {
    private int id;
    private String username;
    private String name;
    private String bio;

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getBio() {
        return bio;
    }
}
