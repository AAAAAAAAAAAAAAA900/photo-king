package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    // SAVES USER TO DATABASE
    public void saveUser(User user) {
        userRepository.save(user);
    }

    // DELETES USER FROM DATABASE BY ID
    @Transactional
    public void deleteUser(Integer id) {
        User user = getUserById(id);

        for (PhotoGroup photoGroup : user.getPhotoGroups()) {
            photoGroup.getUsers().remove(user);
        }

        user.getPhotoGroups().clear();

        for (User friend : user.getFriends()) {
            friend.getFriends().remove(user);
        }

        user.getFriends().clear();

        userRepository.deleteById(id);
    }

    // HANDLES USER LOGIN
    public User loginUser(AuthRegReq authRegReq) {
        Optional<User> user = userRepository.findByUser(authRegReq.getUsername(), authRegReq.getPassword());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return user.get();
    }

    // HANDLES USER REGISTRATION
    public User registerUser(UserDTO userDTO) {
        User user = convertDTOtoEntity(userDTO);
        return userRepository.save(user);
    }

    // CONVERTS DATA FROM FRONTEND TO ENTITY
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
        user.setFirstname(userDTO.getFirstname());
        user.setLastname(userDTO.getLastname());
        return user;
    }

    // RETURNS USER BY ID
    public User getUserById(Integer id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return user.get();
    }

    public User getUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return user.get();
    }


    public Set<User> addFriend(Integer userId, Integer friendId) {
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.addFriend(friend);
        saveUser(user);
        return user.getFriends();
    }




}
