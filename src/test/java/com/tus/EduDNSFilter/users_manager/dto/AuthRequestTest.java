package com.tus.EduDNSFilter.users_manager.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

public class AuthRequestTest {

    @Test
    void testParameterizedConstructor() {
        // Given
        String expectedUsername = "testUser";
        String expectedPassword = "testPassword";
        
        // When
        AuthRequest authRequest = new AuthRequest(expectedUsername, expectedPassword);
        
        // Then
        assertEquals(expectedUsername, authRequest.getUsername(), "Username should match the value provided in the constructor");
        assertEquals(expectedPassword, authRequest.getPassword(), "Password should match the value provided in the constructor");
    }

    @Test
    void testDefaultConstructorAndSetters() {
        // When
        AuthRequest authRequest = new AuthRequest();
        
        // Initially the fields should be null
        assertNull(authRequest.getUsername(), "Username should be null after using the default constructor");
        assertNull(authRequest.getPassword(), "Password should be null after using the default constructor");
        
        // Given new values
        String newUsername = "newUser";
        String newPassword = "newPassword";
        
        // When setting values
        authRequest.setUsername(newUsername);
        authRequest.setPassword(newPassword);
        
        // Then
        assertEquals(newUsername, authRequest.getUsername(), "Username should match the value set using the setter");
        assertEquals(newPassword, authRequest.getPassword(), "Password should match the value set using the setter");
    }
}
