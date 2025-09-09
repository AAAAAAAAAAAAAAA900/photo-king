package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.dto.UserProfileReq;
import com.condoncorp.photo_king_backend.service.CustomUserDetailsService;
import com.condoncorp.photo_king_backend.service.JwtService;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(path = "api/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    // DELETES USER FROM DATABASE. REQUIRES USER ID.
    @DeleteMapping(path = "/delete/{id}")
    public void deleteUser(@PathVariable int id) throws IOException {
        userService.deleteUser(id);
    }

    // REMOVES A FRIEND FROM USER'S FRIENDS LIST
    @PostMapping(path="/remove-friend/{userId}/{friendId}")
    public Set<FriendDTO> removeFriend(@PathVariable int userId, @PathVariable int friendId) {
        return userService.removeFriend(userId, friendId);
    }

    // RETURNS FRIEND DTO BY USERNAME
    @GetMapping(path = "/get-friend/{username}")
    public FriendDTO getFriend(@PathVariable String username) {
        return userService.getFriendByUsername(username);
    }

    // RETURNS USER DETAILS BY TOKEN
    @GetMapping(path = "/get-user-info")
    public UserDTO getUserInfo(@RequestHeader("Authorization") String authHeader) {
        return userService.getUserInfo(authHeader);
    }

    // RETURNS USER BIO. REQUIRES USER ID.
    @GetMapping(path = "/get-user-bio/{id}")
    public String getUserBio(@PathVariable int id) {
        return userService.getUserBio(id);
    }

    // UPDATES CUSTOMIZABLE USER PROFILE INFORMATION.
    @PostMapping(path = "/set-user-profile")
    public ResponseEntity<?> setUserProfile(@RequestBody UserProfileReq userProfileReq){
        try {
            UserDTO newUserInfo = userService.setUserProfile(userProfileReq);
            // Return new tokens matching new username for front end
            HashMap<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", jwtService.generateToken(userDetailsService.loadUserByUsername(newUserInfo.getUsername())));
            tokens.put("refreshToken", jwtService.generateRefreshToken(newUserInfo.getUsername()));
            return ResponseEntity.ok().body(tokens);
        } catch (Exception e) {
            return ResponseEntity.status(409).body(null);
        }
    }

    // GETS USERS MATCHING SEARCH QUERY
    @GetMapping(path = "/search-users/{search}")
    public List<FriendDTO> searchUsers(@PathVariable String search){
        return userService.findMatchingUsers(search);
    }

    // GETS FRIEND MATCHING ID
    @GetMapping(path = "/friend-by-id/{id}")
    public FriendDTO getFriendById(@PathVariable int id){
        return userService.getFriendById(id);
    }
}
