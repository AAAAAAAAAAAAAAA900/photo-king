package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.*;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
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

        // REMOVES ALL IMAGES FROM USER AND DELETES FROM DATABASE
        for (UserImage userImage : user.getUserImages()) {
            userImageService.deleteImage(userImage.getId());
        }

        user.getUserImages().clear();

        userRepository.deleteById(id);
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

        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPhone(user.getPhone());
        newUser.setName(user.getName());
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
        System.out.println(user.getId());
        System.out.println(friend.getId());
        user.removeFriend(friend);
        friend.removeFriend(user);
        saveUser(user);
        saveUser(friend);
        return user.getFriends().stream().map(FriendDTO::new).collect(Collectors.toSet());
    }

    // RETURNS FRIEND OF USER
    public FriendDTO getFriendByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return new FriendDTO(user.get());
    }

    // REFRESH TOKEN
    public String generateToken(String refreshToken) {
        if (refreshToken == null) {
            return null;
        }

        if (!jwtService.isTokenNonExpired(refreshToken)) {
            return null;
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

    // RETURNS BIO OF GIVEN USER
    public String getUserBio(int userID){
         return getUserById(userID).getBio();
    }

    // SETS NEW PROFILE DATA
    public UserDTO setUserProfile(UserProfileReq userProfileReq){
        User user = getUserById(userProfileReq.getId());
        user.setUsername(userProfileReq.getUsername());
        user.setName(userProfileReq.getName());
        user.setBio(userProfileReq.getBio());
        saveUser(user);
        return new UserDTO(user);
    }

    // FINDS USERS MATCHING SEARCH QUERY
    public List<FriendDTO> findMatchingUsers(String search){
        Pageable pageable = PageRequest.of(0, 10);
        return userRepository.findUsernamesLike(search, pageable)
                .stream()
                .map(FriendDTO::new).
                collect(Collectors.toList());
    }
}
