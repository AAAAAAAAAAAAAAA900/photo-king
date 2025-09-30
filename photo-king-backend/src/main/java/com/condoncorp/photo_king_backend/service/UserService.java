package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.*;
import com.condoncorp.photo_king_backend.model.*;
import com.condoncorp.photo_king_backend.repository.*;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
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
    @Autowired
    private PhotoGroupService photoGroupService;

    // SAVES USER TO DATABASE
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Transactional
    private void deleteUserData(User user) throws IOException {
        // REMOVES USER FROM ALL PHOTO GROUPS AND DELETE GROUPS OWNED
        for (PhotoGroup photoGroup : new ArrayList<>(user.getPhotoGroups())) {
            if(photoGroup.getOwnerId() == user.getId()){
                photoGroupService.deleteGroup(photoGroup.getId());
            }
        }
        for(PhotoGroup group : user.getPhotoGroups()){
            group.getUsers().remove(user);
        }
        user.getPhotoGroups().clear();

        // REMOVES ALL IMAGES FROM USER AND DELETES FROM DATABASE
        for (UserImage userImage : new ArrayList<>(user.getUserImages())) {
            try {
                userImageService.deleteImage(userImage.getId());
            } catch(Exception ignored){
                // Image already deleted by previous loop
                // because the images group and summary may have been nulled,
                // it is more inefficient to anticipate exceptions than to ignore them
            }
        }
        user.getUserImages().clear();

        // REMOVES USER FROM ALL FRIENDS
        for (User friend : user.getFriends()) {
            friend.getFriends().remove(user);
        }
        user.getFriends().clear();
    }

    // DELETES USER FROM DATABASE BY ID
    @Transactional
    @PreAuthorize("#id == authentication.principal.id")
    public void deleteUser(Integer id) throws IOException {
        User user = getUserById(id);

        // deletes users groups and images
        deleteUserData(user);

        userRepository.delete(user);
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
        newUser.setPolicyAccepted(true);

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

    // BLOCKS ANOTHER USER
    @PreAuthorize("#blockerId == authentication.principal.id")
    public void blockUser(int blockerId, int blockeeId){
        User blocker = userRepository.findById(blockerId).orElseThrow();
        User blockee = userRepository.findById(blockeeId).orElseThrow();

        HashMap<String, Object> updatePayload = new HashMap<String, Object>();

        if(blocker.getFriends().contains(blockee)){
            updatePayload.put("friends", removeFriend(blockerId, blockeeId));
        }

        blocker.getBlockedUsers().add(blockee);
        saveUser(blocker);

        // Send new friends list and block list
        updatePayload.put("blockedUsers", blocker.getBlockedUsers()
                .stream()
                .collect(Collectors.toMap(User::getId, User::getUsername)));
        websocketService.pingUser(blockerId, updatePayload);
    }

    // UNBLOCKS ANOTHER USER
    @PreAuthorize("#blockerId == authentication.principal.id")
    public void unblockUser(int blockerId, int blockeeId){
        User blocker = userRepository.findById(blockerId).orElseThrow();
        User blockee = userRepository.findById(blockeeId).orElseThrow();

        blocker.getBlockedUsers().remove(blockee);
        saveUser(blocker);

        // Send new block list
        HashMap<String, Object> updatePayload = new HashMap<String, Object>();
        updatePayload.put("blockedUsers", blocker.getBlockedUsers()
                .stream()
                .collect(Collectors.toMap(User::getId, User::getUsername)));
        websocketService.pingUser(blockerId, updatePayload);
    }
}
