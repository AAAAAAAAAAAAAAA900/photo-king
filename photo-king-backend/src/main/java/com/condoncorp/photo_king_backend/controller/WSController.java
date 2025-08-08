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

    @MessageMapping("/comment/{photoId}")
    public void sendComment(@DestinationVariable Integer photoId, String comment, @Header("userId") Integer userId){
        // Save comment to DB
        UserImageCommentDTO commentDTO = userImageService.uploadComment(new UserImageCommentReq(userId, photoId, comment));
        // Forward comment to subscribers
        messagingTemplate.convertAndSend("/topic/comment/" + photoId, commentDTO);
    };

    @MessageMapping("/friend/{senderId}")
    public void sendFriendRequest(@DestinationVariable Integer senderId, @Header("receiverId") Integer receiverId, String body){
        /*
        body is formatted as:
        {
            send, accept, or reject,
            requestId
        }
         */
        int requestId;
        switch (body.split(",")[0]){
            case "send":
                friendRequestService.sendFriendRequest(senderId, receiverId);
                break;
            case "accept":
                requestId = Integer.parseInt(body.split(",")[1]);
                friendRequestService.acceptFriendRequest(requestId);
                break;
            case "reject":
                requestId = Integer.parseInt(body.split(",")[1]);
                friendRequestService.rejectFriendRequest(requestId);
                break;
            case "remove":
                userService.removeFriend(senderId, receiverId);
                break;
        }

        messagingTemplate.convertAndSend("/topic/friend/" + receiverId, body);
    }

}
