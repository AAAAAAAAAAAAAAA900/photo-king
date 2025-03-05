package com.condoncorp.photo_king_backend.repository;

import com.condoncorp.photo_king_backend.model.PhotoGroupUserRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhotoGroupUserRankingRepository extends JpaRepository<PhotoGroupUserRanking, Integer> {

    @Query("SELECT p FROM PhotoGroupUserRanking p WHERE p.groupId = ?1 AND p.userId = ?2")
    Optional<PhotoGroupUserRanking> findByPhotoGroupIdAndUserId(int groupId, int userId);
}
