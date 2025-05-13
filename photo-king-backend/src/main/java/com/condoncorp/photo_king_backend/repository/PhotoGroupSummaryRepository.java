package com.condoncorp.photo_king_backend.repository;

import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.PhotoGroupSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PhotoGroupSummaryRepository extends JpaRepository<PhotoGroupSummary, Integer> {

    @Query("SELECT p FROM PhotoGroupSummary p WHERE p.groupId = ?1")
    Optional<PhotoGroupSummary> findByPhotoGroupId(int groupId);


}
