package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.dto.TokenReq;
import com.condoncorp.photo_king_backend.dto.UserDTO;
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

import java.util.HashMap;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private UserService userService;

    @PostMapping(path = "/login")
    public HashMap<String, String> authenticateUser(@RequestBody AuthRegReq authRegReq) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRegReq.getUsername(), authRegReq.getPassword()));
        if (authentication.isAuthenticated()) {
            HashMap<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", jwtService.generateToken(userDetailsService.loadUserByUsername(authRegReq.getUsername())));
            tokens.put("refreshToken", jwtService.generateRefreshToken(authRegReq.getUsername()));
            return tokens;
        } else {
            throw new UsernameNotFoundException("Invalid user request.");
        }
    }

    @PostMapping(path = "/register")
    public UserDTO registerUser(@RequestBody UserRegisterDTO userRegisterDTO) {
        return userService.registerUser(userRegisterDTO);
    }

    @PostMapping(path = "/refresh-token")
    public String generateToken(@RequestBody TokenReq token) {
        return userService.generateToken(token.getToken());
    }

    @PostMapping(path = "/validate-token")
    public boolean isTokenNonExpired(@RequestBody TokenReq token) {
        return userService.isTokenNonExpired(token.getToken());
    }


}
