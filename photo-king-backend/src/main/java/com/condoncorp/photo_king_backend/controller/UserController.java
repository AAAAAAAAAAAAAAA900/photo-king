package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(path = "api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/login")
    public UserDTO login(@RequestBody AuthRegReq authRegReq) {
        return userService.loginUser(authRegReq);
    }

    @PostMapping(path = "/register", consumes = {"application/json"})
    public UserDTO register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @GetMapping(path = "/get-user/{username}")
    public UserDTO getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @PostMapping(path="/add-friend/{userId}/{friendId}")
    public Set<User> addFriend(@PathVariable int userId, @PathVariable int friendId) {
        return userService.addFriend(userId, friendId);
    }

    @DeleteMapping(path = "/delete/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }

}
