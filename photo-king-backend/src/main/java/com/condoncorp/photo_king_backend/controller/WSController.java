package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentReq;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.service.FriendRequestService;
import com.condoncorp.photo_king_backend.service.UserImageService;
import com.condoncorp.photo_king_backend.service.UserService;
import com.condoncorp.photo_king_backend.service.WSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class WSController {

    @Autowired
    private UserImageService userImageService;
    @Autowired
    private FriendRequestService friendRequestService;
    @Autowired
    private WSService websocketService;
    @Autowired
    private UserService userService;

    // for comments under images
    @MessageMapping("/comment/{photoId}")
    public void sendComment(@DestinationVariable Integer photoId, String comment, @Header("userId") Integer userId){
        // Save comment to DB
        UserImageCommentDTO commentDTO = userImageService.uploadComment(new UserImageCommentReq(userId, photoId, comment));
        // Forward comment to subscribers
        websocketService.liveUpdateComment(photoId, commentDTO);
    };

    // for sending friend requests
    @MessageMapping("/request/{receiverId}")
    public void sendFriendRequest(@DestinationVariable Integer receiverId, Integer senderId){
        // save request to DB
        friendRequestService.sendFriendRequest(senderId, receiverId);
        // Forward to request websocket of receiver
        websocketService.liveUpdateRequest(senderId, receiverId);
    }

}
