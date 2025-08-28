package com.condoncorp.photo_king_backend.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * Implementing what was found here:
 * https://stackoverflow.com/questions/62662036/how-do-i-configure-preauthorize-to-recognize-the-id-of-my-logged-in-user
 * to make user id accessible in method security annotations
 */
public class CustomUserDetails extends User {

    private final int id;

    public int getId() {
        return id;
    }

    public CustomUserDetails(int id, String username, String password,
                      Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.id = id;
    }

    public CustomUserDetails(int id, String username, String password,
                      boolean enabled, boolean accountNonExpired,
                      boolean credentialsNonExpired,
                      boolean accountNonLocked,
                      Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled,
                accountNonExpired, credentialsNonExpired,
                accountNonLocked, authorities);
        this.id = id;
    }
}