package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.UserImageCommentDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentReq;
import com.condoncorp.photo_king_backend.model.Comment;
import com.condoncorp.photo_king_backend.service.UserImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class CommentController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserImageService userImageService;

    @MessageMapping("/comment/{photoId}")
    public void sendComment(@DestinationVariable String photoId, String comment, @Header("userId") String userId){
        // Save comment to DB
        UserImageCommentDTO commentDTO = userImageService.uploadComment(new UserImageCommentReq(
                Integer.parseInt(userId), Integer.parseInt(photoId), comment));
        // Forward comment to subscribers
        messagingTemplate.convertAndSend("/topic/comment/" + photoId, commentDTO);
    };
}
