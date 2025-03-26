package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friend-request")
public class FriendRequestController {
    @Autowired
    private FriendRequestService friendRequestService;

    @PostMapping("/send/{senderId}/{receiverId}")
    public ResponseEntity<String> sendFriendRequest(@PathVariable int senderId, @PathVariable int receiverId) {
        friendRequestService.sendFriendRequest(senderId, receiverId);
        return ResponseEntity.ok("Friend request sent successfully.");
    }

    @PostMapping("/accept/{friendRequestId}")
    public ResponseEntity<String> acceptFriendRequest(@PathVariable int friendRequestId) {
        friendRequestService.acceptFriendRequest(friendRequestId);
        return ResponseEntity.ok("Friend request accepted successfully.");
    }

    @PostMapping("/reject/{friendRequestId}")
    public ResponseEntity<String> rejectFriendRequest(@PathVariable int friendRequestId) {
        friendRequestService.rejectFriendRequest(friendRequestId);
        return ResponseEntity.ok("Friend request rejected successfully.");
    }

    @GetMapping("/pending/{receiverId}")
    public ResponseEntity<?> getPendingFriendRequests(@PathVariable int receiverId) {
        return ResponseEntity.ok(friendRequestService.getPendingFriendRequests(receiverId));
    }



}
