package com.tus.EduDNSFilter.users_manager.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import com.tus.EduDNSFilter.users_manager.model.Role;
import com.tus.EduDNSFilter.users_manager.model.User;
import com.tus.EduDNSFilter.users_manager.service.UserService;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AdminController adminController;

    private User validUser;
    private User userWithoutRoles;

    @BeforeEach
    public void setup() {
        // Create a valid user with roles (using the Role enum)
        validUser = new User();
        validUser.setId(1L);
        validUser.setUsername("testUser");
        validUser.setRoles(Set.of(Role.ADMIN));

        // Create a user without roles (null roles)
        userWithoutRoles = new User();
        userWithoutRoles.setId(2L);
        userWithoutRoles.setUsername("noRoleUser");
        userWithoutRoles.setRoles(null);
    }

    @Test
    public void testRegisterUser_Success() {
        when(userService.registerUser(validUser)).thenReturn(validUser);

        User result = adminController.registerUser(validUser);
        assertNotNull(result, "Returned user should not be null");
        assertEquals("testUser", result.getUsername(), "Username should match");
        verify(userService, times(1)).registerUser(validUser);
    }

    @Test
    public void testRegisterUser_NoRoles() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            adminController.registerUser(userWithoutRoles);
        });
        assertTrue(exception.getMessage().contains("User roles must be provided in the JSON body."));
        verify(userService, never()).registerUser(any());
    }

    @Test
    public void testGetAllUsers() {
        List<User> users = Arrays.asList(validUser);
        when(userService.getAllUsers()).thenReturn(users);

        List<User> result = adminController.getAllUsers();
        assertNotNull(result, "User list should not be null");
        assertEquals(1, result.size(), "Should return one user");
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    public void testDeleteUser() {
        doNothing().when(userService).deleteUser(1L);
        ResponseEntity<?> response = adminController.deleteUser(1L);
        assertEquals(204, response.getStatusCodeValue(), "Response status should be 204 No Content");
        verify(userService, times(1)).deleteUser(1L);
    }

    @Test
    public void testUpdateUser() {
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setUsername("updatedUser");
        updatedUser.setRoles(Set.of(Role.ADMIN));

        when(userService.updateUser(1L, updatedUser)).thenReturn(updatedUser);

        ResponseEntity<User> response = adminController.updateUser(1L, updatedUser);
        assertEquals(200, response.getStatusCodeValue(), "Response status should be 200 OK");
        assertNotNull(response.getBody(), "Response body should not be null");
        assertEquals("updatedUser", response.getBody().getUsername(), "Username should be updated");
        verify(userService, times(1)).updateUser(1L, updatedUser);
    }
}
