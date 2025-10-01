package com.condoncorp.photo_king_backend.repository;

import com.condoncorp.photo_king_backend.model.FriendRequest;
import com.condoncorp.photo_king_backend.model.FriendRequestStatus;
import com.condoncorp.photo_king_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {

    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);
    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequestStatus status);

    // Deletes all friend requests between two users regardless of direction
    @Modifying
    @Query("DELETE FROM FriendRequest fr WHERE (fr.receiver = :u1 OR fr.receiver = :u2) AND (fr.sender = :u1 OR fr.sender = :u2)")
    int deleteByUsers(@Param("u1") User u1, @Param("u2") User u2);
}
