package com.condoncorp.photo_king_backend.repository;


import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserImageRepository extends JpaRepository<UserImage, Integer> {

}
