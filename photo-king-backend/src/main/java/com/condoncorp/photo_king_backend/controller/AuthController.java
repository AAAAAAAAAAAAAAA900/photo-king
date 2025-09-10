package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.AuthRegReq;
import com.condoncorp.photo_king_backend.dto.TokenReq;
import com.condoncorp.photo_king_backend.dto.UserRegisterReq;
import com.condoncorp.photo_king_backend.service.AppleService;
import com.condoncorp.photo_king_backend.service.CustomUserDetailsService;
import com.condoncorp.photo_king_backend.service.JwtService;
import com.condoncorp.photo_king_backend.service.UserService;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @Autowired
    private AppleService appleService;

    @PostMapping(path = "/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRegReq authRegReq) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRegReq.getUsername(), authRegReq.getPassword()));
            if (authentication.isAuthenticated()) {
                HashMap<String, String> tokens = new HashMap<>();
                tokens.put("accessToken", jwtService.generateToken(userDetailsService.loadUserByUsername(authRegReq.getUsername())));
                tokens.put("refreshToken", jwtService.generateRefreshToken(authRegReq.getUsername()));
                return ResponseEntity.ok(tokens);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
            }
        }
        catch(RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }

    }

    @PostMapping(path = "/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterReq userRegisterReq) {
        try {
            userService.registerUser(userRegisterReq);
            return ResponseEntity.ok("User registered successfully!");
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping(path = "/login/apple")
    public ResponseEntity<?> loginWithApple(@RequestBody TokenReq token) {
        try {
            return ResponseEntity.ok(appleService.verifyAppleUser(token.getToken()));
        }
        catch (InvalidJwtException | MalformedClaimException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping(path = "/refresh-token")
    public String generateToken(@RequestBody TokenReq token) {
        return userService.generateToken(token.getToken());
    }

    @PostMapping(path = "/validate-token")
    public boolean isTokenNonExpired(@RequestBody TokenReq token) {
        return userService.isTokenNonExpired(token.getToken());
    }

    @GetMapping(path = "/health-check")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }


}
