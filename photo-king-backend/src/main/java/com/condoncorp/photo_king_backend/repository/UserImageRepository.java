package com.condoncorp.photo_king_backend.repository;


import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserImageRepository extends JpaRepository<UserImage, Integer> {

    @Query("SELECT ui FROM UserImage ui WHERE ui.groupId = ?1")
    List<UserImage> findByUserPhotoGroup(int groupId);

    @Query("SELECT ui FROM UserImage ui WHERE ui.userId = ?1")
    List<UserImage> findByUser(int userId);
}
