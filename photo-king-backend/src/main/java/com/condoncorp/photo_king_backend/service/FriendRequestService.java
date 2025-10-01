package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.CustomUserDetails;
import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.FriendRequestDTO;
import com.condoncorp.photo_king_backend.model.FriendRequest;
import com.condoncorp.photo_king_backend.model.FriendRequestStatus;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.FriendRequestRepository;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WSService websocketService;

    @Transactional
    @PreAuthorize("#senderId == authentication.principal.id")
    public void sendFriendRequest(int senderId, int receiverId) {

        if (senderId == receiverId) {
            throw new RuntimeException("You can't send a friend request to yourself.");
        }
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found."));
        User receiver = userRepository.findById(receiverId).orElseThrow(()-> new RuntimeException("Receiver not found."));
        if (sender.getFriends().contains(receiver)) {
            throw new RuntimeException("You are already friends.");
        }
        if(receiver.getBlockedUsers().contains(sender)){
            throw new AccessDeniedException("User has you blocked");
        }

        Optional<FriendRequest> existingRequest = friendRequestRepository.findBySenderAndReceiver(sender, receiver);
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == FriendRequestStatus.PENDING) {
            throw new RuntimeException("Friend request already sent.");
        }

        FriendRequest friendRequest = new FriendRequest(sender, receiver);
        friendRequestRepository.save(friendRequest);

    }


    @Transactional
    public void acceptFriendRequest(int friendRequestId) {
        FriendRequest friendRequest = friendRequestRepository.findById(friendRequestId)
                .orElseThrow(() -> new RuntimeException("Friend request not found") );
        User sender = friendRequest.getSender();
        User receiver = friendRequest.getReceiver();

        // Check authorization
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(receiver.getId() != authenticatedUserId){
            throw new AccessDeniedException("Only the receiving user may accept a request.");
        }

        // ADD BOTH USERS TO FRIENDS LIST
        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);
        userRepository.save(sender);
        userRepository.save(receiver);
        // deletes all friend requests between the users regardless of direction
        friendRequestRepository.deleteByUsers(sender,receiver);

        // Send new friends list to senders websocket to live notify acceptance
        HashMap<String, Object> newFriends = new HashMap<String, Object>();
        newFriends.put("friends", sender.getFriends()
                .stream()
                .map(FriendDTO::new)
                .collect(Collectors
                        .toList()));
        websocketService.pingUser(sender.getId(), newFriends);
    }

    public void rejectFriendRequest(int friendRequestId) {
        FriendRequest friendRequest = friendRequestRepository.findById(friendRequestId)
                .orElseThrow(()-> new RuntimeException("Friend request not found."));

        // Check authorization
        int receiverId = friendRequest.getReceiver().getId();
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(receiverId != authenticatedUserId){
            throw new AccessDeniedException("Only the receiving user may deny a request.");
        }

        friendRequestRepository.deleteById(friendRequestId);
    }

    @PreAuthorize("#receiverId == authentication.principal.id")
    public List<FriendRequestDTO> getPendingFriendRequests(int receiverId) {
        Optional<User> user = userRepository.findById(receiverId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found.");
        }
        List<FriendRequest> friendRequests = friendRequestRepository.findByReceiverAndStatus(user.get(), FriendRequestStatus.PENDING);
        return friendRequests.stream().map(FriendRequestDTO::new).toList();
    }


}
