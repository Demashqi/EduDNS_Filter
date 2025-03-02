package com.tus.EduDNSFilter.users_manager.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.tus.EduDNSFilter.users_manager.model.User;
import com.tus.EduDNSFilter.users_manager.service.UserService;

import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User roles must be provided in the JSON body.");
        }
        return userService.registerUser(user);
    }

    // Get all users
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Delete a user by ID
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Update a user by ID
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);
    }
}
