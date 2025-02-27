package com.condoncorp.photo_king_backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${JWT_SECRET}")
    private String SECRET_KEY;

    @Value("${JWT_EXPIRATION}")
    private long EXPIRATION_TIME;

    @Value("${JWT_REFRESH_EXPIRATION}")
    private long REFRESH_EXPIRATION_TIME;

    public String generateToken(UserDetails userDetails) {
        Map<String, String> claim = new HashMap<>();
        claim.put("typeToken", "accessToken");
        return Jwts.builder()
                .claims(claim)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(EXPIRATION_TIME)))
                .signWith(generateKey())
                .compact();
    }

    public String generateRefreshToken(String username) {
        Map<String, String> claim = new HashMap<>();
        claim.put("typeToken", "refreshToken");
        return Jwts.builder()
                .claims(claim)
                .subject(username)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusMillis(REFRESH_EXPIRATION_TIME)))
                .signWith(generateKey())
                .compact();
    }

    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    public boolean isTokenValid(String token) {
        Claims claims = extractAllClaims(token);
        if (claims.get("typeToken").equals("refreshToken")) return false;
        return claims.getExpiration().after(Date.from(Instant.now()));
    }

    public boolean isTokenNonExpired(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getExpiration().after(Date.from(Instant.now()));
    }

    private SecretKey generateKey() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(decodedKey);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }





}
