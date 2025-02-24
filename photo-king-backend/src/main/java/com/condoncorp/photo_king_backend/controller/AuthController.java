package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.dto.UserRegisterDTO;
import com.condoncorp.photo_king_backend.service.CustomUserDetailsService;
import com.condoncorp.photo_king_backend.service.JwtService;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtService jwtService;
    @Autowired
    CustomUserDetailsService userDetailsService;
    @Autowired
    private UserService userService;

    @GetMapping(path = "/login")
    public String authenticateUser(@RequestBody AuthRegReq authRegReq) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRegReq.getUsername(), authRegReq.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(userDetailsService.loadUserByUsername(authRegReq.getUsername()));
        } else {
            throw new UsernameNotFoundException("Invalid user request.");
        }
    }

    @PostMapping(path = "/register")
    public String registerUser(@RequestBody UserRegisterDTO userRegisterDTO) {
        return userService.registerUser(userRegisterDTO).toString();
    }
}
