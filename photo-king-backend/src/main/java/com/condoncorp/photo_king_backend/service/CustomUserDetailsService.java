package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.CustomUserDetails;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    // For security context: gets user details with ID from username
    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                new UsernameNotFoundException("Username or password is incorrect."));

        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }
}
