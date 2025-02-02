package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User loginUser(UserDTO userDTO) {
        Optional<User> user = userRepository.findByUser(userDTO.getUsername(), userDTO.getPassword());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return user.get();
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }


}
