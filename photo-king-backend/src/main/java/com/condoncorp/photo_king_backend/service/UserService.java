package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.*;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
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
    @Autowired
    private WSService websocketService;


    // SAVES USER TO DATABASE
    public void saveUser(User user) {
        userRepository.save(user);
    }

    // DELETES USER FROM DATABASE BY ID
    @Transactional
    @PreAuthorize("#id == authentication.principal.id")
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
    public void registerUser(UserRegisterReq user) {

        Optional<User> findByUsername = userRepository.findByUsername(user.getUsername());
        if (findByUsername.isPresent()) {
            throw new RuntimeException("Username is already taken.");
        }

        Optional<User> findByEmail = userRepository.findByEmail(user.getEmail());
        if (findByEmail.isPresent()) {
            throw new RuntimeException("Email is already taken.");
        }

        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setName(user.getName());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(newUser);

    }


    // RETURNS USER BY ID
    public User getUserById(Integer id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return user.get();
    }

    // RETURNS FRIEND BY ID
    public FriendDTO getFriendById(int id){
        return new FriendDTO(getUserById(id));
    }

    public UserDTO getUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return new UserDTO(user.get());
    }

    // REMOVES FRIEND FROM USER'S FRIENDS LIST
    @PreAuthorize("#userId == authentication.principal.id")
    public Set<FriendDTO> removeFriend(int userId, int friendId) {
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        user.removeFriend(friend);
        friend.removeFriend(user);
        saveUser(user);
        saveUser(friend);

        // Send new friends list to friends websocket to live update removal
        HashMap<String, Object> newFriends = new HashMap<String, Object>();
        newFriends.put("friends", friend.getFriends()
                .stream()
                .map(FriendDTO::new)
                .collect(Collectors
                        .toList()));
        websocketService.pingUser(friend.getId(), newFriends);


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
    @PreAuthorize("#userProfileReq.getId() == authentication.principal.id")
    public UserDTO setUserProfile(@P("userProfileReq") UserProfileReq userProfileReq){
        User user = getUserById(userProfileReq.getId());
        user.setUsername(userProfileReq.getUsername());
        user.setName(userProfileReq.getName());
        user.setBio(userProfileReq.getBio());
        try {
            saveUser(user);
        } catch(Exception e){
            throw new RuntimeException("Username is taken.");
        }
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

    public String getUsernameByToken (String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        String token = authHeader.substring(7);
        return jwtService.extractUsername(token);
    }

    // Accepts privacy policy
    @PreAuthorize("#userId == authentication.principal.id")
    public void acceptPolicy(int userId){
        User user = userRepository.findById(userId).orElseThrow(
                ()-> new RuntimeException("user not found")
        );

        user.setPolicyAccepted(true);

        userRepository.save(user);
    }
}
