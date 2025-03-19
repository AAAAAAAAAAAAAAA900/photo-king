package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.dto.UserProfileReq;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(path = "api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // RETURNS USER OBJECT BY USERNAME
    @GetMapping(path = "/get-user/{username}")
    public UserDTO getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    // ADDS A FRIEND TO USER'S FRIENDS LIST
    @PostMapping(path="/add-friend/{userId}/{friendId}")
    public Set<FriendDTO> addFriend(@PathVariable int userId, @PathVariable int friendId) {
        return userService.addFriend(userId, friendId);
    }
    // REMOVES A FRIEND FROM USER'S FRIENDS LIST
    @PostMapping(path="/remove-friend/{userId}/{friendId}")
    public Set<FriendDTO> removeFriend(@PathVariable int userId, @PathVariable int friendId) {
        return userService.removeFriend(userId, friendId);
    }

    // DELETES USER FROM DATABASE. REQUIRES USER ID.
    @DeleteMapping(path = "/delete/{id}")
    public void deleteUser(@PathVariable int id) throws IOException {
        userService.deleteUser(id);
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
    public UserDTO setUserProfile(@RequestBody UserProfileReq userProfileReq){
        return userService.setUserProfile(userProfileReq);
    }

    // GETS USERS MATCHING SEARCH QUERY
    @GetMapping(path = "/search-users/{search}")
    public List<FriendDTO> searchUsers(@PathVariable String search){
        return userService.findMatchingUsers(search);
    }
}
