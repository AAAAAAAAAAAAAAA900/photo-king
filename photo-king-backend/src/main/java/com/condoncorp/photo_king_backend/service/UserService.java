package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.dto.UserRegisterDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserImageService userImageService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private CustomUserDetailsService userDetailsService;


    // SAVES USER TO DATABASE
    public void saveUser(User user) {
        userRepository.save(user);
    }

    // DELETES USER FROM DATABASE BY ID
    @Transactional
    public void deleteUser(Integer id) throws IOException {
        User user = getUserById(id);

        // REMOVES USER FROM ALL PHOTO GROUPS
        for (PhotoGroup photoGroup : user.getPhotoGroups()) {
            photoGroup.getUsers().remove(user);
        }

        user.getPhotoGroups().clear();

        // REMOVES USER FROM ALL FRIENDS
        for (User friend : user.getFriends()) {
            friend.getFriends().remove(user);
        }

        user.getFriends().clear();

        // RETURNS ALL IMAGES FROM USER THEN DELETES IT ALL
        for (UserImage userImage : userImageService.getImagesByUser(id)) {
            userImageService.deleteImage(userImage.getId());
        }

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
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));

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


    // ADDS FRIEND TO USER'S FRIENDS LIST
    public Set<FriendDTO> addFriend(int userId, int friendId) {
        if (userId == friendId) {
            throw new RuntimeException("You can't add yourself as a friend");
        }
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.addFriend(friend);
        friend.addFriend(user);
        saveUser(user);
        saveUser(friend);
        return user.getFriends().stream().map(FriendDTO::new).collect(Collectors.toSet());
    }

    // REMOVES FRIEND FROM USER'S FRIENDS LIST
    public Set<FriendDTO> removeFriend(int userId, int friendId) {
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.removeFriend(friend);
        friend.removeFriend(user);
        saveUser(user);
        saveUser(friend);
        return user.getFriends().stream().map(FriendDTO::new).collect(Collectors.toSet());
    }

    // REFRESH TOKEN
    public String generateToken(String refreshToken) {

        if (refreshToken == null) {
            throw new RuntimeException("Refresh token is null");
        }

        if (!jwtService.isTokenNonExpired(refreshToken)) {
            throw new RuntimeException("Refresh token is expired");
        }

        String username = jwtService.extractUsername(refreshToken);
        return jwtService.generateToken(userDetailsService.loadUserByUsername(username));
    }

    // CHECK IF TOKEN IS EXPIRED
    public boolean isTokenNonExpired(String token) {
        return jwtService.isTokenNonExpired(token);
    }

    // RETURNS USER INFO BY TOKEN
    public UserDTO getUserInfo(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        return getUserByUsername(username);

    }



}
