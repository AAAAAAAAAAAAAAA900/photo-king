package com.condoncorp.photo_king_backend.service;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.jose4j.jwk.HttpsJwks;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.resolvers.HttpsJwksVerificationKeyResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@Service
public class AppleService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private CustomUserDetailsService userDetailsService;


    private static final String APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";
    private static final String APPLE_ISSUER = "https://appleid.apple.com";
    private static final String BUNDLE_ID = "host.exp.Exponent";  // WILL CHANGE AFTER CONVERTING TO DEVELOPMENT BUILD

    public JwtClaims verifyIdentityToken(String identityToken) throws InvalidJwtException {
        HttpsJwks httpsJkws = new HttpsJwks(APPLE_KEYS_URL);

        HttpsJwksVerificationKeyResolver httpsJwksKeyResolver = new HttpsJwksVerificationKeyResolver(httpsJkws);

        JwtConsumer jwtConsumer = new JwtConsumerBuilder()
                .setVerificationKeyResolver(httpsJwksKeyResolver)
                .setExpectedIssuer(APPLE_ISSUER)
                .setExpectedAudience(BUNDLE_ID)
                .build();

        JwtClaims jwtClaims = jwtConsumer.processToClaims(identityToken);

        return jwtClaims;
    }

    public Map<String, String> verifyAppleUser(String identityToken) throws InvalidJwtException, MalformedClaimException {
        JwtClaims jwtClaims = verifyIdentityToken(identityToken);
        String appleId = jwtClaims.getSubject();

        Optional<User> user = userRepository.findByAppleId(appleId);

        // USER EXISTS
        if (user.isPresent()) {
            HashMap<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", jwtService.generateToken(userDetailsService.loadUserByUsername(user.get().getUsername())));
            tokens.put("refreshToken", jwtService.generateRefreshToken(user.get().getUsername()));
            return tokens;
        }
        // USER DOES NOT EXIST CREATE A NEW USER
        else {
            String[] parts = jwtClaims.getClaimValueAsString("email").split("@");
            String username = parts[0];
            User newUser = new User();
            newUser.setAppleId(appleId);
            newUser.setUsername(username);
            newUser.setPassword("");
            newUser.setName(username);
            newUser.setEmail(jwtClaims.getClaimValueAsString("email"));
            userRepository.save(newUser);
            HashMap<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", jwtService.generateToken(userDetailsService.loadUserByUsername(username)));
            tokens.put("refreshToken", jwtService.generateRefreshToken(username));
            return tokens;
        }

    }





}
