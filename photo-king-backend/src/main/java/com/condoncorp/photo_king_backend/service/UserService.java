package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.AuthRegReq;
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

    public User loginUser(AuthRegReq authRegReq) {
        Optional<User> user = userRepository.findByUser(authRegReq.getUsername(), authRegReq.getPassword());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return user.get();
    }

    public User registerUser(UserDTO userDTO) {
        User user = convertDTOtoEntity(userDTO);
        return userRepository.save(user);
    }

    public User convertDTOtoEntity(UserDTO userDTO) {
        User user = new User();

        Optional<User> findByUsername = userRepository.findByUsername(userDTO.getUsername());
        if (findByUsername.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        Optional<User> findByEmail = userRepository.findByEmail(userDTO.getEmail());
        if (findByEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        return user;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }


}
