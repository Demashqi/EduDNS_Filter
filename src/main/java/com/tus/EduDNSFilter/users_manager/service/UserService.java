package com.tus.EduDNSFilter.users_manager.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tus.EduDNSFilter.users_manager.dto.UserDTO;
import com.tus.EduDNSFilter.users_manager.model.Role;
import com.tus.EduDNSFilter.users_manager.model.User;
import com.tus.EduDNSFilter.users_manager.repository.UserRepository;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register a new user
    public UserDTO registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
        }
    
        user.setRoles(assignRoles(user.getRoles()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getUsername(), savedUser.getRoles());
    }
    

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String currentUsername = auth.getName();
    User currentUser = userRepository.findByUsername(currentUsername)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found"));

    if (currentUser.getRoles().contains(Role.ADMIN) && currentUser.getId().equals(id)) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admins cannot delete themselves.");
    }

    userRepository.delete(userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")));
}


    // Update user details
    public UserDTO updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user not found"));
    
        // Prevent admin from removing their own admin role
        if (currentUser.getId().equals(id) && currentUser.getRoles().contains(Role.ADMIN) && 
            (updatedUser.getRoles() == null || !updatedUser.getRoles().contains(Role.ADMIN))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admins cannot remove their own admin role.");
        }
    
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
    
        if (updatedUser.getRoles() != null && !updatedUser.getRoles().isEmpty()) {
            existingUser.setRoles(assignRoles(updatedUser.getRoles()));
        }
    
        User savedUser = userRepository.save(existingUser);
        return new UserDTO(savedUser.getUsername(), savedUser.getRoles());
    }
    
        
    //Helper method to assign roles to user
    private Set<Role> assignRoles(Set<Role> selectedRoles) {
    Set<Role> roles = new HashSet<>();
    if (selectedRoles.contains(Role.ADMIN)) {
        roles.add(Role.ADMIN);
        roles.add(Role.TEACHER);
    } else if (selectedRoles.contains(Role.TEACHER)) {
        roles.add(Role.TEACHER);
    }
    return roles;
}

    
}
