package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.FriendRequestDTO;
import com.condoncorp.photo_king_backend.model.FriendRequest;
import com.condoncorp.photo_king_backend.model.FriendRequestStatus;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.FriendRequestRepository;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;


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
