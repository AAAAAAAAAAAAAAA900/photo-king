package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.FriendRequestDTO;
import com.condoncorp.photo_king_backend.model.FriendRequest;
import com.condoncorp.photo_king_backend.model.FriendRequestStatus;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.FriendRequestRepository;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendFriendRequest(int senderId, int receiverId) {

        if (senderId == receiverId) {
            throw new RuntimeException("You can't send a friend request to yourself.");
        }

        Optional<User> sender = userRepository.findById(senderId);
        if (sender.isEmpty()) {
            throw new RuntimeException("Sender not found.");
        }

        Optional<User> receiver = userRepository.findById(receiverId);
        if (receiver.isEmpty()) {
            throw new RuntimeException("Receiver not found.");
        }

        if (sender.get().getFriends().contains(receiver.get())) {
            throw new RuntimeException("You are already friends.");
        }

        Optional<FriendRequest> existingRequest = friendRequestRepository.findBySenderAndReceiver(sender.get(), receiver.get());
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == FriendRequestStatus.PENDING) {
            throw new RuntimeException("Friend request already sent.");
        }

        FriendRequest friendRequest = new FriendRequest(sender.get(), receiver.get());
        friendRequestRepository.save(friendRequest);

    }

    public void acceptFriendRequest(int friendRequestId) {
        Optional<FriendRequest> friendRequest = friendRequestRepository.findById(friendRequestId);
        if (friendRequest.isEmpty()) {
            throw new RuntimeException("Friend request not found.");
        }

        // ADD BOTH USERS TO FRIENDS LIST
        User sender = friendRequest.get().getSender();
        User receiver = friendRequest.get().getReceiver();
        sender.getFriends().add(receiver);
        receiver.getFriends().add(sender);

        // Send new friends list to senders websocket to live notify acceptance
        HashMap<String, Object> newFriends = new HashMap<String, Object>();
        newFriends.put("friends", sender.getFriends()
                .stream()
                .map(FriendDTO::new)
                .collect(Collectors
                        .toList()));
        messagingTemplate.convertAndSend("/topic/update/" + sender.getId(), newFriends);

        userRepository.save(sender);
        userRepository.save(receiver);
        friendRequestRepository.deleteById(friendRequestId);
    }

    public void rejectFriendRequest(int friendRequestId) {
        Optional<FriendRequest> friendRequest = friendRequestRepository.findById(friendRequestId);
        if (friendRequest.isEmpty()) {
            throw new RuntimeException("Friend request not found.");
        }

        friendRequestRepository.deleteById(friendRequestId);
    }

    public List<FriendRequestDTO> getPendingFriendRequests(int receiverId) {
        Optional<User> user = userRepository.findById(receiverId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found.");
        }
        List<FriendRequest> friendRequests = friendRequestRepository.findByReceiverAndStatus(user.get(), FriendRequestStatus.PENDING);
        return friendRequests.stream().map(FriendRequestDTO::new).toList();
    }


}
