package com.condoncorp.photo_king_backend.repository;

import com.condoncorp.photo_king_backend.model.PhotoGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PhotoGroupRepository extends JpaRepository<PhotoGroup, Integer> {

}
