package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.dto.UserRegisterDTO;
import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping(path = "api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // HANDLES USER LOGIN. ACCEPTS A USERNAME AND PASSWORD
    @PostMapping(path = "/login")
    public UserDTO login(@RequestBody AuthRegReq authRegReq) {
        return userService.loginUser(authRegReq);
    }

    // HANDLES USER REGISTRATION
    @PostMapping(path = "/register", consumes = {"application/json"})
    public UserDTO register(@RequestBody UserRegisterDTO user) {
        return userService.registerUser(user);
    }

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
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }

}
