package com.tus.EduDNSFilter.users_manager.service;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.tus.EduDNSFilter.users_manager.model.User;
import com.tus.EduDNSFilter.users_manager.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElse(null);
            // .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"))
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }

        List<GrantedAuthority> authorities = user.getRoles().stream()
                                                .map(role -> new SimpleGrantedAuthority(role.name()))
                                                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(), user.getPassword(), authorities
        );
    }
}
