package com.condoncorp.photo_king_backend.repository;

import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.PhotoGroupPoints;
import com.condoncorp.photo_king_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PhotoGroupPointsRepository extends JpaRepository<PhotoGroupPoints, Integer> {

    @Query("SELECT p FROM PhotoGroupPoints p WHERE p.photoGroup = ?1 AND p.user = ?2")
    Optional<PhotoGroupPoints> findByGroupAndUser(PhotoGroup group, User user);
}
