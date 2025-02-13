package com.condoncorp.photo_king_backend.repository;


import com.condoncorp.photo_king_backend.model.UserImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserImageRepository extends JpaRepository<UserImage, Integer> {



}
