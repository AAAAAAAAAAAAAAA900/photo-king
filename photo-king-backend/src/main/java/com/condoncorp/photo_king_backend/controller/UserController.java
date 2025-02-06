package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/login")
    public User login(@RequestBody AuthRegReq authRegReq) {
        return userService.loginUser(authRegReq);
    }

    @PostMapping(path = "/register")
    public User register(@RequestBody UserDTO userDTO) {
        return userService.registerUser(userDTO);
    }

    @GetMapping(path = "/get-user/{username}")
    public User getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }



}
