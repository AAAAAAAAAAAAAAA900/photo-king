package com.condoncorp.photo_king_backend.repository;

import com.condoncorp.photo_king_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("SELECT u FROM User u WHERE u.username = ?1 AND u.password = ?2")
    Optional<User> findByUser(String username, String password);

    @Query("SELECT u FROM User u WHERE u.username = ?1")
    Optional<User> findByUsername(String username);


}
