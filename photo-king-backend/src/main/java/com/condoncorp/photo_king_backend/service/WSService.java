package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class WSService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // sends notification of friend request to request destination
    public void liveUpdateRequest(int senderId, int receiverId){
        messagingTemplate.convertAndSend("/topic/request/" + receiverId, senderId);
    }

    // sends notification of comment to comment destination
    public void liveUpdateComment(int photoId, UserImageCommentDTO comment){
        messagingTemplate.convertAndSend("/topic/comment/" + photoId, comment);
    }

    // Updates groups of every user in group
    public void pingAllMembers(PhotoGroup group){
        for(User user : group.getUsers()){
            HashMap<String, Object> newGroups = new HashMap<String, Object>();
            newGroups.put("groups", user.getPhotoGroups()
                    .stream()
                    .map(PhotoGroupDTO::new)
                    .collect(Collectors
                            .toList()));
            messagingTemplate.convertAndSend("/topic/update/" + user.getId(), (Object) newGroups);
        }
    }

    // sends a message to the users websocket
    public void pingUser(int userId, Object payload){
        messagingTemplate.convertAndSend("/topic/update/" + userId, payload);
    }

    // sends notification of picture change to group's picture destination
    public void liveUpdatePictures(int groupId, Object payload){
        messagingTemplate.convertAndSend("/topic/picture/" + groupId, payload);
    }
}
