package com.condoncorp.photo_king_backend.dto;

import com.condoncorp.photo_king_backend.model.FriendRequest;
import com.condoncorp.photo_king_backend.model.FriendRequestStatus;

public class FriendRequestDTO {
    private final int id;
    private final int sender;
    private final int receiver;
    private final FriendRequestStatus status;


    public FriendRequestDTO(FriendRequest friendRequest) {
        this.id = friendRequest.getId();
        this.sender = friendRequest.getSender().getId();
        this.receiver = friendRequest.getReceiver().getId();
        this.status = friendRequest.getStatus();
    }


    public int getId() {
        return id;
    }

    public int getSender() {
        return sender;
    }

    public FriendRequestStatus getStatus() {
        return status;
    }

    public int getReceiver() {
        return receiver;
    }
}
