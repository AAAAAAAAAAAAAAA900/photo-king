package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.UserImageCommentDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentReq;
import com.condoncorp.photo_king_backend.service.FriendRequestService;
import com.condoncorp.photo_king_backend.service.UserImageService;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class WSController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserImageService userImageService;
    @Autowired
    private FriendRequestService friendRequestService;
    @Autowired
    private UserService userService;

    // for comments under images
    @MessageMapping("/comment/{photoId}")
    public void sendComment(@DestinationVariable Integer photoId, String comment, @Header("userId") Integer userId){
        // Save comment to DB
        UserImageCommentDTO commentDTO = userImageService.uploadComment(new UserImageCommentReq(userId, photoId, comment));
        // Forward comment to subscribers
        messagingTemplate.convertAndSend("/topic/comment/" + photoId, commentDTO);
    };

    // for sending friend requests
    @MessageMapping("/request/{senderId}")
    public void sendFriendRequest(@DestinationVariable Integer senderId, Integer receiverId){
        // save request to DB
        friendRequestService.sendFriendRequest(senderId, receiverId);
        // Forward to request websocket of receiver
        messagingTemplate.convertAndSend("/topic/request/" + receiverId, senderId);
    }

}
