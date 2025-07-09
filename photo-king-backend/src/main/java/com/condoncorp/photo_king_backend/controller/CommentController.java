package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.model.Comment;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CommentController {

    @MessageMapping("/comment")
    @SendTo("/topic/comments")
    public Comment sendComment(Comment comment){
        return comment;
    };
}
