package com.condoncorp.photo_king_backend.repository;

import com.condoncorp.photo_king_backend.model.FriendRequest;
import com.condoncorp.photo_king_backend.model.FriendRequestStatus;
import com.condoncorp.photo_king_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {

    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequestStatus status);


}
