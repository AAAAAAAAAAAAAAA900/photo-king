package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.dto.UserRegisterDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    public UserDTO loginUser(AuthRegReq authRegReq) {
        Optional<User> user = userRepository.findByUser(authRegReq.getUsername(), authRegReq.getPassword());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return new UserDTO(user.get());
    }

    // HANDLES USER REGISTRATION
    public UserDTO registerUser(UserRegisterDTO user) {

        Optional<User> findByUsername = userRepository.findByUsername(user.getUsername());
        if (findByUsername.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        Optional<User> findByEmail = userRepository.findByEmail(user.getEmail());
        if (findByEmail.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User newUser = UserRegisterDTO.toUser(user);
        userRepository.save(newUser);
        return new UserDTO(newUser);
    }


    // RETURNS USER BY ID
    public User getUserById(Integer id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return user.get();
    }

    public UserDTO getUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return new UserDTO(user.get());
    }


    public Set<FriendDTO> addFriend(Integer userId, Integer friendId) {
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.addFriend(friend);
        friend.addFriend(user);
        saveUser(user);
        saveUser(friend);
        return user.getFriends().stream().map(FriendDTO::new).collect(Collectors.toSet());
    }

    public Set<FriendDTO> removeFriend(Integer userId, Integer friendId) {
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.removeFriend(friend);
        friend.removeFriend(user);
        saveUser(user);
        saveUser(friend);
        return user.getFriends().stream().map(FriendDTO::new).collect(Collectors.toSet());
    }



}
